import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Skill from "@/models/Skill";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all skills from database, sorted by category and name
    const skills = await Skill.find({}).sort({ category: 1, name: 1 });

    // Convert to plain objects for JSON serialization
    const skillsPlain = skills.map(skill => skill.toObject ? skill.toObject() : skill);

    // Set cache headers for better performance
    // No caching for skills data as it can change frequently due to user actions
    return NextResponse.json(
      skillsPlain,
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
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

    // Validate category - TEMPORARILY including old categories for migration
    const validCategories = [
      'Languages',
      'Frameworks',
      'DevOps and Cloud',
      'Developer Tools',
      'frontend',
      'backend',
      'devops',
      'database',
      'mobile',
      'uiux',
      'fullstack'
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

    // Create new skill with explicitly controlled fields
    const newSkill = await Skill.create({
      name: typeof body.name === 'string' ? body.name : "",
      category: typeof body.category === 'string' ? body.category : "",
      proficiency: body.proficiency,
      description: typeof body.description === 'string' ? body.description : "",
      icon: typeof body.icon === 'string' ? body.icon : "",
      color: typeof body.color === 'string' ? body.color : "",
      isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : false,
      // lastUpdated is not included - it will get the default value of Date.now
    });

    return NextResponse.json(
      newSkill.toObject ? newSkill.toObject() : newSkill,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill", details: String(error) },
      { status: 500 }
    );
  }
}