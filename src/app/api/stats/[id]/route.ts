import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import SiteStats from "@/models/SiteStats";
import { authenticateRequest } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (typeof body.label === "string" && body.label.trim() !== "") {
      updateData.label = body.label.trim();
    }
    if (typeof body.value === "string" && body.value.trim() !== "") {
      updateData.value = body.value.trim();
    }
    if (body.section && ["hero", "about", "both"].includes(body.section)) {
      updateData.section = body.section;
    }
    if (typeof body.displayOrder === "number") {
      updateData.displayOrder = body.displayOrder;
    }
    if (typeof body.isVisible === "boolean") {
      updateData.isVisible = body.isVisible;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedStat = await SiteStats.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStat) {
      return NextResponse.json(
        { error: "Stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      updatedStat.toObject ? updatedStat.toObject() : updatedStat
    );
  } catch (error) {
    console.error("Error updating stat:", error);
    return NextResponse.json(
      { error: "Failed to update stat", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const { id } = await params;

    const deletedStat = await SiteStats.findByIdAndDelete(id);

    if (!deletedStat) {
      return NextResponse.json(
        { error: "Stat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stat:", error);
    return NextResponse.json(
      { error: "Failed to delete stat", details: String(error) },
      { status: 500 }
    );
  }
}