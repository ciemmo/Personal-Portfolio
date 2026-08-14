import { projects } from "@/data/projects";
import styles from "./ProjectDetail.module.css";

interface ProjectDetailProps {
    params: {
        slug: string;
    };
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
    const project = projects.find((project) => project.slug === params.slug);

    if (!project) {
        return (
            <div className={styles.projectDetail}>
                <h1>Project Not Found</h1>
                <p>The project you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <section className={styles.projectSection}>
            <div className={styles.container}>
                <h1 className={styles.title}>{project.title}</h1>

                <img
                    src={project.image}
                    alt={project.title}
                    className={styles.image}
                />

                <p className={styles.description}>{project.description}</p>
            </div>
        </section>
    );
}