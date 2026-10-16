import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Certification from "@/models/Certification";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all certifications from database, sorted by issueDate descending
    const certifications = await Certification.find({}).sort({ issueDate: -1 });

    // Convert to plain objects for JSON serialization
    const certificationsPlain = certifications.map(cert => cert.toObject ? cert.toObject() : cert);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(certificationsPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${certificationsPlain.length}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.issuingOrganization || !body.issueDate) {
      return NextResponse.json(
        { error: "Name, issuing organization, and issue date are required" },
        { status: 400 }
      );
    }

    // Create new certification
    const newCertification = await Certification.create({
      ...body,
    });

    return NextResponse.json(
      newCertification.toObject ? newCertification.toObject() : newCertification,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 }
    );
  }
}