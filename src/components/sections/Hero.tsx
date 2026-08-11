import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.text}>
                    <h1 className={styles.title}>
                        Hi, I'm <span className={styles.name}>Emmanuel</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Computing Science student and systems developer passionate about
                        compiler design, backend engineering, and building clean, scalable software.
                    </p>

                    <div className={styles.buttons}>
                        <Link href="/projects" className={styles.primaryButton}>
                            View Projects
                        </Link>
                        <Link href="/contact" className={styles.secondaryButton}>
                            Contact Me
                        </Link>
                    </div>
                </div>

                {/* Optional image */}
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
