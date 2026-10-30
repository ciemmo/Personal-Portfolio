"use client";

import React from "react";
import styles from "./About.module.css";
import Link from "next/link";
import useScrollAnimation from "../../hooks/useScrollAnimation";

interface AboutProps {
  // Stats removed from About section to avoid redundancy with Hero section
}

export default function About({ }: AboutProps) {
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");

  return (
    <section className={`${styles.about} ${styles["fade-up"]}`} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.text}>
          <span className={styles.sectionLabel}>
            <span className={styles.sectionLabelIcon} role="img" aria-label="info">ℹ️</span>
            About Me
          </span>

          <h2 id="about-title" className={styles.title}>
            Aspiring Software Engineer crafting digital experiences
          </h2>

          <p className={styles.subtitle}>
            Computer Science Graduate passionate about building clean, scalable software
          </p>

          <p className={styles.paragraph}>
            I&apos;m Emmanuel, an aspiring software engineer who loves building clean,
            scalable, and user‑focused applications. I enjoy solving complex problems
            and turning ideas into real, functional software.
          </p>

          <p className={styles.paragraph}>
            My interests include full‑stack development, backend development, and creating
            useful applications. I&apos;m always learning, always improving, and
            always excited to take on new challenges.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaContainer}>
            <a
              href="/resume-emmanuel.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.ctaButton} ${styles.primary}`}
            >
              <span>View Resume</span>
              <svg className={styles.buttonArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
            <Link
              href="/contact"
              className={`${styles.ctaButton} ${styles.secondary}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}