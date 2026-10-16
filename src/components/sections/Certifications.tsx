"use client";

import { useEffect, useState } from "react";
import styles from "./Certifications.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  description?: string;
  logoUrl?: string;
  color?: string;
}

interface ContinuingEducation {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  hours?: number;
  skills: string[];
  description?: string;
  certificateUrl?: string;
  logoUrl?: string;
}

export default function Certifications() {
  useScrollAnimation(`.${styles.fadeUp}`, styles.animate);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [continuingEducation, setContinuingEducation] = useState<ContinuingEducation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certifications data
  useEffect(() => {
    const fetchCertifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/certifications");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setCertifications(data);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setError("Failed to load certifications. Please try again later.");
        setCertifications([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    // Fetch continuing education data
    const fetchContinuingEducation = async () => {
      try {
        const res = await fetch("/api/continuingEducation");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        const data = await res.json();
        setContinuingEducation(data);
      } catch (err) {
        console.error("Error fetching continuing education:", err);
        // Don't set error for continuing education as it's supplementary
        setContinuingEducation([]); // Set to empty array on error
      }
    };

    fetchCertifications();
    fetchContinuingEducation();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        {/* Certification Skeletons */}
        <div className={styles.certificationsGrid}>
          {/* Show 3 skeleton cards while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.certificationCard}>
              <div className={styles.certificationSkeleton}>
                <div className={styles.certSkeletonLogo} />
                <div className={styles.certSkeletonContent}>
                  <div className={styles.certSkeletonName}>
                    <div className={styles.certSkeletonLine} style={{ width: "80%" }} />
                    <div className={styles.certSkeletonLine} style={{ width: "60%" }} />
                  </div>
                  <div className={styles.certSkeletonOrg}>
                    <div className={styles.certSkeletonLine} style={{ width: "60%" }} />
                    <div className={styles.certSkeletonLine} style={{ width: "40%" }} />
                  </div>
                  <div className={styles.certSkeletonDate} />
                  <div className={styles.certSkeletonSkills}>
                    <div className={styles.certSkeletonLine} style={{ width: "70%" }} />
                    <div className={styles.certSkeletonLine} style={{ width: "50%" }} />
                    <div className={styles.certSkeletonLine} style={{ width: "40%" }} />
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

  // Return null if no certifications and no continuing education data
  if (certifications.length === 0 && continuingEducation.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.certifications} ${styles.fadeUp}`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Certifications & Continuing Education</h2>
        <p className={styles.subtitle}>
          Official certifications, badges, and ongoing learning pursuits
        </p>

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className={styles.certificationsSection}>
            <h3 className={styles.sectionTitle}>Professional Certifications</h3>
            <div className={styles.timeline}>
              {certifications.map((cert, index) => (
                <div key={cert.id} className={styles.timelineItem}>
                  <div className={styles.timelineIndicator}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineLine} />
                  </div>
                  <div className={styles.timelineContent}>
                    <CertificationCard certification={cert} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continuing Education Section */}
        {continuingEducation.length > 0 && (
          <div className={styles.educationSection}>
            <h3 className={styles.sectionTitle}>Continuing Education</h3>
            <div className={styles.timeline}>
              {continuingEducation.map((edu, index) => (
                <div key={edu.id} className={styles.timelineItem}>
                  <div className={styles.timelineIndicator}>
                    <div className={styles.timelineDot} />
                    <div className={styles.timelineLine} />
                  </div>
                  <div className={styles.timelineContent}>
                    <EducationCard education={edu} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface CertificationCardProps {
  certification: Certification;
}

function CertificationCard({ certification }: CertificationCardProps) {
  const isExpired = certification.expirationDate
    ? new Date(certification.expirationDate) < new Date()
    : false;
  const expiresSoon = certification.expirationDate
    ? (new Date(certification.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24 * 30) <= 3 // Less than 3 months
    : false;

  return (
    <div className={styles.certificationCard}>
      <div className={styles.certificationBadge}>
        {/* Logo */}
        {certification.logoUrl ? (
          <img
            src={certification.logoUrl}
            alt={`${certification.issuingOrganization} logo`}
            className={styles.badgeLogo}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logos/default.png";
            }}
          />
        ) : (
          <div className={styles.badgeLogoPlaceholder} />
        )}

        {/* Content */}
        <div className={styles.badgeContent}>
          <h3 className={styles.badgeName}>{certification.name}</h3>
          <p className={styles.badgeOrg}>{certification.issuingOrganization}</p>

          {/* Dates */}
          <div className={styles.badgeDates}>
            <span className={styles.issueDate}>
              <span>📅</span> Issued: {new Date(certification.issueDate).toLocaleDateString()}
            </span>
            {certification.expirationDate && (
              <span className={styles.expiryDate}>
                <span>⏳</span> Expires: {new Date(certification.expirationDate).toLocaleDateString()}
                {isExpired && (
                  <span className={styles.expiredBadge}>EXPIRED</span>
                )}
                {!isExpired && expiresSoon && (
                  <span className={styles.expiresSoonBadge}>EXPIRING SOON</span>
                )}
              </span>
            )}
          </div>

          {/* Credential ID */}
          {certification.credentialId && (
            <div className={styles.badgeCredential}>
              <span>ID: </span> {certification.credentialId}
            </div>
          )}

          {/* Skills */}
          {certification.skills && certification.skills.length > 0 && (
            <div className={styles.badgeSkills}>
              <span>Skills: </span>
              {certification.skills.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {certification.description && (
            <p className={styles.badgeDescription}>{certification.description}</p>
          )}

          {/* Verify Button */}
          {certification.credentialUrl && (
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.verifyButton}
            >
              Verify Credential
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface EducationCardProps {
  education: ContinuingEducation;
}

function EducationCard({ education }: EducationCardProps) {
  return (
    <div className={styles.educationCard}>
      <div className={styles.educationBadge}>
        {/* Logo */}
        {education.logoUrl ? (
          <img
            src={education.logoUrl}
            alt={`${education.provider} logo`}
            className={styles.educationLogo}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logos/default.png";
            }}
          />
        ) : (
          <div className={styles.educationLogoPlaceholder} />
        )}

        {/* Content */}
        <div className={styles.educationContent}>
          <h3 className={styles.educationName}>{education.name}</h3>
          <p className={styles.educationProvider}>{education.provider}</p>

          {/* Date */}
          <div className={styles.educationDate}>
            <span>📅</span> Completed: {new Date(education.completionDate).toLocaleDateString()}
          </div>

          {/* Hours */}
          {education.hours && (
            <div className={styles.educationHours}>
              <span>⏱️</span> {education.hours} hours
            </div>
          )}

          {/* Skills */}
          {education.skills && education.skills.length > 0 && (
            <div className={styles.educationSkills}>
              <span>Skills: </span>
              {education.skills.map((skill, index) => (
                <span key={index} className={styles.educationSkillTag}>
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {education.description && (
            <p className={styles.educationDescription}>{education.description}</p>
          )}

          {/*
          {education.certificateUrl && (
            <a
              href={education.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certificateButton}
            >
              View Certificate
            </a>
          )}
          */}
        </div>
      </div>
    </div>
  );
}