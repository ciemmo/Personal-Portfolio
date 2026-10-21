import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);
const JWT_EXPIRES_IN = "1h";

/**
 * Create a JWT token for the given payload
 */
export async function createToken(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT token and return the payload if valid
 */
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to protect API routes
 * Returns NextResponse if unauthorized, or null if authorized (to continue)
 */
export async function authenticateRequest(): Promise<NextResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Token is valid, return null to allow request to continue
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Get the username from a valid token (if available)
 */
export async function getUsernameFromToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload || typeof payload !== 'object' || payload === null) {
      return null;
    }

    // Assuming payload has a username property
    return (payload as { username?: string }).username || null;
  } catch (error) {
    return null;
  }
}