import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/models/Education";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all educations from database, sorted by startDate descending
    const educations = await Education.find({}).sort({ startDate: -1 });

    // Convert to plain objects for JSON serialization
    const educationsPlain = educations.map(edu => edu.toObject ? edu.toObject() : edu);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(educationsPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${educationsPlain.length}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching educations:", error);
    return NextResponse.json(
      { error: "Failed to fetch educations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.institution || !body.degree || !body.startDate) {
      return NextResponse.json(
        { error: "Institution, degree, and start date are required" },
        { status: 400 }
      );
    }

    // Create new education
    const newEducation = await Education.create({
      ...body,
    });

    return NextResponse.json(
      newEducation.toObject ? newEducation.toObject() : newEducation,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    );
  }
}