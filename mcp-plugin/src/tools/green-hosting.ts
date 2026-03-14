import type { GreenHostingResult } from "../lib/types.js";

const GREEN_WEB_API = "https://api.thegreenwebfoundation.org/greencheck";

/**
 * Check whether a domain is hosted on green (renewable energy) infrastructure
 * using The Green Web Foundation API.
 */
export async function checkGreenHosting(
  domain: string
): Promise<GreenHostingResult> {
  if (!domain || typeof domain !== "string") {
    throw new Error("A valid domain string is required.");
  }

  // Strip protocol and path if accidentally included
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();

  if (!cleanDomain) {
    throw new Error("A valid domain string is required after cleanup.");
  }

  const url = `${GREEN_WEB_API}/${encodeURIComponent(cleanDomain)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown network error";
    throw new Error(
      `Failed to reach The Green Web Foundation API: ${message}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `Green Web Foundation API returned HTTP ${response.status} for domain "${cleanDomain}".`
    );
  }

  const data = (await response.json()) as Record<string, unknown>;

  const result: GreenHostingResult = {
    domain: cleanDomain,
    green: data.green === true,
  };

  if (data.hosted_by && typeof data.hosted_by === "string") {
    result.hostedBy = data.hosted_by;
  }
  if (
    data.hosted_by_website &&
    typeof data.hosted_by_website === "string"
  ) {
    result.hostedByWebsite = data.hosted_by_website;
  }

  return result;
}
