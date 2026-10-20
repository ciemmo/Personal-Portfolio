"use client";

import React from "react";
import styles from "./About.module.css";
import Link from "next/link";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function About() {
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "30+", label: "Projects Built" },
    { value: "15+", label: "Technologies" },
    { value: "10+", label: "Certifications" },
  ];

  const skillOrbs = [
    { name: "React", category: "Frontend", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    )},
    { name: "Node.js", category: "Backend", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
        <line x1="12" y1="22" x2="12" y2="15.5"></line>
        <line x1="22" y1="8.5" x2="12" y2="15.5"></line>
        <line x1="2" y1="8.5" x2="12" y2="15.5"></line>
      </svg>
    )},
    { name: "TypeScript", category: "Language", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"></rect>
        <path d="M8 21h8"></path>
        <path d="M12 17v4"></path>
      </svg>
    )},
    { name: "Docker", category: "DevOps", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    )},
    { name: "PostgreSQL", category: "Database", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    )},
    { name: "AWS", category: "Cloud", icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 13h-7a2 2 0 0 1 0-4h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <path d="M22 8H6a4 4 0 0 0-4 4v7"></path>
      </svg>
    )},
  ];

  return (
    <section className={`${styles.about} ${styles["fade-up"]}`} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.text}>
          <span className={styles.sectionLabel}>
            <span className={styles.sectionLabelIcon} role="img" aria-label="info">ℹ️</span>
            About Me
          </span>

          <h2 id="about-title" className={styles.title}>
            Software Engineer crafting digital experiences
          </h2>

          <p className={styles.subtitle}>
            Computer Science Graduate passionate about building clean, scalable software
          </p>

          <p className={styles.paragraph}>
            I&apos;m Emmanuel, a passionate software engineer who loves building clean,
            scalable, and user‑focused applications. I enjoy solving complex problems
            and turning ideas into real, functional software.
          </p>

          <p className={styles.paragraph}>
            My interests include full‑stack development, backend development, and creating
            useful applications. I&apos;m always learning, always improving, and
            always excited to take on new challenges.
          </p>

          {/* Stats Cards */}
          <div className={styles.statsGrid} role="list" aria-label="Key statistics">
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard} role="listitem">
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

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

        {/* Visual Side - Floating Skill Orbs + Central Illustration */}
        <div className={styles.visualSide}>
          <div className={styles.skillsVisual}>
            {skillOrbs.map((orb, index) => (
              <div
                key={index}
                className={`${styles.skillOrb} ${styles[`orb${index + 1}`]}`}
                aria-hidden="true"
              >
                {orb.icon}
                <span className={styles.skillOrbName}>{orb.name}</span>
                <span className={styles.skillOrbCategory}>{orb.category}</span>
              </div>
            ))}

            <div className={styles.centralVisual} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
                <line x1="6" y1="9" x2="18" y2="9"></line>
                <line x1="6" y1="13" x2="18" y2="13"></line>
                <line x1="10" y1="17" x2="14" y2="17"></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}