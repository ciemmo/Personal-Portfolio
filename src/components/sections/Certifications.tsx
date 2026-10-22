"use client";

import { useEffect, useState, useCallback, useMemo, useRef, memo, forwardRef } from "react";
import styles from "./Certifications.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { FaAngleDown, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSearch, FaFilter } from "react-icons/fa";

interface Certification {
  id: string;
  _id?: string;
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
  category?: string;
}

interface ContinuingEducation {
  id: string;
  _id?: string;
  name: string;
  provider: string;
  completionDate: string;
  hours?: number;
  skills: string[];
  description?: string;
  certificateUrl?: string;
  logoUrl?: string;
  category?: string;
}

type CertificationItem = Certification & { type: "certification" };
type EducationItem = ContinuingEducation & { type: "education" };
type UnifiedItem = CertificationItem | EducationItem;

const CATEGORY_COLORS: Record<string, string> = {
  cloud: "#FF9900",
  frontend: "#61DAFB",
  backend: "#339933",
  database: "#336791",
  devops: "#F7DF1E",
  security: "#E34F26",
  testing: "#C21325",
  agile: "#0052CC",
  general: "#6366F1",
};

const EXPIRY_STATUS = {
  active: { label: "ACTIVE", class: "status-active", icon: FaCheckCircle, color: "var(--color-success)" },
  expiring: { label: "EXPIRING SOON", class: "status-expiring", icon: FaExclamationTriangle, color: "var(--color-warning)" },
  expired: { label: "EXPIRED", class: "status-expired", icon: FaTimesCircle, color: "var(--color-danger)" },
} as const;

