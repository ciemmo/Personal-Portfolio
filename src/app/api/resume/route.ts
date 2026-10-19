import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch resume from database
    const resume = await Resume.findOne({});

    // Convert to plain object for JSON serialization
    const resumePlain = resume ? resume.toObject() : null;

    return NextResponse.json(resumePlain || {});
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
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

    // Update or create resume
    const updatedResume = await Resume.findOneAndUpdate(
      {},
      {
        ...body,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(
      updatedResume.toObject ? updatedResume.toObject() : updatedResume,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}