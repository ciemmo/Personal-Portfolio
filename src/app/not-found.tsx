"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./not-found.module.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — Page Not Found | Emmanuel";
  }, []);

  return (
    <main className={styles.notFound} role="main">
      <div className={styles.container}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={`${styles.link} ${styles.linkPrimary}`}>
            ← Back to Home
          </Link>
          <Link href="/projects" className={`${styles.link} ${styles.linkSecondary}`}>
            View Projects
          </Link>
        </div>
      </div>
    </main>
  );
}