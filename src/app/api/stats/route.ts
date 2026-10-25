import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import SiteStats from "@/models/SiteStats";
import { authenticateRequest } from "@/lib/auth";
import { generateETag, checkETagMatch, createCacheHeaders } from "@/lib/etag";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section"); // "hero", "about", or "both"

    let query: Record<string, unknown> = { isVisible: true };
    if (section && section !== "both") {
      query = { ...query, $or: [{ section }, { section: "both" }] };
    }

    const stats = await SiteStats.find(query).sort({ displayOrder: 1 });

    const statsPlain = stats.map((stat) =>
      stat.toObject ? stat.toObject() : stat
    );

    const etag = generateETag(statsPlain);

    if (checkETagMatch(request, etag)) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }

    return NextResponse.json(statsPlain, {
      headers: createCacheHeaders(statsPlain, {
        maxAge: 300,
        staleWhileRevalidate: 3600,
      }),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await authenticateRequest();
  if (authResponse) {
    return authResponse;
  }

  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const keyIsValid =
      typeof body.key === "string" && body.key.trim() !== "";
    const labelIsValid =
      typeof body.label === "string" && body.label.trim() !== "";
    const valueIsValid =
      typeof body.value === "string" && body.value.trim() !== "";

    if (!keyIsValid || !labelIsValid || !valueIsValid) {
      return NextResponse.json(
        { error: "Key, label, and value are required" },
        { status: 400 }
      );
    }

    // Validate section
    const validSections = ["hero", "about", "both"];
    const section = validSections.includes(body.section)
      ? body.section
      : "both";

    // Check if stat already exists
    const existingStat = await SiteStats.findOne({
      key: body.key.toLowerCase().trim(),
    });
    if (existingStat) {
      return NextResponse.json(
        { error: "Stat with this key already exists" },
        { status: 409 }
      );
    }

    const newStat = await SiteStats.create({
      key: body.key.toLowerCase().trim(),
      label: body.label.trim(),
      value: body.value.trim(),
      section,
      displayOrder: typeof body.displayOrder === "number" ? body.displayOrder : 0,
      isVisible: typeof body.isVisible === "boolean" ? body.isVisible : true,
    });

    return NextResponse.json(
      newStat.toObject ? newStat.toObject() : newStat,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating stat:", error);
    return NextResponse.json(
      { error: "Failed to create stat", details: String(error) },
      { status: 500 }
    );
  }
}