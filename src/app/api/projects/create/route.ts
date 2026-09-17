import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            title,
            slug,
            description,
            longDescription,
            tech,
            github,
            demo,
            image,
        } = body;

        // Basic validation
        if (!title || !slug || !description) {
            return NextResponse.json(
                { error: "Missing required fields: title, slug, description" },
                { status: 400 }
            );
        }

        // Create project
        const project = await Project.create({
            title,
            slug,
            description,
            longDescription,
            tech: tech || [],
            github,
            demo,
            image,
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        console.error("Error creating project:", error);

        return NextResponse.json(
            { error: "Failed to create project", details: error.message },
            { status: 500 }
        );
    }
}
