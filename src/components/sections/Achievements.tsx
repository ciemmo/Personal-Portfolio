"use client";

import { useEffect, useState } from "react";
import { Achievement } from "@/data/achievements";
import styles from "./Achievements.module.css";

export default function Achievements() {
  const [achievementsData, setAchievementsData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setAchievementsData(data);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Failed to load achievements. Please try again later.");
        setAchievementsData([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Group achievements by category
  const groupedAchievements = achievementsData.reduce((acc, achievement) => {
    const category = achievement.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (loading) {
    return (
      <div className={styles.loading}>
        {/* Achievement Skeletons */}
        <div className={styles.achievementsGrid}>
          {/* Show 3 skeleton cards while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.achievementCard}>
              <div className={styles.achievementSkeleton}>
                {/* Skeleton icon */}
                <div className={styles.achievementSkeletonIcon} />

                {/* Skeleton content */}
                <div className={styles.achievementSkeletonContent}>
                  <div className={styles.achievementSkeletonTitle}>
                    <div className={styles.achievementSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "40%" }} />
                  </div>

                  <div className={styles.achievementSkeletonDescription}>
                    <div className={styles.achievementSkeletonLine} style={{ width: "70%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "30%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.achievementSkeletonLine} style={{ width: "40%" }} />
                  </div>

                  {/* Skeleton date */}
                  <div className={styles.achievementSkeletonDate}>
                    <div className={styles.achievementSkeletonLine} style={{ width: "50%" }} />
                  </div>

                  {/* Skeleton URL button (if applicable) */}
                  <div className={styles.achievementSkeletonUrl}>
                    <div className={styles.achievementSkeletonLine} style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            // Trigger refetch
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (achievementsData.length === 0) {
    return null;
  }

  return (
    <section className={styles.achievements}>
      <h2 className={styles.title}>Key Achievements</h2>
      <p className={styles.description}>
        Highlights of my professional journey and accomplishments
      </p>

      <div className={styles.achievementsGrid}>
        {/* Display achievements grouped by category */}
        {Object.keys(groupedAchievements).map((category) => (
          <div key={category} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>
              {formatCategoryTitle(category)}
            </h3>
            <div className={styles.categoryItems}>
              {groupedAchievements[category].map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Format category title for display
 */
function formatCategoryTitle(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Individual achievement card component
 */
function AchievementCard({ achievement }: { achievement: Achievement }) {
  return achievement.url ? (
    <a
      href={achievement.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.achievementCard}
    >
      {achievement.icon && (
        <div className={styles.achievementIcon}>
          {achievement.icon}
        </div>
      )}
      <div className={styles.achievementContent}>
        <h3 className={styles.achievementTitle}>{achievement.title}</h3>
        <p className={styles.achievementDescription}>{achievement.description}</p>
        {achievement.date && (
          <p className={styles.achievementDate}>
            <span className={styles.achievementDateLabel}>Date:</span> {achievement.date}
          </p>
        )}
      </div>
    </a>
  ) : (
    <div className={styles.achievementCard}>
      {achievement.icon && (
        <div className={styles.achievementIcon}>
          {achievement.icon}
        </div>
      )}
      <div className={styles.achievementContent}>
        <h3 className={styles.achievementTitle}>{achievement.title}</h3>
        <p className={styles.achievementDescription}>{achievement.description}</p>
        {achievement.date && (
          <p className={styles.achievementDate}>
            <span className={styles.achievementDateLabel}>Date:</span> {achievement.date}
          </p>
        )}
      </div>
    </div>
  );
}