import { notFound } from "next/navigation";
import styles from "./ProjectDetail.module.css";

export default async function ProjectDetailPage(context: any) {
    const { slug } = await context.params; // ⭐ FIX

    const res = await fetch(`http://localhost:3000/api/projects/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return notFound();
    }

    const project = await res.json();

    return (
        <section className={styles.projectSection}>
            <div className={styles.container}>
                <h1 className={styles.title}>{project.title}</h1>

                <p className={styles.description}>{project.description}</p>

                <div className={styles.longDescription}>
                    {project.longDescription.split("\n").map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>

                <h2>Tech Stack</h2>
                <ul className={styles.techList}>
                    {project.tech.map((t: string) => (
                        <li key={t}>{t}</li>
                    ))}
                </ul>

                <div className={styles.links}>
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                            GitHub Repo
                        </a>
                    )}
                    {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
