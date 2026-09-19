"use client"

import styles from "./About.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

export default function About() {
    useScrollAnimation();

    return (
        <section className={styles.about}>
            <div className={styles.container}>
                <div className={styles.text}>
                    <h2 className={styles.title}>About Me</h2>
                    <p className={styles.subtitle}>
                        Computer Science Graduate & Aspiring Software Engineer
                    </p>

                    <p className={styles.paragraph}>
                        I'm Emmanuel, a passionate software engineer who loves building clean,
                        scalable, and user‑focused applications. I enjoy solving complex problems
                        and turning ideas into real, functional software.
                    </p>

                    <p className={styles.paragraph}>
                        My interests include full‑stack development, backend development, and creating
                        fun, and useful applications. I’m always learning, always improving, and
                        always excited to take on new challenges.
                    </p>
                </div>

                <div className={styles.imageWrapper}>
                    <img
                        src="/images/profile.jpg"
                        alt="Profile"
                        className={styles.image}
                    />
                </div>
            </div>
        </section>
    );
}