function getExpiryStatus(expirationDate?: string) {
  if (!expirationDate) return EXPIRY_STATUS.active;
  const expiry = new Date(expirationDate).getTime();
  const now = new Date().getTime();
  const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
  if (expiry < now) return EXPIRY_STATUS.expired;
  if (expiry - now <= threeMonths) return EXPIRY_STATUS.expiring;
  return EXPIRY_STATUS.active;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getYear(dateString: string) {
  return new Date(dateString).getFullYear();
}

interface CertificationCardProps {
  item: UnifiedItem;
  isExpanded: boolean;
  onToggle: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
}

const CertificationCardComponent = memo(forwardRef<HTMLElement, CertificationCardProps>(function CertificationCard({
  item,
  isExpanded,
  onToggle,
}: CertificationCardProps, ref) {
  const isCert = item.type === "certification";
  const status = isCert ? getExpiryStatus(item.expirationDate) : EXPIRY_STATUS.active;
  const categoryColor = item.category ? CATEGORY_COLORS[item.category.toLowerCase()] : "var(--color-primary)";
  const year = isCert ? getYear(item.issueDate) : getYear(item.completionDate);

  return (
    <article
      ref={ref}
      className={`${styles.card} ${isExpanded ? styles.expanded : ""} ${isCert ? styles.certification : styles.education}`}
      style={{ "--category-color": categoryColor } as React.CSSProperties}
    >
      <div className={styles.cardInner} onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" || e.key === " " ? (e.preventDefault(), onToggle()) : undefined} aria-expanded={isExpanded} aria-label={isExpanded ? `Collapse ${item.name}` : `Expand ${item.name}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIconWrapper}>
            {item.logoUrl ? (
              <OptimizedImage
                src={item.logoUrl}
                alt={`${isCert ? item.issuingOrganization : item.provider} logo`}
                className={styles.cardIcon}
                width={48}
                height={48}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logos/default.png";
                }}
              />
            ) : (
              <div className={styles.cardIconPlaceholder} aria-hidden="true" />
            )}
          </div>
          <div className={styles.cardMeta}>
            <h3 className={styles.cardTitle}>{item.name}</h3>
            <p className={styles.cardOrg}>{isCert ? item.issuingOrganization : item.provider}</p>
            <div className={styles.cardMetaRow}>
              <span className={styles.cardDate}>
                <span className={styles.dateIcon} aria-hidden="true">📅</span>
                {isCert ? `Issued ${formatDate(item.issueDate)}` : `Completed ${formatDate(item.completionDate)}`}
              </span>
              {isCert && item.expirationDate && (
                <span className={`${styles.expiryBadge} ${styles[status.class]}`}>
                  <status.icon className={styles.expiryIcon} aria-hidden="true" />
                  {status.label}
                </span>
              )}
              {item.type === "education" && item.hours && (
                <span className={styles.cardHours}>
                  <span className={styles.hoursIcon} aria-hidden="true">⏱️</span>
                  {item.hours} hrs
                </span>
              )}
            </div>
          </div>
          <button
            className={styles.expandToggle}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
            aria-expanded={isExpanded}
          >
            <FaAngleDown className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ""}`} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.cardContent} role="region" aria-label={`${item.name} details`}>
          {isCert && item.credentialId && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Credential ID</span>
              <code className={styles.detailValue}>{item.credentialId}</code>
            </div>
          )}

          {item.skills && item.skills.length > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Skills</span>
              <div className={styles.skillTags}>
                {item.skills.map((skill, idx) => (
                  <span key={idx} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {item.description && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Description</span>
              <p className={styles.detailDescription}>{item.description}</p>
            </div>
          )}

          {isCert && item.credentialUrl && (
            <a
              href={item.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.primary}`}
              onClick={(e) => e.stopPropagation()}
            >
              Verify Credential
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}

          {item.type === "education" && item.certificateUrl && (
            <a
              href={item.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondary}`}
              onClick={(e) => e.stopPropagation()}
            >
              View Certificate
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Card connector removed - no lines between cards */}
    </article>
  );
}));

export const CertificationCard = CertificationCardComponent;

export default function Certifications() {
  const scrollRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [continuingEducation, setContinuingEducation] = useState<ContinuingEducation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchStatus, setFetchStatus] = useState<string>("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Scroll animation observer
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // useScrollAnimation for child elements
  useScrollAnimation(".fade-up, .stagger-up > *", "animate");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Fetch certifications data
  useEffect(() => {
    let mounted = true;

    const fetchCertifications = async () => {
      setLoading(true);
      setError(null);
      setFetchStatus("fetching certifications");
      try {
        console.log("[Certifications] Starting fetch to /api/certifications");
        const res = await fetch("/api/certifications");
        console.log("[Certifications] Response status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        console.log("[Certifications] Data received:", data.length, "items");
        if (mounted) {
          setCertifications(data);
          setFetchStatus("certifications success");
        }
      } catch (err) {
        console.error("[Certifications] Error fetching certifications:", err);
        if (mounted) {
          setError("Failed to load certifications. Please try again later.");
          setCertifications([]);
          setFetchStatus("certifications error: " + (err instanceof Error ? err.message : String(err)));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const fetchContinuingEducation = async () => {
      try {
        console.log("[Certifications] Starting fetch to /api/continuingEducation");
        const res = await fetch("/api/continuingEducation");
        console.log("[Certifications] Continuing education response status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        console.log("[Certifications] Continuing education data received:", data.length, "items");
        if (mounted) {
          setContinuingEducation(data);
          setFetchStatus("all success");
        }
      } catch (err) {
        console.error("[Certifications] Error fetching continuing education:", err);
        if (mounted) {
          setContinuingEducation([]);
          setFetchStatus(prev => prev + "; continuing education error: " + (err instanceof Error ? err.message : String(err)));
        }
      }
    };

    fetchCertifications();
    fetchContinuingEducation();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    // The fetch effects will re-run due to loading state change
    window.location.reload();
  }, []);

  // Combine and filter items
  const allItems = useMemo((): UnifiedItem[] => {
    const certs: UnifiedItem[] = certifications.map((c, idx) => ({
      ...c,
      id: c._id ?? c.id ?? `cert-${idx}`,
      type: "certification" as const
    }));
    const edu: UnifiedItem[] = continuingEducation.map((e, idx) => ({
      ...e,
      id: e._id ?? e.id ?? `edu-${idx}`,
      type: "education" as const
    }));
    return [...certs, ...edu].sort((a, b) => {
      const dateA = a.type === "certification" ? a.issueDate : a.completionDate;
      const dateB = b.type === "certification" ? b.issueDate : b.completionDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [certifications, continuingEducation]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allItems.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, [allItems]);

  const years = useMemo(() => {
    const yrs = new Set<string>();
    allItems.forEach(item => {
      const year = item.type === "certification" ? getYear(item.issueDate) : getYear(item.completionDate);
      yrs.add(year.toString());
    });
    return Array.from(yrs).sort((a, b) => parseInt(b) - parseInt(a));
  }, [allItems]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.type === "certification" ? item.issuingOrganization : item.provider).toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      const itemYear = item.type === "certification" ? getYear(item.issueDate) : getYear(item.completionDate);
      const matchesYear = selectedYear === "all" || itemYear.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [allItems, searchQuery, selectedCategory, selectedYear]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>, index: number) => {
    const cards = cardRefs.current.filter((ref): ref is HTMLElement => ref !== null);
    const maxIndex = cards.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, maxIndex));
        cards[Math.min(index + 1, maxIndex)]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        cards[Math.max(index - 1, 0)]?.focus();
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        cards[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(maxIndex);
        cards[maxIndex]?.focus();
        break;
      case "Enter":
      case " ":
        if (e.target === cards[index]) {
          e.preventDefault();
          toggleExpand(filteredItems[index].id);
        }
        break;
    }
  }, [filteredItems, toggleExpand]);

  if (loading) {
    return (
      <section className={`${styles.certifications} ${styles.fadeUp}`} ref={scrollRef} aria-labelledby="certifications-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.sectionLabel}>
                <span className={styles.sectionLabelIcon} role="img" aria-label="certifications">📜</span>
                Certifications & Education
              </span>
              <h2 id="certifications-title" className={styles.title}>
                Professional Credentials
              </h2>
              <p className={styles.subtitle}>
                Official certifications, badges, and ongoing learning pursuits
              </p>
            </div>
          </div>

          {/* Debug: Show fetch status */}
          <div style={{ padding: "1rem", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem", fontFamily: "monospace", margin: "0 1rem 1rem" }}>
            <strong>Debug:</strong> Fetch status: {fetchStatus}
          </div>

          <div className={styles.timeline} role="list" aria-label="Certifications timeline">
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonCard} role="listitem" aria-hidden="true">
                <div className={styles.skeletonCardInner}>
                  <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonIcon} />
                    <div className={styles.skeletonMeta}>
                      <div className={styles.skeletonTitle} />
                      <div className={styles.skeletonOrg} />
                      <div className={styles.skeletonMetaRow}>
                        <div className={styles.skeletonDate} />
                        <div className={styles.skeletonBadge} />
                      </div>
                    </div>
                    <div className={styles.skeletonExpand} />
                  </div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonDetailRow}>
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLine} style={{ width: "60%" }} />
                    </div>
                    <div className={styles.skeletonDetailRow}>
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLine} style={{ width: "80%" }} />
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
      <section className={`${styles.certifications} ${styles.fadeUp}`} ref={scrollRef} aria-labelledby="certifications-title">
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={handleRetry} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (filteredItems.length === 0 && allItems.length > 0) {
    return (
      <section className={`${styles.certifications} ${styles.fadeUp}`} ref={scrollRef} aria-labelledby="certifications-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.sectionLabel}>
                <span className={styles.sectionLabelIcon} role="img" aria-label="certifications">📜</span>
                Certifications & Education
              </span>
              <h2 id="certifications-title" className={styles.title}>
                Professional Credentials
              </h2>
              <p className={styles.subtitle}>
                Official certifications, badges, and ongoing learning pursuits
              </p>
            </div>
            <div className={styles.filters}>
              <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search certifications"
                />
              </div>
              <div className={styles.filterGroup}>
                <select className={styles.filterSelect} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} aria-label="Filter by category">
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select className={styles.filterSelect} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} aria-label="Filter by year">
                  <option value="all">All Years</option>
                  {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <div className={styles.emptyStateBadge}>
                <div className={styles.emptyStateCircle} />
                <FaSearch className={styles.emptyStateSearchIcon} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.emptyStateText}>
              No certifications match your current filters.
            </p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedYear("all"); }} className={styles.clearFiltersButton}>
              <FaFilter className={styles.clearIcon} aria-hidden="true" />
              Clear Filters
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.certifications} ${styles.fadeUp} ${inView ? styles.animate : ""}`} ref={scrollRef} aria-labelledby="certifications-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="certifications">📜</span>
              Certifications & Education
            </span>
            <h2 id="certifications-title" className={styles.title}>
              Professional Credentials
            </h2>
            <p className={styles.subtitle}>
              Official certifications, badges, and ongoing learning pursuits
            </p>
          </div>

          {(allItems.length > 0) && (
            <div className={styles.filters}>
              <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search certifications"
                />
              </div>
              <div className={styles.filterGroup}>
                <FaFilter className={styles.filterIcon} aria-hidden="true" />
                <select className={styles.filterSelect} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} aria-label="Filter by category">
                  <option value="all">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select className={styles.filterSelect} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} aria-label="Filter by year">
                  <option value="all">All Years</option>
                  {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className={`${styles.timeline} ${styles.staggerUp} stagger-up`} role="list" aria-label="Certifications timeline">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.type}-${item.id}`}
              className={styles.timelineItem}
              style={{
                "--stagger-delay": `${Math.min(index * 80, 600)}ms`,
              } as React.CSSProperties}
              role="listitem"
            >
              <CertificationCardComponent
                ref={(el) => { cardRefs.current[index] = el; }}
                item={item}
                isExpanded={expandedItems.has(item.id)}
                onToggle={() => toggleExpand(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && allItems.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <div className={styles.emptyStateBadge}>
                <div className={styles.emptyStateCircle} />
                <FaCheckCircle className={styles.emptyStateCheckIcon} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.emptyStateText}>
              No certifications or continuing education records found.
            </p>
          </div>
        )}

        <div className={styles.legend} aria-label="Expiry status legend">
          <div className={styles.legendItem}>
            <FaCheckCircle className={`${styles.legendIcon} ${styles.legendActive}`} aria-hidden="true" />
            <span>Active</span>
          </div>
          <div className={styles.legendItem}>
            <FaExclamationTriangle className={`${styles.legendIcon} ${styles.legendExpiring}`} aria-hidden="true" />
            <span>Expiring Soon</span>
          </div>
          <div className={styles.legendItem}>
            <FaTimesCircle className={`${styles.legendIcon} ${styles.legendExpired}`} aria-hidden="true" />
            <span>Expired</span>
          </div>
        </div>
      </div>
    </section>
  );
}