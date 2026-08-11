"use client";

import styles from "./ProjectsGrid.module.css";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects"; // You will create this file next

export default function ProjectsGrid() {
    return (
        <section className={styles.projectsSection}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Projects</h2>

                <div className={styles.grid}>
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
