import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Achievement from "@/models/Achievement";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all achievements from database
    const achievements = await Achievement.find({}).sort({ date: -1 });

    // Convert to plain objects for JSON serialization
    const achievementsPlain = achievements.map(ach => ach.toObject ? ach.toObject() : ach);

    // Generate content-based ETag
    const etag = generateETag(achievementsPlain);

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

    return NextResponse.json(achievementsPlain, {
      headers: createCacheHeaders(achievementsPlain, { maxAge: thirtyMinutesInSeconds, staleWhileRevalidate: 86400 }),
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
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
    if (!body.title || !body.description || !body.date) {
      return NextResponse.json(
        { error: "Title, description, and date are required" },
        { status: 400 }
      );
    }

    // Create new achievement with explicitly controlled fields
    const newAchievement = await Achievement.create({
      title: typeof body.title === 'string' ? body.title : "",
      description: typeof body.description === 'string' ? body.description : "",
      date: typeof body.date === 'string' ? body.date : "",
      category: typeof body.category === 'string' ? body.category : "",
      icon: typeof body.icon === 'string' ? body.icon : "",
      url: typeof body.url === 'string' ? body.url : "",
    });

    return NextResponse.json(
      newAchievement.toObject ? newAchievement.toObject() : newAchievement,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}