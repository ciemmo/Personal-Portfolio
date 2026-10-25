import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch project by slug from database
    const paramsData = await params;
    const project = await Project.findOne({ slug: paramsData.slug });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const projectPlain = project.toObject ? project.toObject() : project;

    // Generate content-based ETag
    const etag = generateETag(projectPlain);

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

    return NextResponse.json(projectPlain, {
      headers: createCacheHeaders(projectPlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}