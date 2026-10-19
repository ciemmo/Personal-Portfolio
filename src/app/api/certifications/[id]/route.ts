import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Certification from "@/models/Certification";
import { authenticateRequest } from "@/lib/auth";

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

    // Convert to plain object for JSON serialization
    const certificationPlain = certification.toObject ? certification.toObject() : certification;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(certificationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${certificationPlain._id}-${Date.now()}"`,
      },
    });
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
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Update the certification with explicitly controlled fields
    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      {
        name: typeof body.name === 'string' ? body.name : "",
        issuingOrganization: typeof body.issuingOrganization === 'string' ? body.issuingOrganization : "",
        issueDate: typeof body.issueDate === 'string' ? body.issueDate : "",
        expirationDate: body.expirationDate === null || body.expirationDate === "" ? null : (typeof body.expirationDate === 'string' ? body.expirationDate : ""),
        credentialId: typeof body.credentialId === 'string' ? body.credentialId : "",
        credentialUrl: typeof body.credentialUrl === 'string' ? body.credentialUrl : "",
        skills: Array.isArray(body.skills) ? body.skills : [],
        description: typeof body.description === 'string' ? body.description : "",
        logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl : "",
        color: typeof body.color === 'string' ? body.color : "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedCertification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const certificationPlain = updatedCertification.toObject ? updatedCertification.toObject() : updatedCertification;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(certificationPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${certificationPlain._id}-${Date.now()}"`,
      },
    });
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
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

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