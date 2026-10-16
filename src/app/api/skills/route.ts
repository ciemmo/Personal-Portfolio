import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Skill from "@/models/Skill";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all skills from database, sorted by category and name
    const skills = await Skill.find({}).sort({ category: 1, name: 1 });

    // Convert to plain objects for JSON serialization
    const skillsPlain = skills.map(skill => skill.toObject ? skill.toObject() : skill);

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(skillsPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${skillsPlain.length}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || body.proficiency === undefined) {
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
      'frontend', 'backend', 'devops', 'database',
      'mobile', 'uiux', 'fullstack'
    ];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name: body.name });
    if (existingSkill) {
      return NextResponse.json(
        { error: "Skill with this name already exists" },
        { status: 409 }
      );
    }

    // Create new skill
    const newSkill = await Skill.create({
      ...body,
      lastUpdated: new Date()
    });

    return NextResponse.json(
      newSkill.toObject ? newSkill.toObject() : newSkill,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}