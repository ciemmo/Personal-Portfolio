"use client";

import { useEffect, useState } from "react";
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
  useScrollAnimation(`.${styles.fadeUp}`, styles.animate);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch education data
  useEffect(() => {
    const fetchEducations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/education");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setEducations(data);
      } catch (err) {
        console.error("Error fetching education:", err);
        setError("Failed to load education. Please try again later.");
        setEducations([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
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

  if (educations.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.education} ${styles.fadeUp}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Education</h2>
        <p className={styles.subtitle}>
          Academic background and educational achievements
        </p>

        <div className={styles.timeline}>
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

function EducationCard({ education }: EducationCardProps) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.educationCard}>
        {/* Timeline indicator */}
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineDot} />
          <div className={styles.timelineLine} />
        </div>

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
                  <span key={index} className={styles.honorItem}>
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
                  <span key={index} className={styles.activityItem}>
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
}