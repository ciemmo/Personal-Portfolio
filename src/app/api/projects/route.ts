import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET() {
    try {
        await connectDB();

        // Use lean() for better performance when you don't need Mongoose documents
        const projects = await Project.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json(projects, {
            status: 200,
            headers: {
                // ⭐ Cache for 10 seconds, allow stale for 59 seconds
                "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
            },
        });
    } catch (error) {
        console.error("GET /api/projects failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const project = await Project.create(body);

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("POST /api/projects failed:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
