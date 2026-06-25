// This service layer handles unit conversion and sufficiency checks for pantry items - recipes
package com.dishcision.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Conversion priority:
 * 1. Same unit = direct comparison
 * 2. Same unit group (WEIGHT/VOLUME/COUNT) = convert to base unit then compare
 * 3. Known cross-type (e.g. can → g) → apply known conversions
 * 4. Unknown cross-type → returns null, assume available and flag warning
 */
@Service
public class UnitConversionService {

    public enum UnitGroup {
        WEIGHT, VOLUME, COUNT
    }

    // List of known COUNT-to-COUNT conversions: "fromUnit:toUnit" =
    // (how many toUnits are in one fromUnit)
    private static final Map<String, BigDecimal> COUNT_TABLE = Map.ofEntries(
            // garlic: heads <-> cloves (1 head = 10 cloves)
            Map.entry("head:clove", new BigDecimal("10")),
            Map.entry("head:cloves", new BigDecimal("10")),
            Map.entry("heads:clove", new BigDecimal("10")),
            Map.entry("heads:cloves", new BigDecimal("10")),
            Map.entry("clove:head", new BigDecimal("0.1")),
            Map.entry("cloves:head", new BigDecimal("0.1")),
            Map.entry("clove:heads", new BigDecimal("0.1")),
            Map.entry("cloves:heads", new BigDecimal("0.1")),
            // onion: head <-> piece (1 onion head = 1 piece)
            Map.entry("head:piece", BigDecimal.ONE),
            Map.entry("head:pieces", BigDecimal.ONE),
            Map.entry("heads:piece", BigDecimal.ONE),
            Map.entry("heads:pieces", BigDecimal.ONE),
            Map.entry("piece:head", BigDecimal.ONE),
            Map.entry("pieces:head", BigDecimal.ONE),
            Map.entry("piece:heads", BigDecimal.ONE),
            Map.entry("pieces:heads", BigDecimal.ONE),
            // bunch <-> piece (herbs: 1 bunch ≈ 1 piece)
            Map.entry("bunch:piece", BigDecimal.ONE),
            Map.entry("bunch:pieces", BigDecimal.ONE),
            Map.entry("bunches:piece", BigDecimal.ONE),
            Map.entry("bunches:pieces", BigDecimal.ONE),
            Map.entry("piece:bunch", BigDecimal.ONE),
            Map.entry("pieces:bunch", BigDecimal.ONE),
            Map.entry("piece:bunches", BigDecimal.ONE),
            Map.entry("pieces:bunches", BigDecimal.ONE));

    // Cross-type conversions: "fromUnit:toUnit"
    // Used when pantry and recipe units are in different UnitGroups but a known
    // real-world equivalence exists (e.g. 1 can = 400 g)
    private static final Map<String, BigDecimal> CROSS_TYPE_TABLE = Map.of(
            "can:g", new BigDecimal("400"),
            "cans:g", new BigDecimal("400"),
            "g:can", new BigDecimal("0.0025"), // 1 g = 1/400 can
            "g:cans", new BigDecimal("0.0025"));

    // -------------------------------------------------------------------------
    // Public helper APIs for other service layers to use
    // -------------------------------------------------------------------------
    public UnitGroup getUnitGroup(String unit) {
        if (unit == null)
            return null;
        return switch (unit.toLowerCase().trim()) {
            case "g", "kg", "oz", "lb" -> UnitGroup.WEIGHT;
            case "ml", "l", "tsp", "tbsp", "cup", "cups" -> UnitGroup.VOLUME;
            case "piece", "pieces", "clove", "cloves",
                    "head", "heads", "bunch", "bunches", "can", "cans" ->
                UnitGroup.COUNT;
            default -> null;
        };
    }

