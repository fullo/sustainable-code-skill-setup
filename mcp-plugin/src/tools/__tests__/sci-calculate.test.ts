import { describe, it, expect } from "vitest";
import { calculateSci } from "../sci-calculate.js";
import { SCI_DEFAULTS } from "../../lib/constants.js";

describe("calculateSci", () => {
  it("calculates SCI with default constants for wallTimeMs=1000", () => {
    const result = calculateSci({ wallTimeMs: 1000 });

    const wallTimeS = 1;
    const expectedEnergy =
      (SCI_DEFAULTS.devicePowerW * wallTimeS) / 3_600_000;
    const expectedCarbonOp = expectedEnergy * SCI_DEFAULTS.carbonIntensity * 1000;
    const expectedCarbonEmbodied =
      (SCI_DEFAULTS.embodiedTotalG / SCI_DEFAULTS.lifetimeHours) *
      (wallTimeS / 3600) *
      1000;
    const expectedSci = expectedCarbonOp + expectedCarbonEmbodied;

    expect(result.wallTimeMs).toBe(1000);
    expect(result.energyKwh).toBeCloseTo(expectedEnergy, 8);
    expect(result.carbonOperationalMg).toBeCloseTo(expectedCarbonOp, 4);
    expect(result.carbonEmbodiedMg).toBeCloseTo(expectedCarbonEmbodied, 4);
    expect(result.sciMgCO2eq).toBeCloseTo(expectedSci, 4);
  });

  it("calculates SCI with custom parameters", () => {
    const result = calculateSci({
      wallTimeMs: 5000,
      devicePowerW: 50,
      carbonIntensity: 400,
      embodiedTotalG: 300_000,
      lifetimeHours: 20_000,
    });

    const wallTimeS = 5;
    const expectedEnergy = (50 * wallTimeS) / 3_600_000;
    const expectedCarbonOp = expectedEnergy * 400 * 1000;
    const expectedCarbonEmbodied =
      (300_000 / 20_000) * (wallTimeS / 3600) * 1000;
    const expectedSci = expectedCarbonOp + expectedCarbonEmbodied;

    expect(result.energyKwh).toBeCloseTo(expectedEnergy, 8);
    expect(result.carbonOperationalMg).toBeCloseTo(expectedCarbonOp, 4);
    expect(result.carbonEmbodiedMg).toBeCloseTo(expectedCarbonEmbodied, 4);
    expect(result.sciMgCO2eq).toBeCloseTo(expectedSci, 4);
  });

  it("correctly computes energy, operational carbon, and embodied carbon", () => {
    const result = calculateSci({
      wallTimeMs: 2000,
      devicePowerW: 100,
      carbonIntensity: 500,
      embodiedTotalG: 100_000,
      lifetimeHours: 10_000,
    });

    const wallTimeS = 2;
    const E = (100 * wallTimeS) / 3_600_000;
    const carbonOp = E * 500 * 1000;
    const carbonEmbodied = (100_000 / 10_000) * (wallTimeS / 3600) * 1000;

    expect(result.energyKwh).toBeCloseTo(E, 8);
    expect(result.carbonOperationalMg).toBeCloseTo(carbonOp, 4);
    expect(result.carbonEmbodiedMg).toBeCloseTo(carbonEmbodied, 4);
    expect(result.sciMgCO2eq).toBeCloseTo(carbonOp + carbonEmbodied, 4);
  });

  it("handles very small wallTimeMs (1ms)", () => {
    const result = calculateSci({ wallTimeMs: 1 });

    expect(result.wallTimeMs).toBe(1);
    expect(result.sciMgCO2eq).toBeGreaterThan(0);
    expect(result.energyKwh).toBeGreaterThan(0);
    expect(result.carbonOperationalMg).toBeGreaterThan(0);
    expect(result.carbonEmbodiedMg).toBeGreaterThan(0);
  });

  it("handles very large wallTimeMs (1 hour)", () => {
    const result = calculateSci({ wallTimeMs: 3_600_000 });

    const wallTimeS = 3600;
    const expectedEnergy =
      (SCI_DEFAULTS.devicePowerW * wallTimeS) / 3_600_000;
    const expectedCarbonOp =
      expectedEnergy * SCI_DEFAULTS.carbonIntensity * 1000;
    const expectedCarbonEmbodied =
      (SCI_DEFAULTS.embodiedTotalG / SCI_DEFAULTS.lifetimeHours) *
      (wallTimeS / 3600) *
      1000;

    expect(result.wallTimeMs).toBe(3_600_000);
    expect(result.energyKwh).toBeCloseTo(expectedEnergy, 8);
    expect(result.carbonOperationalMg).toBeCloseTo(expectedCarbonOp, 2);
    expect(result.carbonEmbodiedMg).toBeCloseTo(expectedCarbonEmbodied, 2);
  });

  it("throws for wallTimeMs <= 0", () => {
    expect(() => calculateSci({ wallTimeMs: 0 })).toThrow(
      "wallTimeMs must be a positive number"
    );
    expect(() => calculateSci({ wallTimeMs: -100 })).toThrow(
      "wallTimeMs must be a positive number"
    );
  });
});
