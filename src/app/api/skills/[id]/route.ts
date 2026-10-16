import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Skill from "@/models/Skill";

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

    return NextResponse.json(skill.toObject ? skill.toObject() : skill);
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
  try {
    await connectDB();

    const { id } = await params;
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

    // Update the skill
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      {
        ...body,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSkill.toObject ? updatedSkill.toObject() : updatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
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