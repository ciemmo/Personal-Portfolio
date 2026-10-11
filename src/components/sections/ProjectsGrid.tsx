"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/projects/ProjectCard";
import styles from "./ProjectsGrid.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface Project {
  slug: string;
  title: string;
  description: string;
  demo?: string;
  github?: string;
}

interface ProjectsGridProps {
  projects?: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  useScrollAnimation();
  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use provided projects if available, otherwise fetch
  useEffect(() => {
    if (projects && projects.length > 0) {
      setFetchedProjects(projects);
      setIsLoading(false);
    } else {
      async function load() {
        setIsLoading(true);
        try {
          const res = await fetch("/api/projects");
          const data = await res.json();
          setFetchedProjects(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching projects:", error);
          setIsLoading(false);
        }
      }
      load();
    }
  }, [projects]);

  const displayProjects = projects && projects.length > 0 ? projects : fetchedProjects;

  return (
    <section className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.subtitle}>Some of the work I've built</p>

        <div className={styles.grid}>
          {isLoading && displayProjects.length === 0 ? (
            // Loading skeleton or spinner could go here
            <p>Loading projects...</p>
          ) : (
            displayProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}