import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/models/Education";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const education = await Education.findById(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const educationPlain = education.toObject ? education.toObject() : education;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(educationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${educationPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Failed to fetch education" },
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

    // Update the education with explicitly controlled fields
    const updatedEducation = await Education.findByIdAndUpdate(
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

    if (!updatedEducation) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const educationPlain = updatedEducation.toObject ? updatedEducation.toObject() : updatedEducation;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(educationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${educationPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { error: "Failed to update education" },
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
    const deletedEducation = await Education.findByIdAndDelete(id);

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