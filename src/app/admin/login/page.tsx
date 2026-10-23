"use client";

import dynamic from "next/dynamic";
import styles from "./Login.module.css";

// Lazy load admin login content to reduce initial bundle size
const AdminLoginContent = dynamic(
  () => import("./AdminLoginContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading login...</p>
      </div>
    ),
  }
);

export default function LoginPage() {
  return <AdminLoginContent />;
}