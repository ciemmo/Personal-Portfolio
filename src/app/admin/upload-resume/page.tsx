"use client";

import dynamic from "next/dynamic";
import styles from "./UploadResume.module.css";

// Lazy load admin upload resume content to reduce initial bundle size
const AdminUploadResumeContent = dynamic(
  () => import("./AdminUploadResumeContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading resume upload...</p>
      </div>
    ),
  }
);

export default function UploadResumePage() {
  return <AdminUploadResumeContent />;
}