    /**
     * Convert {qty} from {fromUnit} to {toUnit}.
     *
     * Returns converted value (scale 2, HALF_UP), or {@code null} if the
     * conversion is unknown (caller should treat as ASSUMED_AVAILABLE).
     */
    public BigDecimal convert(BigDecimal qty, String fromUnit, String toUnit) {
        if (qty == null)
            return null;
        String from = fromUnit.toLowerCase().trim();
        String to = toUnit.toLowerCase().trim();

        if (from.equals(to))
            return qty.setScale(2, RoundingMode.HALF_UP);

        UnitGroup fromGroup = getUnitGroup(from);
        UnitGroup toGroup = getUnitGroup(to);

        if (fromGroup == null || toGroup == null)
            return null;

        // Switch cases for equal unit groups - convert to a base unit
        if (fromGroup == toGroup) {
            return switch (fromGroup) {
                case WEIGHT -> {
                    BigDecimal grams = toGrams(qty, from);
                    yield grams == null ? null : fromGrams(grams, to);
                }
                case VOLUME -> {
                    BigDecimal ml = toMl(qty, from);
                    yield ml == null ? null : fromMl(ml, to);
                }
                case COUNT -> {
                    BigDecimal factor = COUNT_TABLE.get(from + ":" + to);
                    yield factor == null ? null
                            : qty.multiply(factor).setScale(2, RoundingMode.HALF_UP);
                }
            };
        }

        // Different unit groups — try the cross-type table
        BigDecimal factor = CROSS_TYPE_TABLE.get(from + ":" + to);
        return factor == null ? null
                : qty.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Returns true if availableQty is sufficient for neededQty,
     * Returns true if insufficient (ASSUMED_AVAILABLE)
     * Returns null if the units are incomparable (ASSUMED_AVAILABLE).
     */
    public Boolean isSufficient(BigDecimal needed, String neededUnit,
            BigDecimal available, String availableUnit) {
        // No quantity/unit available to check = assume present
        if (needed == null || available == null
                || neededUnit == null || availableUnit == null) {
            return true;
        }
        String nu = neededUnit.toLowerCase().trim();
        String au = availableUnit.toLowerCase().trim();

        // Equal units & unit group
        if (nu.equals(au)) {
            return available.compareTo(needed) >= 0;
        }
        // Convert needed quantity into the pantry item's unit for comparison
        BigDecimal neededInAvailUnit = convert(needed, nu, au);
        if (neededInAvailUnit == null)
            return null; // incomparable → ASSUMED_AVAILABLE

        return available.compareTo(neededInAvailUnit) >= 0;
    }

    // -------------------------------------------------------------------------
    // Weight helpers (public so tests can call directly)
    // -------------------------------------------------------------------------
    public BigDecimal toGrams(BigDecimal qty, String unit) {
        return switch (unit.toLowerCase().trim()) {
            case "g" -> qty;
            case "kg" -> qty.multiply(new BigDecimal("1000"));
            case "oz" -> qty.multiply(new BigDecimal("28.3495"));
            case "lb" -> qty.multiply(new BigDecimal("453.592"));
            default -> null;
        };
    }

    public BigDecimal fromGrams(BigDecimal grams, String targetUnit) {
        return switch (targetUnit.toLowerCase().trim()) {
            case "g" -> grams.setScale(2, RoundingMode.HALF_UP);
            case "kg" -> grams.divide(new BigDecimal("1000"), 2, RoundingMode.HALF_UP);
            case "oz" -> grams.divide(new BigDecimal("28.3495"), 2, RoundingMode.HALF_UP);
            case "lb" -> grams.divide(new BigDecimal("453.592"), 2, RoundingMode.HALF_UP);
            default -> null;
        };
    }

    // -------------------------------------------------------------------------
    // Volume helpers (public so tests can call directly)
    // -------------------------------------------------------------------------
    public BigDecimal toMl(BigDecimal qty, String unit) {
        return switch (unit.toLowerCase().trim()) {
            case "ml" -> qty;
            case "l" -> qty.multiply(new BigDecimal("1000"));
            case "tsp" -> qty.multiply(new BigDecimal("4.92892"));
            case "tbsp" -> qty.multiply(new BigDecimal("14.7868"));
            case "cup", "cups" -> qty.multiply(new BigDecimal("236.588"));
            default -> null;
        };
    }

    public BigDecimal fromMl(BigDecimal ml, String targetUnit) {
        return switch (targetUnit.toLowerCase().trim()) {
            case "ml" -> ml.setScale(2, RoundingMode.HALF_UP);
            case "l" -> ml.divide(new BigDecimal("1000"), 2, RoundingMode.HALF_UP);
            case "tsp" -> ml.divide(new BigDecimal("4.92892"), 2, RoundingMode.HALF_UP);
            case "tbsp" -> ml.divide(new BigDecimal("14.7868"), 2, RoundingMode.HALF_UP);
            case "cup", "cups" -> ml.divide(new BigDecimal("236.588"), 2, RoundingMode.HALF_UP);
            default -> null;
        };
    }
}
