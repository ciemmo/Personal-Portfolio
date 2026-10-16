import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Education from "@/models/Education";

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
        { error: "Continuing education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education.toObject ? education.toObject() : education);
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
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Update the education
    const updatedEducation = await Education.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEducation) {
      return NextResponse.json(
        { error: "Continuing education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEducation.toObject ? updatedEducation.toObject() : updatedEducation);
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
  try {
    await connectDB();

    const { id } = await params;

    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      return NextResponse.json(
        { error: "Continuing education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Continuing education deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting continuing education:", error);
    return NextResponse.json(
      { error: "Failed to delete continuing education" },
      { status: 500 }
    );
  }
}