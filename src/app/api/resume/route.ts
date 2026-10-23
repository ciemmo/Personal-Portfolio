import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch resume from database
    const resume = await Resume.findOne({});

    // Convert to plain object for JSON serialization
    const resumePlain = resume ? resume.toObject() : null;

    // Generate content-based ETag
    const etag = generateETag(resumePlain || {});

    // Check conditional request (If-None-Match)
    if (checkETagMatch(request, etag)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(resumePlain || {}, {
      headers: createCacheHeaders(resumePlain || {}, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const body = await request.json();

    // Update or create resume
    const updatedResume = await Resume.findOneAndUpdate(
      {},
      {
        ...body,
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Convert to plain object for JSON serialization
    const resumePlain = updatedResume.toObject ? updatedResume.toObject() : updatedResume;

    // Generate content-based ETag
    const etag = generateETag(resumePlain);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(resumePlain, {
      status: 200,
      headers: createCacheHeaders(resumePlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}