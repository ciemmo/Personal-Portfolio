import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticateRequest } from "@/lib/auth";

export async function POST() {
  // Authenticate the request - you need to be logged in to log out
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    const response = NextResponse.json({ success: true });

    // Clear the cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}