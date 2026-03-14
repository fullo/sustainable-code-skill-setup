import { describe, it, expect } from "vitest";
import { getGridIntensity } from "../grid-intensity.js";

describe("getGridIntensity", () => {
  it("returns correct intensity for FR (France)", () => {
    const result = getGridIntensity("FR");
    expect(result.intensity).toBe(56);
    expect(result.country).toBe("France");
    expect(result.countryCode).toBe("FR");
    expect(result.source).toBeDefined();
    expect(result.year).toBeDefined();
  });

  it("returns correct intensity for US (United States)", () => {
    const result = getGridIntensity("US");
    expect(result.intensity).toBe(379);
    expect(result.country).toBe("United States");
  });

  it("returns correct intensity for SE (Sweden)", () => {
    const result = getGridIntensity("SE");
    expect(result.intensity).toBe(9);
  });

  it("returns correct intensity for DE (Germany)", () => {
    const result = getGridIntensity("DE");
    expect(result.intensity).toBe(338);
  });

  it("returns global average for GLOBAL", () => {
    const result = getGridIntensity("GLOBAL");
    expect(result.intensity).toBe(494);
    expect(result.country).toBe("Global Average");
  });

  it("handles case insensitivity (lowercase input)", () => {
    const lower = getGridIntensity("fr");
    const upper = getGridIntensity("FR");
    expect(lower.intensity).toBe(upper.intensity);
    expect(lower.countryCode).toBe("FR");
  });

  it("handles mixed case input", () => {
    const result = getGridIntensity("De");
    expect(result.intensity).toBe(338);
    expect(result.countryCode).toBe("DE");
  });

  it("throws for unknown country code", () => {
    expect(() => getGridIntensity("ZZ")).toThrow('Unknown country code "ZZ"');
  });

  it("throws for empty string", () => {
    expect(() => getGridIntensity("")).toThrow(
      "A valid country code string is required"
    );
  });
});
