import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // Validate file type (optional)
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define file path - store in public directory
    const filename = "resume-emmanuel.pdf";
    const filePath = path.join(process.cwd(), "public", filename);

    // Write file to public directory
    await fs.writeFile(filePath, buffer);

    // Return success response with file URL
    return NextResponse.json({
      message: "Resume uploaded successfully",
      filename: filename,
      url: `/${filename}`
    }, {
      status: 200
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to retrieve resume info
export async function GET(request: NextRequest) {
  try {
    const filename = "resume-emmanuel.pdf";
    const filePath = path.join(process.cwd(), "public", filename);

    // Check if file exists
    try {
      await fs.access(filePath);
      return NextResponse.json({
        exists: true,
        url: `/${filename}`,
        filename: filename
      });
    } catch {
      return NextResponse.json({
        exists: false,
        message: "Resume file not found"
      }, {
        status: 404
      });
    }
  } catch (error) {
    console.error("Error checking resume:", error);
    return NextResponse.json(
      { error: "Failed to check resume status" },
      { status: 500 }
    );
  }
}