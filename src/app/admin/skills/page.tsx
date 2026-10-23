"use client";

import dynamic from "next/dynamic";
import styles from "./Skills.module.css";

// Lazy load admin skills content to reduce initial bundle size
const AdminSkillsContent = dynamic(
  () => import("./AdminSkillsContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading skills management...</p>
      </div>
    ),
  }
);

export default function AdminSkillsPage() {
  return <AdminSkillsContent />;
}