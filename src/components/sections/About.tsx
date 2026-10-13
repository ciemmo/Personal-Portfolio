"use client"

import styles from "./About.module.css";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function About() {
    useScrollAnimation(
        `.${styles["fade-up"]}, .${styles["stagger-up"]} > *`,
        styles.animate
    );

    return (
        <section className={`${styles.about} ${styles["fade-up"]}`}>
            <div className={styles.container}>
                <div className={styles.text}>
                    <div className={styles["stagger-up"]}>
                        <h2 className={styles.title}>About Me</h2>
                        <p className={styles.subtitle}>
                            Computer Science Graduate & Aspiring Software Engineer
                        </p>

                        <p className={styles.paragraph}>
                            I&apos;m Emmanuel, a passionate software engineer who loves building clean,
                            scalable, and user‑focused applications. I enjoy solving complex problems
                            and turning ideas into real, functional software.
                        </p>

                        <p className={styles.paragraph}>
                            My interests include full‑stack development, backend development, and creating
                            fun, and useful applications. I’m always learning, always improving, and
                            always excited to take on new challenges.
                        </p>

                        <div className={styles.ctaContainer}>
                            <a
                                href="/resume-emmanuel.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaButton}
                            >
                                View Resume
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`${styles.imageWrapper} ${styles["fade-up"]}`}>
                    {/* Image placeholder - actual image would be added here */}
                    <div className={styles.imagePlaceholder} />
                </div>
            </div>
        </section>
    );
}