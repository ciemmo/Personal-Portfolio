import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Certification from "@/models/Certification";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all certifications from database
    const certifications = await Certification.find({}).sort({ name: 1 });

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
  // Authenticate the request
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

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

    // Create new certification with explicitly controlled fields
    const newCertification = await Certification.create({
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