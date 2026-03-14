import { describe, it, expect, afterEach } from "vitest";
import { calculateWsgScore } from "../wsg-score.js";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TMP_DIR = join(tmpdir(), "wsg-score-tests");
const tempFiles: string[] = [];

async function writeTempJson(name: string, data: unknown): Promise<string> {
  await mkdir(TMP_DIR, { recursive: true });
  const filePath = join(TMP_DIR, name);
  await writeFile(filePath, JSON.stringify(data), "utf-8");
  tempFiles.push(filePath);
  return filePath;
}

afterEach(async () => {
  for (const f of tempFiles) {
    try {
      await unlink(f);
    } catch {
      // ignore
    }
  }
  tempFiles.length = 0;
});

function makeGuideline(
  id: string,
  status: string,
  category = "General"
): { id: string; title: string; category: string; status: string } {
  return { id, title: `Guideline ${id}`, category, status };
}

describe("calculateWsgScore", () => {
  it("scores 100% when all guidelines are full", async () => {
    const data = [
      makeGuideline("1", "full"),
      makeGuideline("2", "full"),
      makeGuideline("3", "full"),
    ];
    const filePath = await writeTempJson("all-full.json", data);
    const result = await calculateWsgScore(filePath);

    expect(result.scorePercent).toBe(100);
    expect(result.full).toBe(3);
    expect(result.partial).toBe(0);
    expect(result.gap).toBe(0);
    expect(result.na).toBe(0);
    expect(result.totalGuidelines).toBe(3);
  });

  it("scores 0% when all guidelines are gap", async () => {
    const data = [
      makeGuideline("1", "gap"),
      makeGuideline("2", "gap"),
      makeGuideline("3", "gap"),
    ];
    const filePath = await writeTempJson("all-gap.json", data);
    const result = await calculateWsgScore(filePath);

    expect(result.scorePercent).toBe(0);
    expect(result.gap).toBe(3);
    expect(result.full).toBe(0);
  });

  it("counts partial as 0.5 in the score", async () => {
    const data = [
      makeGuideline("1", "partial"),
      makeGuideline("2", "partial"),
    ];
    const filePath = await writeTempJson("all-partial.json", data);
    const result = await calculateWsgScore(filePath);

    // (0 + 2 * 0.5) / 2 * 100 = 50%
    expect(result.scorePercent).toBe(50);
    expect(result.partial).toBe(2);
  });

  it("excludes na guidelines from the denominator", async () => {
    const data = [
      makeGuideline("1", "full"),
      makeGuideline("2", "na"),
      makeGuideline("3", "na"),
    ];
    const filePath = await writeTempJson("with-na.json", data);
    const result = await calculateWsgScore(filePath);

    // 1 full out of 1 scorable (2 na excluded) = 100%
    expect(result.scorePercent).toBe(100);
    expect(result.na).toBe(2);
    expect(result.totalGuidelines).toBe(3);
  });

  it("calculates correctly with a mix of statuses", async () => {
    const data = [
      makeGuideline("1", "full"),
      makeGuideline("2", "full"),
      makeGuideline("3", "partial"),
      makeGuideline("4", "gap"),
      makeGuideline("5", "na"),
    ];
    const filePath = await writeTempJson("mixed.json", data);
    const result = await calculateWsgScore(filePath);

    // scorable = 5 - 1 = 4
    // score = (2 + 0.5) / 4 * 100 = 62.5
    expect(result.scorePercent).toBe(62.5);
    expect(result.full).toBe(2);
    expect(result.partial).toBe(1);
    expect(result.gap).toBe(1);
    expect(result.na).toBe(1);
    expect(result.totalGuidelines).toBe(5);
  });

  it("includes gaps in gapsByCategory", async () => {
    const data = [
      makeGuideline("1", "gap", "Design"),
      makeGuideline("2", "partial", "Design"),
      makeGuideline("3", "full", "Performance"),
    ];
    const filePath = await writeTempJson("gaps-by-cat.json", data);
    const result = await calculateWsgScore(filePath);

    expect(result.gapsByCategory["Design"]).toHaveLength(2);
    expect(result.gapsByCategory["Performance"]).toBeUndefined();
  });

  it("throws for file not found", async () => {
    await expect(
      calculateWsgScore("/nonexistent/path/wsg.json")
    ).rejects.toThrow("Could not read WSG compliance file");
  });

  it("throws for invalid file path", async () => {
    await expect(calculateWsgScore("")).rejects.toThrow(
      "A valid file path is required"
    );
  });

  it("throws for empty guidelines array", async () => {
    const filePath = await writeTempJson("empty.json", []);
    await expect(calculateWsgScore(filePath)).rejects.toThrow(
      "contains no guidelines"
    );
  });
});
