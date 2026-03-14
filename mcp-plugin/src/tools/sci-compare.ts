import type { SciCompareInput, SciCompareResult } from "../lib/types.js";

/**
 * Compare two SCI measurements and report the delta.
 *
 * Calculates absolute and percentage change between a baseline and current
 * SCI value, and produces a human-readable summary string.
 */
export function compareSci(input: SciCompareInput): SciCompareResult {
  const {
    baselineSciMg,
    currentSciMg,
    baselineLabel = "baseline",
    currentLabel = "current",
  } = input;

  if (baselineSciMg <= 0) {
    throw new Error("baselineSciMg must be a positive number.");
  }
  if (currentSciMg <= 0) {
    throw new Error("currentSciMg must be a positive number.");
  }

  const deltaMg = round(currentSciMg - baselineSciMg, 4);
  const deltaPercent = round(
    ((currentSciMg - baselineSciMg) / baselineSciMg) * 100,
    2
  );
  const improved = currentSciMg < baselineSciMg;

  const direction = improved ? "improved" : deltaMg === 0 ? "unchanged" : "regressed";
  const absPercent = Math.abs(deltaPercent);

  let summary: string;
  if (deltaMg === 0) {
    summary = `SCI unchanged at ${baselineSciMg} mgCO2eq`;
  } else {
    summary =
      `SCI ${direction} by ${absPercent}% ` +
      `(from ${baselineSciMg} to ${currentSciMg} mgCO2eq)`;
  }

  return {
    baselineLabel,
    baselineSciMg,
    currentLabel,
    currentSciMg,
    deltaMg,
    deltaPercent,
    improved,
    summary,
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
