"use client";

import styles from "./Skills.module.css";
import { skills } from "@/data/skills";

export default function Skills() {
    return (
        <section className={styles.skillsSection}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Skills</h2>

                <ul className={styles.skillsList}>
                    {skills.map((skill) => (
                        <li key={skill} className={styles.skillItem}>
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
