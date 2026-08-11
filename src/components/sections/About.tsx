"use client";

import styles from "./About.module.css";

export default function About() {
    return (
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <h2 className={styles.heading}>About Me</h2>

                <p className={styles.text}>
                    I’m a passionate developer who enjoys building clean, functional, and
                    user‑focused digital experiences. My work spans frontend development,
                    backend systems, and full‑stack applications — with a strong interest
                    in creating tools that solve real problems.
                </p>

                <p className={styles.text}>
                    I’m currently focused on mastering the MERN stack, improving my
                    full‑stack workflow, and building projects that showcase both
                    technical depth and thoughtful design.
                </p>
            </div>
        </section>
    );
}
