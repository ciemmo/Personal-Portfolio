import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch all projects from database
    const projects = await Project.find({}).sort({ createdAt: -1 });

    // Enhance projects with skillRoles based on tech stack
    const enhancedProjects = projects.map(project => {
      // Convert to plain object if it's a Mongoose document
      const projectObj = project.toObject ? project.toObject() : project;

      // Initialize skillRoles if not present
      if (!projectObj.skillRoles) {
        projectObj.skillRoles = [];
      }

      // Map tech to skill roles (simple heuristic)
      const techLower = projectObj.tech.map((t: string) => t.toLowerCase());

      // Frontend indicators
      const frontendTechs = ['html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'bootstrap', 'tailwind'];
      if (frontendTechs.some((tech: string) => techLower.includes(tech))) {
        if (!projectObj.skillRoles.includes('frontend')) {
          projectObj.skillRoles.push('frontend');
        }
      }

      // Backend indicators
      const backendTechs = ['node.js', 'express', 'django', 'flask', 'spring', '.net', 'java', 'python', 'ruby', 'php', 'laravel', 'rails'];
      if (backendTechs.some((tech: string) => techLower.includes(tech))) {
        if (!projectObj.skillRoles.includes('backend')) {
          projectObj.skillRoles.push('backend');
        }
      }

      // DevOps indicators
      const devopsTechs = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'terraform', 'ansible'];
      if (devopsTechs.some((tech: string) => techLower.includes(tech))) {
        if (!projectObj.skillRoles.includes('devops')) {
          projectObj.skillRoles.push('devops');
        }
      }

      // Database indicators
      const databaseTechs = ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server'];
      if (databaseTechs.some((tech: string) => techLower.includes(tech))) {
        if (!projectObj.skillRoles.includes('database')) {
          projectObj.skillRoles.push('database');
        }
      }

      // Mobile indicators
      const mobileTechs = ['react native', 'flutter', 'swift', 'kotlin', 'ionic', 'xamarin'];
      if (mobileTechs.some((tech: string) => techLower.includes(tech))) {
        if (!projectObj.skillRoles.includes('mobile')) {
          projectObj.skillRoles.push('mobile');
        }
      }

      // UI/UX indicators
      if (projectObj.tech.some((t: string) => ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator'].includes(t.toLowerCase()))) {
        if (!projectObj.skillRoles.includes('ui/ux')) {
          projectObj.skillRoles.push('ui/ux');
        }
      }

      // If no skills detected, add a default
      if (projectObj.skillRoles.length === 0) {
        projectObj.skillRoles = ['fullstack'];
      }

      return projectObj;
    });

    // Set cache headers for better performance
    // Cache for 1 hour (in seconds)
    const oneHourInSeconds = 60 * 60;

    return NextResponse.json(enhancedProjects, {
      headers: {
        "Cache-Control": `public, max-age=${oneHourInSeconds}, stale-while-revalidate=86400`,
        "ETag": `"${enhancedProjects.length}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}