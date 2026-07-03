// This service layer handles unit conversion and sufficiency checks for pantry items - recipes
package com.dishcision.backend.service;

import org.springframework.stereotype.Service;

import com.dishcision.backend.model.Ingredient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

/**
 * Conversion priority:
 * 1. Same unit = direct comparison
 * 2. Same unit group (WEIGHT/VOLUME/COUNT) = convert to base unit then compare
 * 3. Cross-type (e.g. can → g) → use the ingredient's own known container
 * size, if any
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

    // Maps a COUNT unit's plural form to its singular, so a container lookup
    // (e.g. Ingredient.containerUnit = "can") matches either "can" or "cans"
    private static final Map<String, String> COUNT_UNIT_SINGULAR = Map.of(
            "pieces", "piece",
            "cloves", "clove",
            "jars", "jar",
            "heads", "head",
            "bunches", "bunch",
            "cans", "can");

    // -------------------------------------------------------------------------
    // Public helper APIs for other service layers to use
    // -------------------------------------------------------------------------
    public UnitGroup getUnitGroup(String unit) {
        if (unit == null)
            return null;
        return switch (unit.toLowerCase().trim()) {
            case "g", "kg", "oz", "lb" -> UnitGroup.WEIGHT;
            case "ml", "l", "tsp", "tbsp", "cup", "cups" -> UnitGroup.VOLUME;
            case "piece", "pieces", "clove", "cloves", "jar", "jars",
                    "head", "heads", "bunch", "bunches", "can", "cans" ->
                UnitGroup.COUNT;
            default -> null;
        };
    }

    /**
     * Convert {qty} from {fromUnit} to {toUnit}, with no ingredient context
     * for cross-group conversions (see the {@link Ingredient} overload).
     */
    public BigDecimal convert(BigDecimal qty, String fromUnit, String toUnit) {
        return convert(qty, fromUnit, toUnit, null);
    }

    /**
     * Convert {qty} from {fromUnit} to {toUnit}.
     *
     * When {fromUnit}/{toUnit} belong to different UnitGroups, {ingredient}'s
     * own container packaging (containerUnit/containerSize/defaultUnit) is
     * used to resolve the conversion
     *
     * Returns converted value (scale 2, HALF_UP), or {@code null} if the
     * conversion is unknown (caller should treat as ASSUMED_AVAILABLE).
     */
    public BigDecimal convert(BigDecimal qty, String fromUnit, String toUnit, Ingredient ingredient) {
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

        // Different unit groups, try the ingredient's known container size
        BigDecimal factor = containerFactor(ingredient, from, to);
        return factor == null ? null
                : qty.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Returns true if availableQty is sufficient for neededQty, with no
     * ingredient context for cross-group conversions.
     */
    public Boolean isSufficient(BigDecimal needed, String neededUnit,
            BigDecimal available, String availableUnit) {
        return isSufficient(needed, neededUnit, available, availableUnit, null);
    }

    /**
     * Returns true if availableQty is sufficient for neededQty,
     * Returns true if insufficient (ASSUMED_AVAILABLE)
     * Returns null if the units are incomparable (ASSUMED_AVAILABLE).
     */
    public Boolean isSufficient(BigDecimal needed, String neededUnit,
            BigDecimal available, String availableUnit, Ingredient ingredient) {
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
        BigDecimal neededInAvailUnit = convert(needed, nu, au, ingredient);
        if (neededInAvailUnit == null)
            return null; // incomparable → ASSUMED_AVAILABLE

        return available.compareTo(neededInAvailUnit) >= 0;
    }

    /**
     * Resolves a cross-group conversion factor from {ingredient}'s own known
     * container packaging. Returns null if the ingredient has no container info, or
     * {from}/{to} don't match its containerUnit/defaultUnit pair.
     */
    private BigDecimal containerFactor(Ingredient ingredient, String from, String to) {
        if (ingredient == null)
            return null;
        String containerUnit = ingredient.getContainerUnit();
        String baseUnit = ingredient.getDefaultUnit();
        BigDecimal size = ingredient.getContainerSize();
        // No known container conversion = unit mismatch
        if (containerUnit == null || baseUnit == null
                || size == null || size.compareTo(BigDecimal.ZERO) == 0)
            return null;

        String container = toSingularCount(containerUnit.toLowerCase().trim());
        String base = baseUnit.toLowerCase().trim();
        // If known container size matches given unit, return canonical converted
        // quantity
        if (toSingularCount(from).equals(container) && to.equals(base))
            return size;
        if (from.equals(base) && toSingularCount(to).equals(container))
            return BigDecimal.ONE.divide(size, 6, RoundingMode.HALF_UP);
        return null;
    }

    // Normalizes a COUNT unit to its singular form (e.g. "cans" -> "can")
    private String toSingularCount(String unit) {
        return COUNT_UNIT_SINGULAR.getOrDefault(unit, unit);
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
