import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Certification from "@/models/Certification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const certification = await Certification.findById(id);

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certification.toObject ? certification.toObject() : certification);
  } catch (error) {
    console.error("Error fetching certification:", error);
    return NextResponse.json(
      { error: "Failed to fetch certification" },
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
    if (!body.name || !body.issuingOrganization || !body.issueDate) {
      return NextResponse.json(
        { error: "Name, issuing organization, and issue date are required" },
        { status: 400 }
      );
    }

    // Update the certification
    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCertification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCertification.toObject ? updatedCertification.toObject() : updatedCertification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json(
      { error: "Failed to update certification" },
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

    const deletedCertification = await Certification.findByIdAndDelete(id);

    if (!deletedCertification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Certification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    );
  }
}