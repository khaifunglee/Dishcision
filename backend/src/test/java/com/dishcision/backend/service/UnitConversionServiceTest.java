// This file contains test cases for converting units of different groups
package com.dishcision.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class UnitConversionServiceTest {

    private UnitConversionService svc;

    @BeforeEach
    void setUp() {
        svc = new UnitConversionService();
    }

    // -------------------------------------------------------------------------
    // Same-unit passthrough
    // -------------------------------------------------------------------------

    @Test
    void convert_sameUnit_returnsUnchanged() {
        BigDecimal result = svc.convert(new BigDecimal("200"), "g", "g");
        assertEquals(0, new BigDecimal("200.00").compareTo(result));
    }

    // -------------------------------------------------------------------------
    // WEIGHT conversions
    // -------------------------------------------------------------------------

    @Test
    void convert_gToKg() {
        BigDecimal result = svc.convert(new BigDecimal("1000"), "g", "kg");
        assertEquals(0, new BigDecimal("1.00").compareTo(result));
    }

    @Test
    void convert_kgToG() {
        BigDecimal result = svc.convert(new BigDecimal("0.5"), "kg", "g");
        assertEquals(0, new BigDecimal("500.00").compareTo(result));
    }

    @Test
    void convert_ozToG() {
        BigDecimal result = svc.convert(new BigDecimal("1"), "oz", "g");
        assertTrue(result.compareTo(new BigDecimal("28")) > 0);
        assertTrue(result.compareTo(new BigDecimal("29")) < 0);
    }

    // -------------------------------------------------------------------------
    // VOLUME conversions
    // -------------------------------------------------------------------------

    @Test
    void convert_lToMl() {
        BigDecimal result = svc.convert(new BigDecimal("1"), "l", "ml");
        assertEquals(0, new BigDecimal("1000.00").compareTo(result));
    }

    @Test
    void convert_mlToL() {
        BigDecimal result = svc.convert(new BigDecimal("500"), "ml", "l");
        assertEquals(0, new BigDecimal("0.50").compareTo(result));
    }

    @Test
    void convert_cupToMl() {
        BigDecimal result = svc.convert(new BigDecimal("1"), "cup", "ml");
        assertTrue(result.compareTo(new BigDecimal("230")) > 0);
        assertTrue(result.compareTo(new BigDecimal("240")) < 0);
    }

    // -------------------------------------------------------------------------
    // COUNT conversions
    // -------------------------------------------------------------------------

    @Test
    void convert_headsToCloves() {
        BigDecimal result = svc.convert(new BigDecimal("2"), "heads", "cloves");
        assertEquals(0, new BigDecimal("20.00").compareTo(result));
    }

    @Test
    void convert_clovesToHeads() {
        BigDecimal result = svc.convert(new BigDecimal("10"), "cloves", "head");
        assertEquals(0, new BigDecimal("1.00").compareTo(result));
    }

    @Test
    void convert_headTopiece() {
        BigDecimal result = svc.convert(new BigDecimal("3"), "heads", "pieces");
        assertEquals(0, new BigDecimal("3.00").compareTo(result));
    }

    // -------------------------------------------------------------------------
    // Cross-type conversions
    // -------------------------------------------------------------------------

    @Test
    void convert_canToGrams() {
        BigDecimal result = svc.convert(new BigDecimal("1"), "can", "g");
        assertEquals(0, new BigDecimal("400.00").compareTo(result));
    }

    @Test
    void convert_cansToGrams_twoTins() {
        // 1 can = 400g
        BigDecimal result = svc.convert(new BigDecimal("2"), "cans", "g");
        assertEquals(0, new BigDecimal("800.00").compareTo(result));
    }

    @Test
    void convert_unknownCrossType_returnsNull() {
        // g to pieces has no known conversion
        assertNull(svc.convert(new BigDecimal("200"), "g", "pieces"));
    }

    @Test
    void convert_weightToVolume_returnsNull() {
        assertNull(svc.convert(new BigDecimal("200"), "g", "ml"));
    }

    // -------------------------------------------------------------------------
    // isSufficient
    // -------------------------------------------------------------------------

    @Test
    void isSufficient_sameUnit_sufficient() {
        assertTrue(svc.isSufficient(
                new BigDecimal("100"), "g", new BigDecimal("200"), "g"));
    }

    @Test
    void isSufficient_sameUnit_insufficient() {
        assertFalse(svc.isSufficient(
                new BigDecimal("300"), "g", new BigDecimal("200"), "g"));
    }

    @Test
    void isSufficient_crossWeight_sufficient() {
        // Need 200g, have 1 kg
        assertTrue(svc.isSufficient(
                new BigDecimal("200"), "g", new BigDecimal("1"), "kg"));
    }

    @Test
    void isSufficient_crossWeight_insufficient() {
        // Need 1.5 kg, have 1000 g
        assertFalse(svc.isSufficient(
                new BigDecimal("1.5"), "kg", new BigDecimal("1000"), "g"));
    }

    @Test
    void isSufficient_crossType_returnsNull() {
        // g vs pieces → incomparable
        assertNull(svc.isSufficient(
                new BigDecimal("200"), "g", new BigDecimal("3"), "pieces"));
    }

    @Test
    void isSufficient_nullQuantity_returnsTrue() {
        assertTrue(svc.isSufficient(null, "g", new BigDecimal("200"), "g"));
    }
}
