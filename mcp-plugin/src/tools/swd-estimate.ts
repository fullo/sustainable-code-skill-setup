import { SWD_DEFAULTS } from "../lib/constants.js";
import type { SwdInput, SwdResult } from "../lib/types.js";

/**
 * Estimate page-level carbon emissions using the Sustainable Web Design (SWD) v4 model.
 *
 * Steps:
 * 1. Convert page weight from bytes to gigabytes.
 * 2. For each segment (dataCenters, networks, userDevices), calculate operational
 *    and embodied energy, then derive segment emissions.
 * 3. Apply visitor ratios (new vs returning with cache) to get per-visit emissions.
 * 4. Optionally calculate monthly emissions if visitor count is provided.
 */
export function estimateSwd(input: SwdInput): SwdResult {
  const {
    pageWeightBytes,
    monthlyVisitors,
    newVisitorRatio = SWD_DEFAULTS.defaultNewVisitorRatio,
    returnCacheRatio = SWD_DEFAULTS.defaultReturnCacheRatio,
    carbonIntensity = SWD_DEFAULTS.globalCarbonIntensity,
  } = input;

  if (pageWeightBytes <= 0) {
    throw new Error("pageWeightBytes must be a positive number.");
  }
  if (newVisitorRatio < 0 || newVisitorRatio > 1) {
    throw new Error("newVisitorRatio must be between 0 and 1.");
  }
  if (returnCacheRatio < 0 || returnCacheRatio > 1) {
    throw new Error("returnCacheRatio must be between 0 and 1.");
  }

  const pageWeightGB = pageWeightBytes / 1_000_000_000;
  const { energyIntensity } = SWD_DEFAULTS;

  // Calculate emissions per segment (in grams CO2eq)
  const segmentNames = ["dataCenters", "networks", "userDevices"] as const;
  const breakdown = { dataCenters: 0, networks: 0, userDevices: 0 };

  let totalEmissionsG = 0;

  for (const segment of segmentNames) {
    const operationalEnergy =
      pageWeightGB * energyIntensity.operational[segment];
    const embodiedEnergy =
      pageWeightGB * energyIntensity.embodied[segment];
    const totalEnergy = operationalEnergy + embodiedEnergy;
    const segmentEmissions = totalEnergy * carbonIntensity;

    breakdown[segment] = round(segmentEmissions, 6);
    totalEmissionsG += segmentEmissions;
  }

  // Apply visitor ratios to get per-visit emissions
  const newVisitorEmissions = totalEmissionsG * newVisitorRatio;
  const returnVisitorEmissions =
    totalEmissionsG * (1 - newVisitorRatio) * (1 - returnCacheRatio);
  const emissionsPerVisitG = newVisitorEmissions + returnVisitorEmissions;

  // Monthly emissions (if visitors provided)
  let monthlyEmissionsKg: number | null = null;
  if (monthlyVisitors !== undefined && monthlyVisitors > 0) {
    monthlyEmissionsKg = round(
      (emissionsPerVisitG * monthlyVisitors) / 1000,
      4
    );
  }

  return {
    emissionsPerVisitG: round(emissionsPerVisitG, 6),
    emissionsPerVisitMg: round(emissionsPerVisitG * 1000, 4),
    monthlyEmissionsKg,
    breakdown,
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
