import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Achievement from "@/models/Achievement";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all achievements from database, sorted by date descending
    const achievements = await Achievement.find({}).sort({ date: -1 });

    // Convert to plain objects for JSON serialization
    const achievementsPlain = achievements.map(ach => ach.toObject ? ach.toObject() : ach);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(achievementsPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${achievementsPlain.length}-${Date.now()}"`,
      },
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
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    // Create new achievement
    const newAchievement = await Achievement.create({
      ...body,
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