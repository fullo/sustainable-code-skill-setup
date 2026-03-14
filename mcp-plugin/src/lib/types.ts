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
 * A single issue found by the Creedengo code checker.
 */
export interface CreedengoIssue {
  /** Line number where the issue was found. */
  line: number;
  /** Rule identifier (e.g., "GCI69"). */
  rule: string;
  /** Severity level. */
  severity: "warning" | "info";
  /** Description of the issue. */
  message: string;
  /** Suggested fix. */
  suggestion: string;
}

/**
 * Result of a Creedengo code check.
 */
export interface CreedengoResult {
  /** Path to the file that was checked. */
  filePath: string;
  /** Detected or overridden language. */
  language: string;
  /** Total number of issues found. */
  issuesFound: number;
  /** List of issues. */
  issues: CreedengoIssue[];
}

/**
 * Input parameters for an SCI comparison.
 */
export interface SciCompareInput {
  /** Baseline SCI value in mgCO2eq. */
  baselineSciMg: number;
  /** Current SCI value in mgCO2eq. */
  currentSciMg: number;
  /** Label for the baseline measurement. */
  baselineLabel?: string;
  /** Label for the current measurement. */
  currentLabel?: string;
}

/**
 * Result of an SCI comparison.
 */
export interface SciCompareResult {
  /** Label for the baseline measurement. */
  baselineLabel: string;
  /** Baseline SCI value in mgCO2eq. */
  baselineSciMg: number;
  /** Label for the current measurement. */
  currentLabel: string;
  /** Current SCI value in mgCO2eq. */
  currentSciMg: number;
  /** Absolute delta in mgCO2eq (current - baseline). */
  deltaMg: number;
  /** Percentage change from baseline. */
  deltaPercent: number;
  /** Whether the current value is an improvement (lower). */
  improved: boolean;
  /** Human-readable summary string. */
  summary: string;
}

/**
 * A single page entry for SWD batch estimation.
 */
export interface SwdBatchPage {
  /** URL of the page. */
  url: string;
  /** Transfer size of the page in bytes. */
  weightBytes: number;
}

/**
 * Result of a batch SWD estimation across multiple pages.
 */
export interface SwdBatchResult {
  /** Sum of per-visit emissions for all pages in mgCO2eq. */
  totalEmissionsPerVisitMg: number;
  /** Total monthly emissions in kgCO2eq (only if monthlyVisitors provided). */
  totalMonthlyEmissionsKg?: number;
  /** Per-page breakdown sorted by emissions descending. */
  pages: Array<{
    url: string;
    weightBytes: number;
    emissionsPerVisitMg: number;
    percentage: number;
  }>;
  /** URL of the page with highest emissions. */
  heaviestPage: string;
  /** URL of the page with lowest emissions. */
  lightestPage: string;
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
