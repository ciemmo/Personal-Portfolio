import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import WorkExperience from "@/models/WorkExperience";

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
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.company || !body.role || !body.startDate) {
      return NextResponse.json(
        { error: "Company, role, and start date are required" },
        { status: 400 }
      );
    }

    // Update the work experience
    const updatedWorkExperience = await WorkExperience.findByIdAndUpdate(
      id,
      {
        ...body,
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