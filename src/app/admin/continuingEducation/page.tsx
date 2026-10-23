"use client";

import dynamic from "next/dynamic";
import styles from "./ContinuingEducation.module.css";

// Lazy load admin continuing education content to reduce initial bundle size
const AdminContinuingEducationContent = dynamic(
  () => import("./AdminContinuingEducationContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading continuing education management...</p>
      </div>
    ),
  }
);

export default function AdminContinuingEducationPage() {
  return <AdminContinuingEducationContent />;
}