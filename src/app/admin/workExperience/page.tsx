"use client";

import dynamic from "next/dynamic";
import styles from "./WorkExperience.module.css";

// Lazy load admin work experience content to reduce initial bundle size
const AdminWorkExperienceContent = dynamic(
  () => import("./AdminWorkExperienceContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading work experience management...</p>
      </div>
    ),
  }
);

export default function AdminWorkExperiencePage() {
  return <AdminWorkExperienceContent />;
}