#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { calculateSci } from "./tools/sci-calculate.js";
import { estimateSwd } from "./tools/swd-estimate.js";
import { checkGreenHosting } from "./tools/green-hosting.js";
import { getGridIntensity } from "./tools/grid-intensity.js";
import { calculateWsgScore } from "./tools/wsg-score.js";

const server = new McpServer({
  name: "sustainable-code",
  version: "1.0.0",
});

// --- Tool: sci_calculate ---------------------------------------------------

server.tool(
  "sci_calculate",
  "Calculate the Software Carbon Intensity (SCI) score for a unit of work. " +
    "Uses the Green Software Foundation SCI formula to estimate milligrams of " +
    "CO2eq per functional unit based on wall-clock execution time, device power, " +
    "grid carbon intensity, and embodied emissions.",
  {
    wallTimeMs: z
      .number()
      .positive()
      .describe("Wall-clock execution time in milliseconds."),
    devicePowerW: z
      .number()
      .positive()
      .optional()
      .describe("Device power draw in watts. Defaults to 18 (M1 Pro)."),
    carbonIntensity: z
      .number()
      .positive()
      .optional()
      .describe(
        "Grid carbon intensity in gCO2eq/kWh. Defaults to 332 (GitHub Actions median)."
      ),
    embodiedTotalG: z
      .number()
      .positive()
      .optional()
      .describe(
        "Total embodied emissions in gCO2eq. Defaults to 211000 (Apple M1 Pro LCA)."
      ),
    lifetimeHours: z
      .number()
      .positive()
      .optional()
      .describe(
        "Expected device lifetime in hours. Defaults to 11680 (4 years, 8h/day)."
      ),
  },
  async (params) => {
    try {
      const result = calculateSci({
        wallTimeMs: params.wallTimeMs,
        devicePowerW: params.devicePowerW,
        carbonIntensity: params.carbonIntensity,
        embodiedTotalG: params.embodiedTotalG,
        lifetimeHours: params.lifetimeHours,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Tool: swd_estimate ----------------------------------------------------

server.tool(
  "swd_estimate",
  "Estimate per-page carbon emissions using the Sustainable Web Design (SWD) v4 " +
    "model. Calculates emissions per visit and optional monthly totals based on " +
    "page weight, visitor ratios, and grid carbon intensity.",
  {
    pageWeightBytes: z
      .number()
      .positive()
      .describe("Page weight (transfer size) in bytes."),
    monthlyVisitors: z
      .number()
      .positive()
      .optional()
      .describe(
        "Monthly unique visitors. If provided, monthly emissions are calculated."
      ),
    newVisitorRatio: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Ratio of new visitors (0-1). Defaults to 0.75."),
    returnCacheRatio: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe(
        "Cache hit ratio for returning visitors (0-1). Defaults to 0.02."
      ),
    carbonIntensity: z
      .number()
      .positive()
      .optional()
      .describe(
        "Grid carbon intensity in gCO2eq/kWh. Defaults to 494 (global average)."
      ),
  },
  async (params) => {
    try {
      const result = estimateSwd({
        pageWeightBytes: params.pageWeightBytes,
        monthlyVisitors: params.monthlyVisitors,
        newVisitorRatio: params.newVisitorRatio,
        returnCacheRatio: params.returnCacheRatio,
        carbonIntensity: params.carbonIntensity,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Tool: check_green_hosting ---------------------------------------------

server.tool(
  "check_green_hosting",
  "Check whether a domain is hosted on green (renewable energy) infrastructure " +
    "using The Green Web Foundation API. Returns hosting provider details if available.",
  {
    domain: z
      .string()
      .min(1)
      .describe(
        "Domain name to check (e.g., 'example.com'). Protocols and paths are stripped automatically."
      ),
  },
  async (params) => {
    try {
      const result = await checkGreenHosting(params.domain);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Tool: grid_carbon_intensity -------------------------------------------

server.tool(
  "grid_carbon_intensity",
  "Look up the grid carbon intensity (gCO2eq/kWh) for a country or region. " +
    "Uses data from the Ember Global Electricity Review 2022. " +
    "Use country code 'GLOBAL' for the world average.",
  {
    countryCode: z
      .string()
      .min(1)
      .describe(
        "ISO 3166-1 alpha-2 country code (e.g., 'US', 'DE', 'FR') or 'GLOBAL' for world average."
      ),
  },
  async (params) => {
    try {
      const result = getGridIntensity(params.countryCode);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Tool: wsg_compliance_score --------------------------------------------

server.tool(
  "wsg_compliance_score",
  "Parse a WSG (Web Sustainability Guidelines) compliance JSON file and calculate " +
    "a compliance score. The JSON file should contain an array of objects with " +
    "id, title, status ('full'|'partial'|'gap'|'na'), and optional category fields. " +
    "Returns the score percentage and a breakdown of gaps by category.",
  {
    filePath: z
      .string()
      .min(1)
      .describe("Absolute path to the wsg-compliance.json file."),
  },
  async (params) => {
    try {
      const result = await calculateWsgScore(params.filePath);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Start the server ------------------------------------------------------

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting sustainable-code MCP server:", err);
  process.exit(1);
});
