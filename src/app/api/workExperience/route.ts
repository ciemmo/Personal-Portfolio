import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import WorkExperience from "@/models/WorkExperience";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all work experiences from database, sorted by startDate descending
    const workExperiences = await WorkExperience.find({}).sort({ startDate: -1 });

    // Convert to plain objects for JSON serialization
    const workExperiencesPlain = workExperiences.map(exp => exp.toObject ? exp.toObject() : exp);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(workExperiencesPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${workExperiencesPlain.length}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch work experiences" },
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
    if (!body.company || !body.role || !body.startDate) {
      return NextResponse.json(
        { error: "Company, role, and start date are required" },
        { status: 400 }
      );
    }

    // Create new work experience with explicitly controlled fields
    const newWorkExperience = await WorkExperience.create({
      company: typeof body.company === 'string' ? body.company : "",
      role: typeof body.role === 'string' ? body.role : "",
      location: typeof body.location === 'string' ? body.location : "",
      startDate: typeof body.startDate === 'string' ? body.startDate : "",
      endDate: body.endDate === null || body.endDate === "" ? null : (typeof body.endDate === 'string' ? body.endDate : ""),
      duration: typeof body.duration === 'string' ? body.duration : "",
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      url: typeof body.url === 'string' ? body.url : "",
      logo: typeof body.logo === 'string' ? body.logo : "",
    });

    return NextResponse.json(
      newWorkExperience.toObject ? newWorkExperience.toObject() : newWorkExperience,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating work experience:", error);
    return NextResponse.json(
      { error: "Failed to create work experience" },
      { status: 500 }
    );
  }
}