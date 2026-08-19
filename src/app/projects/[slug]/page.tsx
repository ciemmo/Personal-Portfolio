import { projects } from "@/data/projects";
import styles from "./ProjectPage.module.css";

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const project = projects.find((p) => p.slug === params.slug);

    if (!project) {
        return <h1 className={styles.notFound}>Project Not Found</h1>;
    }

    return (
        <section className={styles.projectSection}>
            <div className={styles.container}>
                {/* Title */}
                <h1 className={styles.title}>{project.title}</h1>

                {/* Short Description */}
                <p className={styles.description}>{project.description}</p>

                {/* Tech Stack */}
                <div className={styles.techList}>
                    {project.tech.map((t) => (
                        <span key={t} className={styles.techBadge}>
                            {t}
                        </span>
                    ))}
                </div>

                {/* Long Description */}
                <div className={styles.longDescription}>
                    {project.longDescription.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>

                {/* Buttons */}
                <div className={styles.buttons}>
                    {project.link && (
                        <a href={project.link} target="_blank" className={styles.button}>
                            View Project
                        </a>
                    )}

                    {project.demo && (
                        <a href={project.demo} target="_blank" className={styles.button}>
                            Live Demo
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
