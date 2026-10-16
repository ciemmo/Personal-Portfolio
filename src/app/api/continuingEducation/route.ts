import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/models/Education";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all continuing educations from database
    // For now, we'll treat continuing education as a type of education
    // In the future, we could add a "type" field to distinguish if needed
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
    console.error("Error fetching continuing educations:", error);
    return NextResponse.json(
      { error: "Failed to fetch continuing educations" },
      { status: 500 }
    );
  }
}