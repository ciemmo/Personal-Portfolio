"use client";

import { useEffect, useState, memo, useCallback, useRef } from "react";
import styles from "./CombinedTimeline.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

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
        setTimelineItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    // Trigger refetch by updating a dependency - in practice you'd refetch
    window.location.reload();
  }, []);

  const toggleExpand = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  if (loading) {
    return (
      <section className={styles.combinedTimeline} aria-labelledby="timeline-title">
        <div className={styles.container}>
          <header className={styles.header}>
            <h2 id="timeline-title" className={styles.title}>Experience & Education Timeline</h2>
            <p className={styles.subtitle}>Professional and academic journey in chronological order</p>
          </header>
          <div className={styles.loading} role="status" aria-label="Loading timeline">
            <div className={styles.timeline}>
              {/* Show 3 skeleton items while loading */}
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineSkeleton}>
                    <div className={styles.timelineSkeletonLogo} aria-hidden="true" />
                    <div className={styles.timelineSkeletonContent}>
                      <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "70%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "50%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "30%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "80%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "70%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "80%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "60%" }} aria-hidden="true" />
                      <div className={styles.timelineSkeletonLine} style={{ width: "40%" }} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.combinedTimeline} aria-labelledby="timeline-title">
        <div className={styles.container}>
          <header className={styles.header}>
            <h2 id="timeline-title" className={styles.title}>Experience & Education Timeline</h2>
            <p className={styles.subtitle}>Unable to load timeline data</p>
          </header>
          <div className={styles.error} role="alert">
            <h3 className={styles.errorTitle}>Error Loading Timeline</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (timelineItems.length === 0) {
    return (
      <section className={styles.combinedTimeline} aria-labelledby="timeline-title">
        <div className={styles.container}>
          <header className={styles.header}>
            <h2 id="timeline-title" className={styles.title}>Experience & Education Timeline</h2>
            <p className={styles.subtitle}>Professional and academic journey in chronological order</p>
          </header>
          <div className={styles.empty} role="status">
            <h3 className={styles.emptyTitle}>No Timeline Data</h3>
            <p>No experience or education entries found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.combinedTimeline} ${styles.fadeUp}`} aria-labelledby="timeline-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="timeline-title" className={styles.title}>Experience & Education Timeline</h2>
          <p className={styles.subtitle}>Professional and academic journey in chronological order</p>
        </header>

        <div className={`${styles.timeline} ${styles.staggerUp}`} role="list" aria-label="Experience and education timeline">
          {timelineItems.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedItems.has(item.id)}
              onToggleExpand={toggleExpand}
              prefersReducedMotion={prefersReducedMotion.current}
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
  isExpanded: boolean;
  onToggleExpand: (itemId: string) => void;
  prefersReducedMotion: boolean;
}

const TimelineCardComponent = ({ item, index, isExpanded, onToggleExpand, prefersReducedMotion }: TimelineCardProps) => {
  const isWork = item.type === 'work';
  const workData = item.data as WorkExperience;
  const eduData = item.data as Education;

  // Determine if there's expandable content
  const hasExpandableContent = isWork
    ? (workData.highlights && workData.highlights.length > 0) ||
      (workData.technologies && workData.technologies.length > 0)
    : (eduData.honors && eduData.honors.length > 0) ||
      (eduData.activities && eduData.activities.length > 0) ||
      (eduData.gpa);

  return (
    <div className={styles.timelineItem} role="listitem">
      {/* Timeline Card */}
      <div className={styles.timelineCard}>
        {/* Header with icon and type */}
        <div className={styles.timelineHeader}>
          {isWork ? (
            <div className={`${styles.timelineIcon} ${styles.timelineIconWork}`} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
          ) : (
            <div className={`${styles.timelineIcon} ${styles.timelineIconEducation}`} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
          )}
          <span className={`${styles.timelineTypeLabel} ${isWork ? 'work' : 'education'}`}>
            {isWork ? 'Work Experience' : 'Education'}
          </span>
        </div>

        {/* Main Content */}
        <div className={styles.timelineMainContent}>
          {/* Organization / Institution */}
          <div className={styles.organization}>
            {isWork && workData.logo && typeof workData.logo === 'string' && workData.logo.trim() !== '' ? (
              <OptimizedImage
                src={workData.logo}
                alt={`${workData.company} logo`}
                className={styles.companyLogo}
                width={48}
                height={48}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logos/default.png";
                }}
              />
            ) : !isWork && eduData.certificateUrl ? (
              <div className={styles.companyLogo} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }} aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            ) : null}

            <div className={styles.orgInfo}>
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
                  <span className={styles.roleName}>{workData.role}</span>
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
                  <span className={styles.degreeName}>{eduData.degree}</span>
                  {eduData.fieldOfStudy && (
                    <span className={styles.fieldOfStudy}>{eduData.fieldOfStudy}</span>
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
                <span className={styles.detailIcon} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>
                  {(isWork ? workData.location : eduData.location)}
                </span>
              </div>
            )}

            {/* Period */}
            <div className={styles.detailItem}>
              <span className={styles.detailIcon} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
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
                  {workData.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex} className={styles.responsibilityItem}>
                      {resp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.descriptionText}>{eduData.description}</p>
              )}
            </div>
          )}

          {/* Technologies / Field of Study */}
          {(isWork && workData.technologies && workData.technologies.length > 0) && (
            <div className={styles.techTags} aria-label="Technologies used">
              {workData.technologies.map((tech, techIndex) => (
                <span key={techIndex} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Expandable Section */}
          {hasExpandableContent && (
            <>
              <button
                className={styles.expandToggle}
                onClick={() => onToggleExpand(item.id)}
                aria-expanded={isExpanded}
                aria-controls={`expandable-${item.id}`}
                aria-label={isExpanded ? `Collapse ${isWork ? workData.role : eduData.degree} details` : `Expand ${isWork ? workData.role : eduData.degree} details`}
              >
                <svg className={styles.expandIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>

              {isExpanded && (
                <div
                  id={`expandable-${item.id}`}
                  className={styles.expandedContent}
                  role="region"
                  aria-label={`${isWork ? workData.role : eduData.degree} additional details`}
                >
                  <div className={styles.timelineDetails}>
                    {/* Highlights / Honors */}
                    {(isWork ? workData.highlights : eduData.honors) && (
                      <>
                        {isWork && workData.highlights && workData.highlights.length > 0 && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailIcon} aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                              </svg>
                            </span>
                            <span className={styles.detailLabel}>Highlights:</span>
                            <span className={styles.detailValue}>
                              {workData.highlights!.join(", ")}
                            </span>
                          </div>
                        )}
                        {!isWork && eduData.honors && eduData.honors.length > 0 && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailIcon} aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="8" r="7"></circle>
                                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                              </svg>
                            </span>
                            <span className={styles.detailLabel}>Honors:</span>
                            <span className={styles.detailValue}>
                              {eduData.honors!.join(", ")}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* GPA / Activities */}
                    {!isWork && (
                      <>
                        {eduData.gpa && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailIcon} aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                              </svg>
                            </span>
                            <span className={styles.detailLabel}>GPA:</span>
                            <span className={styles.detailValue}>
                              {eduData.gpa}
                            </span>
                          </div>
                        )}

                        {eduData.activities && eduData.activities.length > 0 && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailIcon} aria-hidden="true">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </span>
                            <span className={styles.detailLabel}>Activities:</span>
                            <span className={styles.detailValue}>
                              {eduData.activities!.join(", ")}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Key Responsibility for Work */}
                    {isWork && workData.responsibilities && workData.responsibilities.length > 0 && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailIcon} aria-hidden="true">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </span>
                        <span className={styles.detailLabel}>Key Responsibility:</span>
                        <span className={styles.detailValue}>
                          {workData.responsibilities[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Timeline Dot on connector line - rendered via CSS ::after pseudo-element */}
    </div>
  );
};

export const TimelineCard = memo(TimelineCardComponent);