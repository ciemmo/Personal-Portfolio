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
            // Loading skeletons
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.projectCard}>
                  <div className={styles.projectSkeleton}>
                    <div className={styles.projectSkeletonTitle}>
                      <div className={styles.projectSkeletonLine} style={{ width: "80%" }} />
                      <div className={styles.projectSkeletonLine} style={{ width: "60%" }} />
                    </div>
                    <div className={styles.projectSkeletonDescription}>
                      <div className={styles.projectSkeletonLine} style={{ width: "70%" }} />
                      <div className={styles.projectSkeletonLine} style={{ width: "50%" }} />
                      <div className={styles.projectSkeletonLine} style={{ width: "30%" }} />
                      <div className={styles.projectSkeletonLine} style={{ width: "60%" }} />
                      <div className={styles.projectSkeletonLine} style={{ width: "40%" }} />
                    </div>
                    {/*
                      Show demo indicator skeleton only for some items to add variety
                    */}
                    {i % 2 === 0 && (
                      <div className={styles.projectSkeletonDemo}>
                        <div className={styles.projectSkeletonLine} style={{ width: "50%" }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
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