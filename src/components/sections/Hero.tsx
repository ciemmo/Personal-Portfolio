"use client"

import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link";
import useScrollAnimation from "@/hooks/useScrollAnimation";

export default function Hero() {
    useScrollAnimation();

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.text}>
                    <h1 className={styles.title}>
                        Hi, I'm <span className={styles.name}>Emmanuel</span>
                    </h1>

                    <p className={styles.subtitle}>
                        Computer Science graduate passionate about building clean, scalable software
                        and creating meaningful digital experiences.
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

                <div className={styles.imageWrapper}>
                    <img
                        src="/images/placeholder.png"
                        alt="Profile"
                        className={styles.image}
                    />
                </div>
            </div>
        </section>
    );
}
