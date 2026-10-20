"use client";

import { useEffect, useState, memo, useCallback } from "react";
import styles from "./WorkExperience.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface WorkExperience {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  duration: string;
  responsibilities: string[];
  technologies: string[];
  highlights?: string[];
  url?: string;
  logo?: string;
}

export default function WorkExperience() {
  useScrollAnimation();
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch work experience data
  useEffect(() => {
    const fetchWorkExperience = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/workExperience");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setWorkExperiences(data);
      } catch (err) {
        console.error("Error fetching work experience:", err);
        setError("Failed to load work experience. Please try again later.");
        setWorkExperiences([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchWorkExperience();
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    // Trigger refetch
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        {/* Work Experience Skeletons */}
        <div className={styles.timeline}>
          {/* Show 3 skeleton items while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.experienceSkeleton}>
                <div className={styles.experienceSkeletonLogo} />
                <div className={styles.experienceSkeletonContent}>
                  <div className={styles.experienceSkeletonHeader}>
                    <div className={styles.experienceSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.experienceSkeletonRole}>
                    <div className={styles.experienceSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "50%" }} />
                  </div>
                  <div className={styles.experienceSkeletonDuration} />
                  <div className={styles.experienceSkeletonResponsibilities}>
                    <div className={styles.experienceSkeletonLine} style={{ width: "90%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "70%" }} />
                  </div>
                  <div className={styles.experienceSkeletonTechnologies}>
                    <div className={styles.experienceSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "30%" }} />
                    <div className={styles.experienceSkeletonLine} style={{ width: "40%" }} />
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
        <button onClick={handleRetry}>
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state if no work experience data
  if (workExperiences.length === 0) {
    return (
      <section className={`${styles.workExperience} ${styles.fadeUp}`}>
        <div className={styles.container}>
          <h2 className={styles.title}>Work Experience</h2>
          <p className={styles.subtitle}>
            Professional journey and technical expertise gained through various roles
          </p>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              {/* Simple icon representing work experience */}
              <div className={styles.emptyStateBriefcase} />
            </div>
            <p className={styles.emptyStateText}>
              No work experience records found.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.workExperience} ${styles.fadeUp}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Work Experience</h2>
        <p className={styles.subtitle}>
          Professional journey and technical expertise gained through various roles
        </p>

        <div className={`${styles.timeline} ${styles.staggerUp}`}>
          {workExperiences.map((experience) => (
            <ExperienceCard
              key={experience._id}
              experience={experience}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ExperienceCardProps {
  experience: WorkExperience;
}

const ExperienceCardComponent = ({ experience }: ExperienceCardProps) => {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.experienceCard}>
        {/* Timeline indicator */}
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineDot} />
          <div className={styles.timelineLine} />
        </div>

        {/* Experience content */}
        <div className={styles.experienceContent}>
          {/* Company and role */}
          <div className={styles.experienceHeader}>
            {experience.logo && typeof experience.logo === 'string' && experience.logo.trim() !== '' ? (
              <OptimizedImage
                src={experience.logo}
                alt={`${experience.company} logo`}
                className={styles.companyLogo}
                width={50}
                height={50}
                // Handle error case by using onError with a fallback
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logos/default.png";
                }}
              />
            ) : (
              <div className={styles.companyLogoPlaceholder} />
            )}
            <div>
              <h3 className={styles.companyName}>
                <a
                  href={experience.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.companyLink}
                >
                  {experience.company}
                </a>
              </h3>
              <p className={styles.roleName}>{experience.role}</p>
            </div>
          </div>

          {/* Location and duration */}
          <div className={styles.experienceMeta}>
            {experience.location && (
              <span className={styles.location}>
                <span>📍</span> {experience.location}
              </span>
            )}
            <span className={styles.duration}>
              <span>📅</span> {experience.duration}
            </span>
          </div>

          {/* Responsibilities */}
          <div className={styles.experienceResponsibilities}>
            <h4 className={styles.responsibilitiesTitle}>Responsibilities:</h4>
            <ul className={styles.responsibilitiesList}>
              {experience.responsibilities.map((resp, index) => (
                <li key={index} className={styles.responsibilityItem}>
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className={styles.experienceTechnologies}>
            <h4 className={styles.technologiesTitle}>Technologies:</h4>
            <div className={styles.technologiesList}>
              {experience.technologies.map((tech, index) => (
                <span key={index} className={styles.technologyBadge}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights (if available) */}
          {experience.highlights && experience.highlights.length > 0 && (
            <div className={styles.experienceHighlights}>
              <h4 className={styles.highlightsTitle}>Highlights:</h4>
              {experience.highlights.map((highlight, index) => (
                <p key={index} className={styles.highlightItem}>
                  <span>•</span> {highlight}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ExperienceCard = memo(ExperienceCardComponent);