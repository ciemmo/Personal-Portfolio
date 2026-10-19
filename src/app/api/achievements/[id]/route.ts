import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Achievement from "@/models/Achievement";
import { authenticateRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const achievementPlain = achievement.toObject ? achievement.toObject() : achievement;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(achievementPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${achievementPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching achievement:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievement" },
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

    // Update the achievement with explicitly controlled fields
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      {
        title: typeof body.title === 'string' ? body.title : "",
        description: typeof body.description === 'string' ? body.description : "",
        date: typeof body.date === 'string' ? body.date : "",
        category: typeof body.category === 'string' ? body.category : "",
        icon: typeof body.icon === 'string' ? body.icon : "",
        url: typeof body.url === 'string' ? body.url : "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Convert to plain object for JSON serialization
    const achievementPlain = updatedAchievement.toObject ? updatedAchievement.toObject() : updatedAchievement;

    // Set cache headers for better performance
    // Cache for 30 minutes (in seconds)
    const thirtyMinutesInSeconds = 30 * 60;

    return NextResponse.json(achievementPlain, {
      headers: {
        "Cache-Control": `public, max-age=${thirtyMinutesInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${achievementPlain._id}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error updating achievement:", error);
    return NextResponse.json(
      { error: "Failed to update achievement" },
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
    const deletedAchievement = await Achievement.findByIdAndDelete(id);

    if (!deletedAchievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Achievement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Failed to delete achievement" },
      { status: 500 }
    );
  }
}