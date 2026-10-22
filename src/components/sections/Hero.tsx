"use client";

import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function Hero() {
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");

  const stats = [
    { value: "0", label: "Years of Experience" },
    { value: "5", label: "Projects Built" },
    { value: "15+", label: "Technologies" },
    { value: "4+", label: "Certifications" },
  ];

  return (
    <section className={`${styles.hero} ${styles.fadeUp} fade-up`} aria-labelledby="hero-title">
      {/* Grid overlay for subtle texture */}
      <div className={styles.gridOverlay} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.text}>
          <div className={styles.greeting}>
            <span className={styles.greetingIcon} role="img" aria-label="wave">👋</span>
            Hello, I'm
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.name}>Emmanuel</span>
          </h1>

          <p className={styles.subtitle}>
            Computer Science graduate passionate about building clean, scalable software
            and creating meaningful digital experiences.
          </p>

          <div className={styles.buttons}>
            <Link
              href="/projects"
              className={styles.primaryButton}
            >
              <span>View Projects</span>
              <svg className={styles.buttonArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link
              href="/contact"
              className={styles.secondaryButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Contact Me</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar} role="list" aria-label="Key statistics">
            {stats.map((stat, index) => (
              <div key={stat.label} className={styles.stat} role="listitem">
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Visual */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageFrame}>
            <div className={styles.profilePlaceholder} aria-hidden="true">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
                <circle cx="60" cy="40" r="20" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 110c0-30 25-45 40-45s40 15 40 45" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}