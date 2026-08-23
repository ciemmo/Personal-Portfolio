import styles from "./ProjectPage.module.css";

async function getProject(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${slug}`, {
        cache: "no-store"
    });
    return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
    const project = await getProject(params.slug);

    if (!project || project.error) {
        return <h1 className={styles.notFound}>Project Not Found</h1>;
    }

    return (
        <section className={styles.projectSection}>
            <div className={styles.container}>
                <h1 className={styles.title}>{project.title}</h1>
                <p className={styles.description}>{project.description}</p>

                <div className={styles.techList}>
                    {project.tech.map((t: string) => (
                        <span key={t} className={styles.techBadge}>{t}</span>
                    ))}
                </div>

                <div className={styles.longDescription}>
                    {project.longDescription.split("\n").map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>

                <div className={styles.buttons}>
                    {project.github && (
                        <a href={project.github} target="_blank" className={styles.button}>
                            GitHub
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
