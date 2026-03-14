import { describe, it, expect } from "vitest";
import { estimateSwd } from "../swd-estimate.js";
import { SWD_DEFAULTS } from "../../lib/constants.js";

describe("estimateSwd", () => {
  it("estimates emissions for a 2MB page", () => {
    const result = estimateSwd({ pageWeightBytes: 2_000_000 });

    expect(result.emissionsPerVisitG).toBeGreaterThan(0);
    expect(result.emissionsPerVisitMg).toBeGreaterThan(0);
    expect(result.monthlyEmissionsKg).toBeNull();
    expect(result.breakdown.dataCenters).toBeGreaterThan(0);
    expect(result.breakdown.networks).toBeGreaterThan(0);
    expect(result.breakdown.userDevices).toBeGreaterThan(0);
  });

  it("has breakdown segments that sum to total uncached emissions", () => {
    const result = estimateSwd({ pageWeightBytes: 2_000_000 });

    const breakdownSum =
      result.breakdown.dataCenters +
      result.breakdown.networks +
      result.breakdown.userDevices;

    // The breakdown represents uncached per-segment emissions.
    // The emissionsPerVisitG applies visitor ratios on top of the total.
    // With default ratios, emissionsPerVisitG should be less than or equal
    // to the raw sum (since returning visitors use cache).
    expect(breakdownSum).toBeGreaterThan(0);
    expect(result.emissionsPerVisitG).toBeLessThanOrEqual(breakdownSum + 0.0001);
  });

  it("calculates monthly emissions when monthlyVisitors is provided", () => {
    const result = estimateSwd({
      pageWeightBytes: 2_000_000,
      monthlyVisitors: 10_000,
    });

    expect(result.monthlyEmissionsKg).not.toBeNull();
    expect(result.monthlyEmissionsKg!).toBeGreaterThan(0);
  });

  it("returns null monthlyEmissionsKg without monthlyVisitors", () => {
    const result = estimateSwd({ pageWeightBytes: 500_000 });
    expect(result.monthlyEmissionsKg).toBeNull();
  });

  it("accepts custom newVisitorRatio and returnCacheRatio", () => {
    const resultDefault = estimateSwd({ pageWeightBytes: 1_000_000 });
    const resultCustom = estimateSwd({
      pageWeightBytes: 1_000_000,
      newVisitorRatio: 0.5,
      returnCacheRatio: 0.5,
    });

    // Both should produce valid results
    expect(resultCustom.emissionsPerVisitG).toBeGreaterThan(0);
    // Different ratios should produce different emissions
    expect(resultCustom.emissionsPerVisitG).not.toBe(
      resultDefault.emissionsPerVisitG
    );
  });

  it("produces lower emissions with higher cache ratio", () => {
    const lowCache = estimateSwd({
      pageWeightBytes: 1_000_000,
      newVisitorRatio: 0.5,
      returnCacheRatio: 0.1,
    });
    const highCache = estimateSwd({
      pageWeightBytes: 1_000_000,
      newVisitorRatio: 0.5,
      returnCacheRatio: 0.9,
    });

    expect(highCache.emissionsPerVisitG).toBeLessThan(
      lowCache.emissionsPerVisitG
    );
  });

  it("throws for invalid pageWeightBytes", () => {
    expect(() => estimateSwd({ pageWeightBytes: 0 })).toThrow(
      "pageWeightBytes must be a positive number"
    );
    expect(() => estimateSwd({ pageWeightBytes: -1 })).toThrow(
      "pageWeightBytes must be a positive number"
    );
  });

  it("throws for invalid newVisitorRatio", () => {
    expect(() =>
      estimateSwd({ pageWeightBytes: 1000, newVisitorRatio: -0.1 })
    ).toThrow("newVisitorRatio must be between 0 and 1");
    expect(() =>
      estimateSwd({ pageWeightBytes: 1000, newVisitorRatio: 1.5 })
    ).toThrow("newVisitorRatio must be between 0 and 1");
  });

  it("throws for invalid returnCacheRatio", () => {
    expect(() =>
      estimateSwd({ pageWeightBytes: 1000, returnCacheRatio: -0.1 })
    ).toThrow("returnCacheRatio must be between 0 and 1");
    expect(() =>
      estimateSwd({ pageWeightBytes: 1000, returnCacheRatio: 1.5 })
    ).toThrow("returnCacheRatio must be between 0 and 1");
  });
});
