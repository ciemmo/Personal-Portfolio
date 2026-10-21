"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectSkeleton.module.css";

interface ProjectSkeletonProps {
  style?: React.CSSProperties;
  className?: string;
}

export default function ProjectSkeleton({ style, className = "" }: ProjectSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay to prevent flash of skeleton content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null; // Render nothing initially to prevent layout shift
  }

  return (
    <div className={`${styles.skeleton} ${className}`} style={style}>
      {/* Skeleton image */}
      <div className={styles.skeletonImage} />

      {/* Skeleton title */}
      <div className={styles.skeletonTitle}>
        <div className={styles.skeletonLine} style={{ width: "80%" }} />
        <div className={styles.skeletonLine} style={{ width: "60%" }} />
        <div className={styles.skeletonLine} style={{ width: "40%" }} />
      </div>

      {/* Skeleton content */}
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonLine} style={{ width: "70%" }} />
        <div className={styles.skeletonLine} style={{ width: "50%" }} />
        <div className={styles.skeletonLine} style={{ width: "30%" }} />
        <div className={styles.skeletonLine} style={{ width: "60%" }} />
        <div className={styles.skeletonLine} style={{ width: "40%" }} />
      </div>

      {/* Skeleton tags */}
      <div className={styles.skeletonTags}>
        <div className={styles.skeletonTag} />
        <div className={styles.skeletonTag} />
        <div className={styles.skeletonTag} />
      </div>
    </div>
  );
}