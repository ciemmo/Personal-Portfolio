"use client";

import { useEffect, useState, memo, useCallback } from "react";
import styles from "./Education.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  description?: string;
  honors?: string[];
  gpa?: string;
  activities?: string[];
  certificateUrl?: string;
}

export default function Education() {
  useScrollAnimation();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string>("idle");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch education data
  useEffect(() => {
    let mounted = true;

    const fetchEducations = async () => {
      setLoading(true);
      setError(null);
      setFetchStatus("fetching");
      try {
        console.log("[Education] Starting fetch to /api/education");
        const res = await fetch("/api/education");
        console.log("[Education] Response status:", res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("[Education] Data received:", data.length, "items");
        if (mounted) {
          setEducations(data);
          setFetchStatus("success");
        }
      } catch (err) {
        console.error("[Education] Error fetching education:", err);
        if (mounted) {
          setError("Failed to load education. Please try again later.");
          setEducations([]);
          setFetchStatus("error: " + (err instanceof Error ? err.message : String(err)));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEducations();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    // Trigger refetch
  }, []);

  // Show loading state during SSR and initial client render (before hydration)
  if (loading || !isMounted) {
    return (
      <section className={`${styles.education} ${styles.fadeUp} fade-up`}>
        <div className={styles.loading}>
        {/* Debug: Show fetch status */}
        <div style={{ padding: "1rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem", fontFamily: "monospace" }}>
          <strong>Debug:</strong> Fetch status: {fetchStatus}
        </div>
        {/* Education Skeletons */}
        <div className={styles.timeline}>
          {/* Show 3 skeleton items while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.educationSkeleton}>
                <div className={styles.educationSkeletonLogo} />
                <div className={styles.educationSkeletonContent}>
                  <div className={styles.educationSkeletonHeader}>
                    <div className={styles.educationSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.educationSkeletonDegree}>
                    <div className={styles.educationSkeletonLine} style={{ width: "70%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "30%" }} />
                  </div>
                  <div className={styles.educationSkeletonInstitution}>
                    <div className={styles.educationSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "60%" }} />
                  </div>
                  <div className={styles.educationSkeletonPeriod} />
                  <div className={styles.educationSkeletonLocation} />
                  <div className={styles.educationSkeletonHonors}>
                    <div className={styles.educationSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.educationSkeletonActivities}>
                    <div className={styles.educationSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "30%" }} />
                    <div className={styles.educationSkeletonLine} style={{ width: "40%" }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${styles.education} ${styles.fadeUp} fade-up`}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Show empty state if no education data
  if (educations.length === 0) {
    return (
      <section className={`${styles.education} ${styles.fadeUp} fade-up`}>
        <div className={styles.container}>
          <h2 className={styles.title}>Education</h2>
          <p className={styles.subtitle}>
            Academic background and educational achievements
          </p>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              {/* Simple icon representing education */}
              <div className={styles.emptyStateGraduationCap} />
            </div>
            <p className={styles.emptyStateText}>
              No education records found.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.education} ${styles.fadeUp} fade-up`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Education</h2>
        <p className={styles.subtitle}>
          Academic background and educational achievements
        </p>

        <div className={`${styles.timeline} ${styles.staggerUp} stagger-up`}>
          {educations.map((education) => (
            <EducationCard
              key={education._id}
              education={education}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface EducationCardProps {
  education: Education;
}

const EducationCardComponent = ({ education }: EducationCardProps) => {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.educationCard}>
        {/* Education content */}
        <div className={styles.educationContent}>
          {/* Institution and degree */}
          <div className={styles.educationHeader}>
            {education.certificateUrl ? (
              <a
                href={education.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.certificateLink}
              >
                {education.institution}
              </a>
            ) : (
              <span className={styles.institutionText}>
                {education.institution}
              </span>
            )}
            <div>
              <h3 className={styles.degreeName}>{education.degree}</h3>
              {education.fieldOfStudy && (
                <p className={styles.fieldOfStudy}>{education.fieldOfStudy}</p>
              )}
            </div>
          </div>

          {/* Location and duration */}
          <div className={styles.educationMeta}>
            {education.location && (
              <span className={styles.location}>
                <span>📍</span> {education.location}
              </span>
            )}
            <span className={styles.period}>
              <span>📅</span>
              {education.startDate}{" "}
              {education.endDate ? `– ${education.endDate}` : "– Present"}
            </span>
          </div>

          {/* Description */}
          {education.description && (
            <div className={styles.educationDescription}>
              <p>{education.description}</p>
            </div>
          )}

          {/* Honors/Awards */}
          {education.honors && education.honors.length > 0 && (
            <div className={styles.educationHonors}>
              <h4 className={styles.honorsTitle}>Honors & Awards:</h4>
              <div className={styles.honorsList}>
                {education.honors.map((honor, index) => (
                  <span key={`honor-${index}-${honor.slice(0, 20)}`} className={styles.honorItem}>
                    • {honor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GPA */}
          {education.gpa && (
            <div className={styles.educationGPA}>
              <h4 className={styles.gpaTitle}>GPA:</h4>
              <p className={styles.gpaValue}>{education.gpa}</p>
            </div>
          )}

          {/* Activities */}
          {education.activities && education.activities.length > 0 && (
            <div className={styles.educationActivities}>
              <h4 className={styles.activitiesTitle}>Activities:</h4>
              <div className={styles.activitiesList}>
                {education.activities.map((activity, index) => (
                  <span key={`activity-${index}-${activity.slice(0, 20)}`} className={styles.activityItem}>
                    • {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const EducationCard = memo(EducationCardComponent);