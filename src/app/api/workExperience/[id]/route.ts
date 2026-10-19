import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import WorkExperience from "@/models/WorkExperience";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const workExperience = await WorkExperience.findById(id);

    if (!workExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workExperience.toObject ? workExperience.toObject() : workExperience);
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return NextResponse.json(
      { error: "Failed to fetch work experience" },
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

    // Update the work experience with explicitly controlled fields
    const updatedWorkExperience = await WorkExperience.findByIdAndUpdate(
      id,
      {
        company: typeof body.company === 'string' ? body.company : "",
        role: typeof body.role === 'string' ? body.role : "",
        location: typeof body.location === 'string' ? body.location : "",
        startDate: typeof body.startDate === 'string' ? body.startDate : "",
        endDate: body.endDate === null || body.endDate === "" ? null : (typeof body.endDate === 'string' ? body.endDate : ""),
        duration: typeof body.duration === 'string' ? body.duration : "",
        responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
        technologies: Array.isArray(body.technologies) ? body.technologies : [],
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
        url: typeof body.url === 'string' ? body.url : "",
        logo: typeof body.logo === 'string' ? body.logo : "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorkExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedWorkExperience.toObject ? updatedWorkExperience.toObject() : updatedWorkExperience);
  } catch (error) {
    console.error("Error updating work experience:", error);
    return NextResponse.json(
      { error: "Failed to update work experience" },
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
    const deletedWorkExperience = await WorkExperience.findByIdAndDelete(id);

    if (!deletedWorkExperience) {
      return NextResponse.json(
        { error: "Work experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Work experience deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return NextResponse.json(
      { error: "Failed to delete work experience" },
      { status: 500 }
    );
  }
}