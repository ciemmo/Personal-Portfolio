import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `fetch` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {
    const cookieStore = request.cookies;
    const token = cookieStore.get("token")?.value;

    if (!token) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = request.nextUrl.search; // Preserve search params
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
      await jwtVerify(token, secret);
      // Token is valid, continue with request
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = request.nextUrl.search;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};