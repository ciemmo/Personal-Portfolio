"use client";

import { useEffect, useState } from "react";
import styles from "./CombinedTimeline.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

// Types
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

interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  data: WorkExperience | Education;
}

// Helper function to convert date string to comparable value
const parseDateForSorting = (dateString: string): number => {
  // Handle year-only format (e.g., "2020")
  if (/^\d{4}$/.test(dateString)) {
    return parseInt(dateString) * 10000; // Convert to YYYY0000 format for sorting
  }

  // Handle year-month format (e.g., "2020-06")
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-').map(Number);
    return year * 100 + month; // Convert to YYYYMM format for sorting
  }

  // Handle full date (e.g., "2020-06-15")
  try {
    return Date.parse(dateString);
  } catch (e) {
    // If parsing fails, return a very old date so it sorts to the beginning
    return 0;
  }
};

export default function CombinedTimeline() {
  useScrollAnimation(`.${styles.fadeUp}`, styles.animate);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch and combine timeline data
  useEffect(() => {
    const fetchTimelineData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch work experience data
        const workRes = await fetch("/api/workExperience");
        if (!workRes.ok) {
          throw new Error(`Failed to fetch work experience: ${workRes.statusText}`);
        }
        const workData: WorkExperience[] = await workRes.json();

        // Fetch education data
        const eduRes = await fetch("/api/education");
        if (!eduRes.ok) {
          throw new Error(`Failed to fetch education: ${eduRes.statusText}`);
        }
        const eduData: Education[] = await eduRes.json();

        // Convert to timeline items with type information
        const workItems: TimelineItem[] = workData.map(work => ({
          id: work._id,
          type: 'work',
          data: work
        }));

        const eduItems: TimelineItem[] = eduData.map(edu => ({
          id: edu._id,
          type: 'education',
          data: edu
        }));

        // Combine all items
        const allItems = [...workItems, ...eduItems];

        // Sort by start date (oldest first)
        const sortedItems = allItems.sort((a, b) => {
          const dateA = a.type === 'work'
            ? parseDateForSorting((a.data as WorkExperience).startDate)
            : parseDateForSorting((a.data as Education).startDate);

          const dateB = b.type === 'work'
            ? parseDateForSorting((b.data as WorkExperience).startDate)
            : parseDateForSorting((b.data as Education).startDate);

          return dateA - dateB;
        });

        setTimelineItems(sortedItems);
      } catch (err) {
        console.error("Error fetching timeline data:", err);
        setError("Failed to load timeline data. Please try again later.");
        setTimelineItems([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        {/* Combined Timeline Skeletons */}
        <div className={styles.timeline}>
          {/* Show 3 skeleton items while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineSkeleton}>
                <div className={styles.timelineSkeletonLogo} />
                <div className={styles.timelineSkeletonContent}>
                  <div className={styles.timelineSkeletonHeader}>
                    <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.timelineSkeletonTitle}>
                    <div className={styles.timelineSkeletonLine} style={{ width: "70%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "30%" }} />
                  </div>
                  <div className={styles.timelineSkeletonInstitution}>
                    <div className={styles.timelineSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} />
                  </div>
                  <div className={styles.timelineSkeletonRole}>
                    <div className={styles.timelineSkeletonLine} style={{ width: "70%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.timelineSkeletonPeriod} />
                  <div className={styles.timelineSkeletonLocation} />
                  <div className={styles.timelineSkeletonDescription}>
                    <div className={styles.timelineSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} />
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

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.combinedTimeline} ${styles.fadeUp}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Experience & Education Timeline</h2>
        <p className={styles.subtitle}>
          Professional and academic journey in chronological order
        </p>

        <div className={styles.timeline}>
          {timelineItems.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
}

function TimelineCard({ item, index }: TimelineCardProps) {
  const isWork = item.type === 'work';
  const workData = item.data as WorkExperience;
  const eduData = item.data as Education;

  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineCard}>
        {/* Timeline indicator */}
        <div className={styles.timelineIndicator}>
          <div className={styles.timelineDot} />
          <div className={styles.timelineLine} />
        </div>

        {/* Timeline content */}
        <div className={styles.timelineContent}>
          {/* Header with icon and type */}
          <div className={styles.timelineHeader}>
            {isWork ? (
              <div className={styles.timelineIconWork}>
                <span>💼</span>
              </div>
            ) : (
              <div className={styles.timelineIconEducation}>
                <span>🎓</span>
              </div>
            )}
            <div className={styles.timelineTypeLabel}>
              {isWork ? 'Work Experience' : 'Education'}
            </div>
          </div>

          {/* Main content */}
          <div className={styles.timelineMainContent}>
            {/* Title and organization */}

            {/* Work Experience */}
            <div className={styles.workExperienceSection}>
              {isWork && workData.logo && typeof workData.logo === 'string' && workData.logo.trim() !== '' ? (
                <img
                  src={workData.logo}
                  alt={`${workData.company} logo`}
                  className={styles.companyLogo}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/logos/default.png";
                  }}
                />
              ) : null}

              <div>
                {isWork ? (
                  <>
                    {workData.url ? (
                      <a
                        href={workData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.companyLink}
                      >
                        {workData.company}
                      </a>
                    ) : (
                      <span className={styles.companyName}>
                        {workData.company}
                      </span>
                    )}
                    <h3 className={styles.roleName}>{workData.role}</h3>
                  </>
                ) : (
                  <>
                    {eduData.certificateUrl ? (
                      <a
                        href={eduData.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.certificateLink}
                      >
                        {eduData.institution}
                      </a>
                    ) : (
                      <span className={styles.institutionText}>
                        {eduData.institution}
                      </span>
                    )}
                    <h3 className={styles.degreeName}>{eduData.degree}</h3>
                    {eduData.fieldOfStudy && (
                      <p className={styles.fieldOfStudy}>{eduData.fieldOfStudy}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Details */}
            <div className={styles.timelineDetails}>
              {/* Location */}
              {(isWork ? workData.location : eduData.location) && (
                <div className={styles.detailItem}>
                  <span>📍</span>
                  <span className={styles.detailLabel}>Location:</span>
                  <span className={styles.detailValue}>
                    {(isWork ? workData.location : eduData.location)}
                  </span>
                </div>
              )}

              {/* Period */}
              <div className={styles.detailItem}>
                <span>📅</span>
                <span className={styles.detailLabel}>Period:</span>
                <span className={styles.detailValue}>
                  {(isWork ? workData.startDate : eduData.startDate)}{" "}
                  {(isWork ?
                    (workData.endDate ? `– ${workData.endDate}` : "– Present") :
                    (eduData.endDate ? `– ${eduData.endDate}` : "– Present")
                  )}
                </span>
              </div>
            </div>

            {/* Description */}
            {(isWork ? workData.responsibilities : eduData.description) && (
              <div className={styles.timelineDescription}>
                <h4 className={styles.descriptionTitle}>
                  {isWork ? 'Responsibilities:' : 'Description:'}
                </h4>
                {isWork ? (
                  <ul className={styles.responsibilitiesList}>
                    {workData.responsibilities.map((resp, index) => (
                      <li key={index} className={styles.responsibilityItem}>
                        {resp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{eduData.description}</p>
                )}
              </div>
            )}

            {/* Technologies / Field of Study */}
            <div className={styles.timelineDetails}>
              {(isWork ? workData.technologies : eduData.fieldOfStudy) && (
                <>
                  {isWork && workData.technologies.length > 0 && (
                    <div className={styles.detailItem}>
                      <span>💻</span>
                      <span className={styles.detailLabel}>Technologies:</span>
                      <span className={styles.detailValue}>
                        {workData.technologies.join(", ")}
                      </span>
                    </div>
                  )}
                  {!isWork && eduData.fieldOfStudy && (
                    <div className={styles.detailItem}>
                      <span>📚</span>
                      <span className={styles.detailLabel}>Field of Study:</span>
                      <span className={styles.detailValue}>
                        {eduData.fieldOfStudy}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Honors / Highlights */}
              <div className={styles.timelineDetails}>
                {(isWork ? workData.highlights : eduData.honors) && (
                  <>
                    {isWork && workData.highlights.length > 0 && (
                      <div className={styles.detailItem}>
                        <span>🏆</span>
                        <span className={styles.detailLabel}>Highlights:</span>
                        <span className={styles.detailValue}>
                          {workData.highlights.join(", ")}
                        </span>
                      </div>
                    )}
                    {!isWork && eduData.honors.length > 0 && (
                      <div className={styles.detailItem}>
                        <span>🎖️</span>
                        <span className={styles.detailLabel}>Honors:</span>
                        <span className={styles.detailValue}>
                          {eduData.honors.join(", ")}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* GPA / Activities */}
                <div className={styles.timelineDetails}>
                  {(!isWork && eduData.gpa) && (
                    <div className={styles.detailItem}>
                      <span>📊</span>
                      <span className={styles.detailLabel}>GPA:</span>
                      <span className={styles.detailValue}>
                        {eduData.gpa}
                      </span>
                    </div>
                  )}

                  {(!isWork && eduData.activities && eduData.activities.length > 0) && (
                    <div className={styles.detailItem}>
                      <span>🏃</span>
                      <span className={styles.detailLabel}>Activities:</span>
                      <span className={styles.detailValue}>
                        {eduData.activities.join(", ")}
                      </span>
                    </div>
                  )}

                  {(isWork && workData.responsibilities.length > 0) && (
                    <div className={styles.detailItem}>
                      <span>📝</span>
                      <span className={styles.detailLabel}>Key Responsibility:</span>
                      <span className={styles.detailValue}>
                        {workData.responsibilities[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}