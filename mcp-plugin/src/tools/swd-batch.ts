import { estimateSwd } from "./swd-estimate.js";
import type { SwdBatchPage, SwdBatchResult } from "../lib/types.js";

/**
 * Estimate SWD emissions for multiple pages at once.
 *
 * Calls the existing estimateSwd function for each page, aggregates results,
 * and sorts pages by emissions descending.
 */
export function estimateSwdBatch(
  pages: SwdBatchPage[],
  monthlyVisitors?: number,
  carbonIntensity?: number
): SwdBatchResult {
  if (!pages || pages.length === 0) {
    throw new Error("At least one page is required.");
  }

  const pageResults: Array<{
    url: string;
    weightBytes: number;
    emissionsPerVisitMg: number;
    percentage: number;
  }> = [];

  let totalEmissionsPerVisitMg = 0;

  for (const page of pages) {
    const result = estimateSwd({
      pageWeightBytes: page.weightBytes,
      carbonIntensity,
    });
    totalEmissionsPerVisitMg += result.emissionsPerVisitMg;
    pageResults.push({
      url: page.url,
      weightBytes: page.weightBytes,
      emissionsPerVisitMg: result.emissionsPerVisitMg,
      percentage: 0, // calculated below
    });
  }

  totalEmissionsPerVisitMg = round(totalEmissionsPerVisitMg, 4);

  // Calculate percentages and sort by emissions descending
  for (const page of pageResults) {
    page.percentage =
      totalEmissionsPerVisitMg > 0
        ? round((page.emissionsPerVisitMg / totalEmissionsPerVisitMg) * 100, 2)
        : 0;
  }

  pageResults.sort((a, b) => b.emissionsPerVisitMg - a.emissionsPerVisitMg);

  const heaviestPage = pageResults[0].url;
  const lightestPage = pageResults[pageResults.length - 1].url;

  let totalMonthlyEmissionsKg: number | undefined;
  if (monthlyVisitors !== undefined && monthlyVisitors > 0) {
    totalMonthlyEmissionsKg = round(
      (totalEmissionsPerVisitMg * monthlyVisitors) / 1_000_000,
      4
    );
  }

  return {
    totalEmissionsPerVisitMg,
    totalMonthlyEmissionsKg,
    pages: pageResults,
    heaviestPage,
    lightestPage,
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
