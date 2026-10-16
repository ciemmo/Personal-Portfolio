"use client";

import { ProficiencyLevel } from "@/lib/skillProficiency";
import styles from "./ProficiencyIndicator.module.css";

interface ProficiencyIndicatorProps {
  level: ProficiencyLevel;
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

export default function ProficiencyIndicator({
  level,
  size = "medium",
  showText = false,
}: ProficiencyIndicatorProps) {
  const proficiencyLabels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const label = proficiencyLabels[level] || "Unknown";

  return (
    <div className={`${styles.container} ${styles[size]}`} title={`${label} proficiency`}>
      <div className={styles.levelIndicator}>
        {[0, 1, 2, 3].map((l) => (
          <div
            key={l}
            className={`${styles.levelDot} ${l <= level ? styles.active : ""}`}
          ></div>
        ))}
      </div>
      {showText && (
        <span className={styles.label}>
          {label}
        </span>
      )}
    </div>
  );
}