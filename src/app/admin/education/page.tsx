"use client";

import dynamic from "next/dynamic";
import styles from "./Education.module.css";

// Lazy load admin education content to reduce initial bundle size
const AdminEducationContent = dynamic(
  () => import("./AdminEducationContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading education management...</p>
      </div>
    ),
  }
);

export default function AdminEducationPage() {
  return <AdminEducationContent />;
}