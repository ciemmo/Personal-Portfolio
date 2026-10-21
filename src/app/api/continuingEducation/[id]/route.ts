import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ContinuingEducation from "@/models/ContinuingEducation";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const continuingEducation = await ContinuingEducation.findById(id);

    if (!continuingEducation) {
      return NextResponse.json(
        { error: "Continuing education not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const continuingEducationPlain = continuingEducation.toObject ? continuingEducation.toObject() : continuingEducation;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(continuingEducationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${continuingEducationPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching continuing education:", error);
    return NextResponse.json(
      { error: "Failed to fetch continuing education" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Update the continuing education with explicitly controlled fields
    const updatedContinuingEducation = await ContinuingEducation.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );

    if (!updatedContinuingEducation) {
      return NextResponse.json(
        { error: "Continuing education not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const continuingEducationPlain = updatedContinuingEducation.toObject ? updatedContinuingEducation.toObject() : updatedContinuingEducation;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(continuingEducationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${continuingEducationPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error updating continuing education:", error);
    return NextResponse.json(
      { error: "Failed to update continuing education" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const { id } = await params;
    const deletedEducation = await ContinuingEducation.findByIdAndDelete(id);

    if (!deletedEducation) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Education deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }
}