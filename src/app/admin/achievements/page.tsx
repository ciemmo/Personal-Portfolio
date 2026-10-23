"use client";

import dynamic from "next/dynamic";
import styles from "./Achievements.module.css";

// Lazy load admin achievements content to reduce initial bundle size
const AdminAchievementsContent = dynamic(
  () => import("./AdminAchievementsContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading achievements management...</p>
      </div>
    ),
  }
);

export default function AdminAchievementsPage() {
  return <AdminAchievementsContent />;
}