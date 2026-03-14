/**
 * Input parameters for the SCI (Software Carbon Intensity) calculator.
 */
export interface SciInput {
  /** Wall-clock execution time in milliseconds. */
  wallTimeMs: number;
  /** Device power draw in watts. Defaults to SCI_DEFAULTS.devicePowerW. */
  devicePowerW?: number;
  /** Grid carbon intensity in gCO2eq/kWh. Defaults to SCI_DEFAULTS.carbonIntensity. */
  carbonIntensity?: number;
  /** Total embodied emissions in gCO2eq. Defaults to SCI_DEFAULTS.embodiedTotalG. */
  embodiedTotalG?: number;
  /** Expected device lifetime in hours. Defaults to SCI_DEFAULTS.lifetimeHours. */
  lifetimeHours?: number;
  /** Description of the functional unit (e.g., "per API request"). */
  functionalUnit?: string;
}

/**
 * Result of an SCI calculation.
 */
export interface SciResult {
  /** Total SCI score in milligrams CO2eq per functional unit. */
  sciMgCO2eq: number;
  /** Energy consumed in kilowatt-hours. */
  energyKwh: number;
  /** Operational carbon emissions in milligrams CO2eq. */
  carbonOperationalMg: number;
  /** Embodied carbon emissions in milligrams CO2eq. */
  carbonEmbodiedMg: number;
  /** Wall-clock time used for the calculation in milliseconds. */
  wallTimeMs: number;
}

/**
 * Input parameters for the SWD (Sustainable Web Design) v4 estimator.
 */
export interface SwdInput {
  /** Page weight (transfer size) in bytes. */
  pageWeightBytes: number;
  /** Monthly unique visitors. If provided, monthly emissions are calculated. */
  monthlyVisitors?: number;
  /** Ratio of new visitors (0 to 1). Defaults to SWD_DEFAULTS.defaultNewVisitorRatio. */
  newVisitorRatio?: number;
  /** Cache hit ratio for returning visitors (0 to 1). Defaults to SWD_DEFAULTS.defaultReturnCacheRatio. */
  returnCacheRatio?: number;
  /** Grid carbon intensity in gCO2eq/kWh. Defaults to SWD_DEFAULTS.globalCarbonIntensity. */
  carbonIntensity?: number;
}

/**
 * Breakdown of emissions by infrastructure segment.
 */
export interface SwdSegmentBreakdown {
  /** Emissions from data center operations in grams CO2eq. */
  dataCenters: number;
  /** Emissions from network transfer in grams CO2eq. */
  networks: number;
  /** Emissions from end-user devices in grams CO2eq. */
  userDevices: number;
}

/**
 * Result of an SWD v4 estimation.
 */
export interface SwdResult {
  /** Emissions per page visit in grams CO2eq. */
  emissionsPerVisitG: number;
  /** Emissions per page visit in milligrams CO2eq. */
  emissionsPerVisitMg: number;
  /** Total monthly emissions in kilograms CO2eq (only if monthlyVisitors provided). */
  monthlyEmissionsKg: number | null;
  /** Breakdown by infrastructure segment (per uncached page load, in grams). */
  breakdown: SwdSegmentBreakdown;
}

/**
 * Result of a green hosting check.
 */
export interface GreenHostingResult {
  /** The domain that was checked. */
  domain: string;
  /** Whether the domain is hosted on green infrastructure. */
  green: boolean;
  /** Name of the green hosting provider, if applicable. */
  hostedBy?: string;
  /** Website of the green hosting provider, if applicable. */
  hostedByWebsite?: string;
}

/**
 * Grid intensity data for a country or region.
 */
export interface GridIntensityResult {
  /** Country name. */
  country: string;
  /** ISO country code. */
  countryCode: string;
  /** Grid carbon intensity in gCO2eq/kWh. */
  intensity: number;
  /** Data source. */
  source: string;
  /** Year of the data. */
  year: number;
}

/**
 * A single WSG guideline gap entry.
 */
export interface WsgGap {
  /** Guideline identifier. */
  id: string;
  /** Guideline title or description. */
  title: string;
  /** Compliance status: "full", "partial", "gap", or "na". */
  status: string;
}

/**
 * Result of a WSG compliance score calculation.
 */
export interface WsgComplianceResult {
  /** Total number of guidelines evaluated. */
  totalGuidelines: number;
  /** Number of guidelines with full compliance. */
  full: number;
  /** Number of guidelines with partial compliance. */
  partial: number;
  /** Number of guidelines with a gap. */
  gap: number;
  /** Number of guidelines marked as not applicable. */
  na: number;
  /** Compliance score as a percentage (0-100). */
  scorePercent: number;
  /** Gaps grouped by category with their details. */
  gapsByCategory: Record<string, WsgGap[]>;
}
