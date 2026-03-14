import { describe, it, expect } from "vitest";
import { estimateSwdBatch } from "../swd-batch.js";

describe("estimateSwdBatch", () => {
  const threePages = [
    { url: "https://example.com/", weightBytes: 2_000_000 },
    { url: "https://example.com/about", weightBytes: 500_000 },
    { url: "https://example.com/blog", weightBytes: 1_000_000 },
  ];

  it("calculates total emissions as sum of individual pages", () => {
    const result = estimateSwdBatch(threePages);

    let expectedSum = 0;
    for (const page of result.pages) {
      expectedSum += page.emissionsPerVisitMg;
    }

    expect(result.totalEmissionsPerVisitMg).toBeCloseTo(expectedSum, 2);
  });

  it("sorts pages by emissions descending", () => {
    const result = estimateSwdBatch(threePages);

    for (let i = 1; i < result.pages.length; i++) {
      expect(result.pages[i - 1].emissionsPerVisitMg).toBeGreaterThanOrEqual(
        result.pages[i].emissionsPerVisitMg
      );
    }
  });

  it("identifies heaviest and lightest pages correctly", () => {
    const result = estimateSwdBatch(threePages);

    expect(result.heaviestPage).toBe("https://example.com/");
    expect(result.lightestPage).toBe("https://example.com/about");
  });

  it("calculates monthly emissions when monthlyVisitors is provided", () => {
    const result = estimateSwdBatch(threePages, 10_000);

    expect(result.totalMonthlyEmissionsKg).toBeDefined();
    expect(result.totalMonthlyEmissionsKg!).toBeGreaterThan(0);
  });

  it("does not include monthly emissions without monthlyVisitors", () => {
    const result = estimateSwdBatch(threePages);

    expect(result.totalMonthlyEmissionsKg).toBeUndefined();
  });

  it("has page percentages that sum to approximately 100", () => {
    const result = estimateSwdBatch(threePages);

    const percentSum = result.pages.reduce((sum, p) => sum + p.percentage, 0);
    expect(percentSum).toBeCloseTo(100, 0);
  });

  it("throws for empty pages array", () => {
    expect(() => estimateSwdBatch([])).toThrow("At least one page is required");
  });

  it("works with a single page", () => {
    const result = estimateSwdBatch([
      { url: "https://example.com/", weightBytes: 1_000_000 },
    ]);

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].percentage).toBe(100);
    expect(result.heaviestPage).toBe("https://example.com/");
    expect(result.lightestPage).toBe("https://example.com/");
  });

  it("accepts custom carbonIntensity", () => {
    const resultDefault = estimateSwdBatch(threePages);
    const resultLow = estimateSwdBatch(threePages, undefined, 100);

    expect(resultLow.totalEmissionsPerVisitMg).toBeLessThan(
      resultDefault.totalEmissionsPerVisitMg
    );
  });
});
