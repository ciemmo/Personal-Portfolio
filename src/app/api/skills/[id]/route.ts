import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Skill from "@/models/Skill";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const skillPlain = skill.toObject ? skill.toObject() : skill;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(skillPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${skillPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
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

    // Ensure proficiency is a number (handle case where client sends it as string)
    if (typeof body.proficiency === 'string') {
      body.proficiency = parseInt(body.proficiency, 10);
    }

    // Validate required fields
    // Check if name is provided and not just whitespace (accounting for schema trim: true)
    const nameIsValid = typeof body.name === 'string' && body.name.trim() !== '';
    // Check if category is provided and not empty or just whitespace
    const categoryIsValid = typeof body.category === 'string' && body.category.trim() !== '';
    // Check if proficiency is provided and a valid number
    const proficiencyIsValid = typeof body.proficiency === 'number' && !isNaN(body.proficiency) && body.proficiency >= 0 && body.proficiency <= 3;

    if (!nameIsValid || !categoryIsValid || !proficiencyIsValid) {
      return NextResponse.json(
        { error: "Name, category, and proficiency are required" },
        { status: 400 }
      );
    }

    // Validate proficiency range
    if (body.proficiency < 0 || body.proficiency > 3) {
      return NextResponse.json(
        { error: "Proficiency must be between 0 and 3" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'Languages',
      'Frameworks',
      'DevOps and Cloud',
      'Developer Tools',
      'AI and Machine Learning',
      'Data Science',
      'Databases',
      'Database',  // alias for Databases
      'Mobile',
      'Testing',
      'UI/UX Design',
      'Architecture',
      'Other'
    ];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Update the skill with explicitly controlled fields
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      {
        name: typeof body.name === 'string' ? body.name : "",
        category: typeof body.category === 'string' ? body.category : "",
        proficiency: body.proficiency,
        description: typeof body.description === 'string' ? body.description : "",
        icon: typeof body.icon === 'string' ? body.icon : "",
        color: typeof body.color === 'string' ? body.color : "",
        isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : false,
        lastUpdated: new Date() // Always update to current time on update
      },
      { new: true }
    );

    if (!updatedSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const skillPlain = updatedSkill.toObject ? updatedSkill.toObject() : updatedSkill;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(skillPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${skillPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill", details: String(error) },
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
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}