import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ContinuingEducation from "@/models/ContinuingEducation";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all continuing education records from database
    const continuingEducation = await ContinuingEducation.find({}).sort({ startDate: -1 });

    // Convert to plain objects for JSON serialization
    const continuingEducationPlain = continuingEducation.map(ce => ce.toObject ? ce.toObject() : ce);

    // Generate content-based ETag
    const etag = generateETag(continuingEducationPlain);

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

    return NextResponse.json(continuingEducationPlain, {
      headers: createCacheHeaders(continuingEducationPlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error fetching continuing education:", error);
    return NextResponse.json(
      { error: "Failed to fetch continuing education" },
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
    if (!body.institution || !body.degree || !body.fieldOfStudy || !body.startDate) {
      return NextResponse.json(
        { error: "Institution, degree, field of study, and start date are required" },
        { status: 400 }
      );
    }

    // Create new continuing education (as ContinuingEducation record) with explicitly controlled fields
    const newEducation = await ContinuingEducation.create({
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
      certificateUrl: typeof body.url === 'string' ? body.url : "",
    });

    return NextResponse.json(
      newEducation.toObject ? newEducation.toObject() : newEducation,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating continuing education:", error);
    return NextResponse.json(
      { error: "Failed to create continuing education" },
      { status: 500 }
    );
  }
}