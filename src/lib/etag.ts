import { createHash } from "crypto";

/**
 * Generate a content-based ETag from data
 * Uses MD5 hash of JSON stringified data for consistency
 */
export function generateETag(data: unknown): string {
  const json = JSON.stringify(data);
  const hash = createHash("md5").update(json).digest("hex").substring(0, 16);
  return `"${hash}"`;
}

/**
 * Generate ETag from lastModified timestamp (for If-Modified-Since support)
 */
export function generateETagFromTimestamp(timestamp: number | Date): string {
  const time = typeof timestamp === "number" ? timestamp : timestamp.getTime();
  return `"${time.toString(16)}"`;
}

/**
 * Check if request has matching ETag (If-None-Match)
 * Returns true if client has current version (304 should be returned)
 */
export function checkETagMatch(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (!ifNoneMatch) return false;

  // Handle multiple ETags in If-None-Match (comma-separated)
  const etags = ifNoneMatch.split(",").map(e => e.trim());
  return etags.includes(etag) || etags.includes("*");
}

/**
 * Check if request has matching Last-Modified (If-Modified-Since)
 * Returns true if client has current version (304 should be returned)
 */
export function checkLastModifiedMatch(request: Request, lastModified: number | Date): boolean {
  const ifModifiedSince = request.headers.get("if-modified-since");
  if (!ifModifiedSince) return false;

  const clientTime = new Date(ifModifiedSince).getTime();
  const serverTime = typeof lastModified === "number" ? lastModified : lastModified.getTime();

  return clientTime >= serverTime;
}

/**
 * Create standard cache headers with proper ETag
 */
export function createCacheHeaders(
  data: unknown,
  options: {
    maxAge?: number;
    staleWhileRevalidate?: number;
    lastModified?: number | Date;
  } = {}
): HeadersInit {
  const { maxAge = 1800, staleWhileRevalidate = 86400, lastModified } = options;

  const etag = generateETag(data);
  const headers: Record<string, string> = {
    "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    "ETag": etag,
  };

  if (lastModified) {
    const time = typeof lastModified === "number" ? lastModified : lastModified.getTime();
    headers["Last-Modified"] = new Date(time).toUTCString();
  }

  return headers;
}

/**
 * Create 304 Not Modified response
 */
export function createNotModifiedResponse(etag: string, lastModified?: number | Date): Response {
  const headers: Record<string, string> = {
    "ETag": etag,
    "Cache-Control": "public, max-age=0, must-revalidate",
  };

  if (lastModified) {
    const time = typeof lastModified === "number" ? lastModified : lastModified.getTime();
    headers["Last-Modified"] = new Date(time).toUTCString();
  }

  return new Response(null, { status: 304, headers });
}