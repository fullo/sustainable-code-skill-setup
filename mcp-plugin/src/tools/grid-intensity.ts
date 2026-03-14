import type { GridIntensityResult } from "../lib/types.js";

/**
 * Static lookup table of grid carbon intensity by country.
 * Source: Ember Global Electricity Review 2022.
 * Values are in gCO2eq/kWh.
 */
const GRID_INTENSITY_TABLE: Record<
  string,
  { country: string; intensity: number }
> = {
  FR: { country: "France", intensity: 56 },
  SE: { country: "Sweden", intensity: 9 },
  NO: { country: "Norway", intensity: 26 },
  GB: { country: "United Kingdom", intensity: 231 },
  DE: { country: "Germany", intensity: 338 },
  US: { country: "United States", intensity: 379 },
  CN: { country: "China", intensity: 549 },
  IN: { country: "India", intensity: 632 },
  BR: { country: "Brazil", intensity: 61 },
  JP: { country: "Japan", intensity: 457 },
  AU: { country: "Australia", intensity: 503 },
  CA: { country: "Canada", intensity: 120 },
  IT: { country: "Italy", intensity: 371 },
  ES: { country: "Spain", intensity: 161 },
  KR: { country: "South Korea", intensity: 415 },
  GLOBAL: { country: "Global Average", intensity: 494 },
};

const DATA_SOURCE = "Ember Global Electricity Review";
const DATA_YEAR = 2022;

/**
 * Look up the grid carbon intensity for a given country code (ISO 3166-1 alpha-2).
 * Use "GLOBAL" to get the global average.
 *
 * Returns intensity in gCO2eq/kWh along with source metadata.
 */
export function getGridIntensity(countryCode: string): GridIntensityResult {
  if (!countryCode || typeof countryCode !== "string") {
    throw new Error("A valid country code string is required.");
  }

  const code = countryCode.trim().toUpperCase();
  const entry = GRID_INTENSITY_TABLE[code];

  if (!entry) {
    const available = Object.keys(GRID_INTENSITY_TABLE).join(", ");
    throw new Error(
      `Unknown country code "${code}". Available codes: ${available}`
    );
  }

  return {
    country: entry.country,
    countryCode: code,
    intensity: entry.intensity,
    source: DATA_SOURCE,
    year: DATA_YEAR,
  };
}
