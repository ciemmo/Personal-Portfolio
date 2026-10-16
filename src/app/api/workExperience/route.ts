import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import WorkExperience from "@/models/WorkExperience";

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

    // Create new work experience
    const newWorkExperience = await WorkExperience.create({
      ...body,
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