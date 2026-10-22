import { Suspense } from "react";
import ProjectsPageClient from "./ProjectsPageClient";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import styles from "./ProjectPage.module.css";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  skillRoles: string[];
  github?: string;
  demo?: string;
  image?: string;
  _id?: string;
  createdAt?: string;
  featured?: boolean;
  category?: string;
}

function ProjectsPageSkeleton() {
  return (
    <section className={`${styles.projectsPage} ${styles.fadeUp} fade-up`} aria-labelledby="projects-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 id="projects-title" className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>Loading your projects...</p>
          </div>
        </header>

        <div className={styles.grid} role="list" aria-label="Projects grid">
          {[...Array(6)].map((_, i) => (
            <ProjectSkeleton key={i} style={{ "--stagger-delay": (i * 80) + "ms" } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects: ProjectData[] = [];
  try {
    await connectDB();
    const projectsData = await Project.find({}).sort({ createdAt: -1 }).lean();
    projects = projectsData.map(p => ({
      ...p,
      _id: p._id?.toString(),
      createdAt: p.createdAt?.toISOString(),
    })) as ProjectData[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    projects = [];
  }

  return (
    <Suspense fallback={<ProjectsPageSkeleton />}>
      <ProjectsPageClient initialProjects={projects} />
    </Suspense>
  );
}