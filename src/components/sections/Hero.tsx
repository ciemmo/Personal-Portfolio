"use client";

import React from "react";
import styles from "./Hero.module.css";
import Link from "next/link";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function Hero() {
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "30+", label: "Projects Built" },
    { value: "15+", label: "Technologies" },
    { value: "10+", label: "Certifications" },
  ];

  const badges = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          <line x1="12" y1="22" x2="12" y2="15.5"></line>
          <line x1="22" y1="8.5" x2="12" y2="15.5"></line>
          <line x1="2" y1="8.5" x2="12" y2="15.5"></line>
        </svg>
      ),
      text: "Full Stack"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="6" x2="12" y2="18"></line>
          <line x1="6" y1="12" x2="18" y2="12"></line>
        </svg>
      ),
      text: "Cloud Native"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2"></rect>
          <path d="M8 21h8"></path>
          <path d="M12 17v4"></path>
        </svg>
      ),
      text: "TypeScript"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      text: "DevOps"
    },
  ];

  return (
    <section className={`${styles.hero} ${styles.fadeUp}`} aria-labelledby="hero-title">
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

        <div className={styles.imageWrapper}>
          <div className={styles.imageFrame}>
            <OptimizedImage
              src="/images/placeholder.png"
              alt="Emmanuel - Software Engineer"
              className={styles.profileImage}
              priority={true}
              width={380}
              height={380}
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 380px"
            />
          </div>

          {/* Floating badges around the image */}
          <div className={styles.floatingBadges} aria-hidden="true">
            {badges.map((badge, index) => (
              <div key={index} className={`${styles.badge} ${styles[`badge${index + 1}`]}`}>
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <span>Scroll to explore</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  );
}