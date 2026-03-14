import { describe, it, expect } from "vitest";
import { compareSci } from "../sci-compare.js";

describe("compareSci", () => {
  it("reports improvement when current is lower than baseline", () => {
    const result = compareSci({
      baselineSciMg: 45.2,
      currentSciMg: 38.3,
    });

    expect(result.improved).toBe(true);
    expect(result.deltaMg).toBeLessThan(0);
    expect(result.deltaPercent).toBeCloseTo(-15.27, 1);
    expect(result.summary).toContain("improved");
    expect(result.summary).toContain("45.2");
    expect(result.summary).toContain("38.3");
  });

  it("reports regression when current is higher than baseline", () => {
    const result = compareSci({
      baselineSciMg: 45.2,
      currentSciMg: 48.9,
    });

    expect(result.improved).toBe(false);
    expect(result.deltaMg).toBeGreaterThan(0);
    expect(result.deltaPercent).toBeGreaterThan(0);
    expect(result.summary).toContain("regressed");
  });

  it("reports no change when values are equal", () => {
    const result = compareSci({
      baselineSciMg: 45.2,
      currentSciMg: 45.2,
    });

    expect(result.deltaMg).toBe(0);
    expect(result.deltaPercent).toBe(0);
    expect(result.improved).toBe(false);
    expect(result.summary).toContain("unchanged");
  });

  it("uses custom labels", () => {
    const result = compareSci({
      baselineSciMg: 50,
      currentSciMg: 40,
      baselineLabel: "v1.0",
      currentLabel: "v2.0",
    });

    expect(result.baselineLabel).toBe("v1.0");
    expect(result.currentLabel).toBe("v2.0");
  });

  it("uses default labels when not provided", () => {
    const result = compareSci({
      baselineSciMg: 50,
      currentSciMg: 40,
    });

    expect(result.baselineLabel).toBe("baseline");
    expect(result.currentLabel).toBe("current");
  });

  it("includes correct direction word in summary for improvement", () => {
    const result = compareSci({
      baselineSciMg: 100,
      currentSciMg: 80,
    });

    expect(result.summary).toMatch(/improved/);
    expect(result.summary).toContain("20%");
  });

  it("includes correct direction word in summary for regression", () => {
    const result = compareSci({
      baselineSciMg: 100,
      currentSciMg: 110,
    });

    expect(result.summary).toMatch(/regressed/);
    expect(result.summary).toContain("10%");
  });

  it("throws for non-positive baseline", () => {
    expect(() =>
      compareSci({ baselineSciMg: 0, currentSciMg: 10 })
    ).toThrow("baselineSciMg must be a positive number");
  });

  it("throws for non-positive current", () => {
    expect(() =>
      compareSci({ baselineSciMg: 10, currentSciMg: -5 })
    ).toThrow("currentSciMg must be a positive number");
  });
});
