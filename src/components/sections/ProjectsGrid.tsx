import Link from "next/link";
import { projects } from "@/data/projects";
import styles from "./ProjectsGrid.module.css";

export default function ProjectsGrid() {
    return (
        <section className={styles.projects}>
            <div className={styles.container}>
                <h2 className={styles.title}>Projects</h2>
                <p className={styles.subtitle}>Some of the work I've built</p>

                <div className={styles.grid}>
                    {projects.map((project) => (
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
