"use client";

import dynamic from "next/dynamic";
import styles from "./Certifications.module.css";

// Lazy load admin certifications content to reduce initial bundle size
const AdminCertificationsContent = dynamic(
  () => import("./AdminCertificationsContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading certifications management...</p>
      </div>
    ),
  }
);

export default function AdminCertificationsPage() {
  return <AdminCertificationsContent />;
}