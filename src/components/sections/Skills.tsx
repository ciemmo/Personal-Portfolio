"use client"

import styles from "./Skills.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Python",
    "C#",
    "Java",
    "C++",
    "SQL",
    "MySQL",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Git",
    "REST APIs",
];

export default function Skills() {
    useScrollAnimation();

    return (
        <section className={styles.skills}>
            <div className={styles.container}>
                <h2 className={styles.title}>Skills</h2>
                <p className={styles.subtitle}>Technologies I work with</p>

                <div className={styles.grid}>
                    {skills.map((skill) => (
                        <div key={skill} className={styles.card}>
                            <p className={styles.skillName}>{skill}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
