import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all projects from database
    const projects = await Project.find({}).sort({ name: 1 });

    // Convert to plain objects for JSON serialization
    const projectsPlain = projects.map(project => project.toObject ? project.toObject() : project);

    // Generate content-based ETag
    const etag = generateETag(projectsPlain);

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

    return NextResponse.json(projectsPlain, {
      headers: createCacheHeaders(projectsPlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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

    // Validate required fields
    if (!body.title || !body.description || !body.tech || !body.image) {
      return NextResponse.json(
        { error: "Title, description, technologies, and image are required" },
        { status: 400 }
      );
    }

    // Create new project with correctly mapped fields
    const newProject = await Project.create({
      title: body.title,
      description: body.description,
      tech: body.tech,
      skillRoles: body.skillRoles || [],
      github: body.github || "",
      demo: body.demo || "",
      image: body.image || "",
    });

    return NextResponse.json(
      newProject.toObject ? newProject.toObject() : newProject,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}