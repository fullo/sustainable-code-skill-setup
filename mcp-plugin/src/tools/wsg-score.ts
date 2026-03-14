import { readFile } from "node:fs/promises";
import type { WsgComplianceResult, WsgGap } from "../lib/types.js";

/**
 * Expected shape of each guideline entry in the WSG compliance JSON file.
 */
interface WsgGuidelineEntry {
  id: string;
  title: string;
  category?: string;
  status: "full" | "partial" | "gap" | "na";
}

/**
 * Parse a WSG (Web Sustainability Guidelines) compliance JSON file and
 * calculate a compliance score.
 *
 * The JSON file should contain an array of guideline objects, each with at
 * minimum: id, title, status ("full" | "partial" | "gap" | "na"), and
 * optionally a category.
 *
 * Score formula: (full + partial * 0.5) / (total - na) * 100
 */
export async function calculateWsgScore(
  filePath: string
): Promise<WsgComplianceResult> {
  if (!filePath || typeof filePath !== "string") {
    throw new Error("A valid file path is required.");
  }

  let rawContent: string;
  try {
    rawContent = await readFile(filePath, "utf-8");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(
      `Could not read WSG compliance file at "${filePath}": ${message}`
    );
  }

  let guidelines: WsgGuidelineEntry[];
  try {
    const parsed = JSON.parse(rawContent) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("Expected a JSON array of guideline objects.");
    }
    guidelines = parsed as WsgGuidelineEntry[];
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON";
    throw new Error(`Failed to parse WSG compliance JSON: ${message}`);
  }

  if (guidelines.length === 0) {
    throw new Error("The WSG compliance file contains no guidelines.");
  }

  const validStatuses = new Set(["full", "partial", "gap", "na"]);
  let full = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;
  const gapsByCategory: Record<string, WsgGap[]> = {};

  for (const entry of guidelines) {
    if (!entry.id || !entry.status) {
      continue;
    }

    const status = entry.status.toLowerCase();
    if (!validStatuses.has(status)) {
      continue;
    }

    switch (status) {
      case "full":
        full++;
        break;
      case "partial":
        partial++;
        break;
      case "gap":
        gap++;
        break;
      case "na":
        na++;
        break;
    }

    // Collect gaps and partial compliance for the report
    if (status === "gap" || status === "partial") {
      const category = entry.category || "Uncategorized";
      if (!gapsByCategory[category]) {
        gapsByCategory[category] = [];
      }
      gapsByCategory[category].push({
        id: entry.id,
        title: entry.title || "(no title)",
        status,
      });
    }
  }

  const totalGuidelines = full + partial + gap + na;
  const scorable = totalGuidelines - na;

  let scorePercent = 0;
  if (scorable > 0) {
    scorePercent =
      Math.round(((full + partial * 0.5) / scorable) * 10000) / 100;
  }

  return {
    totalGuidelines,
    full,
    partial,
    gap,
    na,
    scorePercent,
    gapsByCategory,
  };
}
