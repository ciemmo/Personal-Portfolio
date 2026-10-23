import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/models/Education";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all educations from database, sorted by startDate descending
    const educations = await Education.find({}).sort({ startDate: -1 });

    // Convert to plain objects for JSON serialization
    const educationsPlain = educations.map(edu => edu.toObject ? edu.toObject() : edu);

    // Generate content-based ETag
    const etag = generateETag(educationsPlain);

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

    return NextResponse.json(educationsPlain, {
      headers: createCacheHeaders(educationsPlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
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
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

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

    // Create new education with explicitly controlled fields
    const newEducation = await Education.create({
      institution: typeof body.institution === 'string' ? body.institution : "",
      degree: typeof body.degree === 'string' ? body.degree : "",
      fieldOfStudy: typeof body.fieldOfStudy === 'string' ? body.fieldOfStudy : "",
      startDate: typeof body.startDate === 'string' ? body.startDate : "",
      endDate: body.endDate === null || body.endDate === "" ? null : (typeof body.endDate === 'string' ? body.endDate : ""),
      location: typeof body.location === 'string' ? body.location : "",
      description: typeof body.description === 'string' ? body.description : "",
      honors: Array.isArray(body.honors) ? body.honors : [],
      gpa: typeof body.gpa === 'string' ? body.gpa : "",
      activities: Array.isArray(body.activities) ? body.activities : [],
      certificateUrl: typeof body.certificateUrl === 'string' ? body.certificateUrl : "",
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