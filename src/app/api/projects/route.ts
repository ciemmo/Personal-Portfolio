import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all projects from database
    const projects = await Project.find({}).sort({ name: 1 });

    // Convert to plain objects for JSON serialization
    const projectsPlain = projects.map(project => project.toObject ? project.toObject() : project);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(projectsPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${projectsPlain.length}-${Date.now()}"`,
      },
    );
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
    if (!body.name || !body.description || !body.technologies || !body.imageUrl || !body.sourceUrl || !body.liveUrl) {
      return NextResponse.json(
        { error: "Name, description, technologies, imageUrl, sourceUrl, and liveUrl are required" },
        { status: 400 }
      );
    }

    // Create new project
    const newProject = await Project.create({
      ...body,
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