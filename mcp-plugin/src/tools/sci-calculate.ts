import { SCI_DEFAULTS } from "../lib/constants.js";
import type { SciInput, SciResult } from "../lib/types.js";

/**
 * Calculate the Software Carbon Intensity (SCI) score for a unit of work.
 *
 * Formula:
 *   E = devicePowerW * wallTimeS / 3_600_000  (kWh)
 *   carbonOp = E * carbonIntensity * 1000  (mgCO2eq)
 *   carbonEmbodied = (embodiedTotalG / lifetimeHours) * (wallTimeS / 3600) * 1000  (mgCO2eq)
 *   SCI = carbonOp + carbonEmbodied  (mgCO2eq per functional unit)
 */
export function calculateSci(input: SciInput): SciResult {
  const {
    wallTimeMs,
    devicePowerW = SCI_DEFAULTS.devicePowerW,
    carbonIntensity = SCI_DEFAULTS.carbonIntensity,
    embodiedTotalG = SCI_DEFAULTS.embodiedTotalG,
    lifetimeHours = SCI_DEFAULTS.lifetimeHours,
  } = input;

  if (wallTimeMs <= 0) {
    throw new Error("wallTimeMs must be a positive number.");
  }

  const wallTimeS = wallTimeMs / 1000;

  // Energy consumed in kWh
  const energyKwh = (devicePowerW * wallTimeS) / 3_600_000;

  // Operational carbon in milligrams CO2eq
  const carbonOperationalMg = energyKwh * carbonIntensity * 1000;

  // Embodied carbon in milligrams CO2eq
  const carbonEmbodiedMg =
    (embodiedTotalG / lifetimeHours) * (wallTimeS / 3600) * 1000;

  // SCI = operational + embodied (mgCO2eq per functional unit)
  const sciMgCO2eq = carbonOperationalMg + carbonEmbodiedMg;

  return {
    sciMgCO2eq: round(sciMgCO2eq, 4),
    energyKwh: round(energyKwh, 8),
    carbonOperationalMg: round(carbonOperationalMg, 4),
    carbonEmbodiedMg: round(carbonEmbodiedMg, 4),
    wallTimeMs,
  };
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
