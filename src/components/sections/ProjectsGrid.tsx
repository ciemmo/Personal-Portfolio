"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ProjectsGrid.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

export default function ProjectsGrid() {
    useScrollAnimation();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        }
        load();
    }, []);

    return (
        <section className={styles.projects}>
            <div className={styles.container}>
                <h2 className={styles.title}>Projects</h2>
                <p className={styles.subtitle}>Some of the work I've built</p>

                <div className={styles.grid}>
                    {projects.map((project: any) => (
                        <div key={project.slug} className={styles.card}>
                            <h3 className={styles.cardTitle}>{project.title}</h3>
                            <p className={styles.cardDescription}>{project.description}</p>

                            <Link
                                href={`/projects/${project.slug}`}
                                className={styles.button}
                            >
                                View Project
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
