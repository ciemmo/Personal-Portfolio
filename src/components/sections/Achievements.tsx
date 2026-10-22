"use client";

import { useEffect, useState, useCallback, useMemo, useRef, memo, forwardRef } from "react";
import { Achievement } from "@/data/achievements";
import styles from "./Achievements.module.css";
import { FaFilter, FaTrophy, FaAward, FaMedal, FaStar, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  award: <FaAward aria-hidden="true" />,
  certification: <FaMedal aria-hidden="true" />,
  competition: <FaTrophy aria-hidden="true" />,
  publication: <FaStar aria-hidden="true" />,
  recognition: <FaCheckCircle aria-hidden="true" />,
  other: <FaStar aria-hidden="true" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  award: "#FFD700",
  certification: "#C0C0C0",
  competition: "#FF6B35",
  publication: "#9B59B6",
  recognition: "#27AE60",
  other: "#6366F1",
};

export default function Achievements() {
  const [achievementsData, setAchievementsData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Fetch achievements data
  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        setAchievementsData(data);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Failed to load achievements. Please try again later.");
        setAchievementsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    window.location.reload();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    achievementsData.forEach(a => cats.add(a.category || "other"));
    return ["all", ...Array.from(cats).sort()];
  }, [achievementsData]);

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === "all") return achievementsData;
    return achievementsData.filter(a => (a.category || "other") === selectedCategory);
  }, [achievementsData, selectedCategory]);

  // Group by category for "all" view
  const groupedAchievements = useMemo(() => {
    if (selectedCategory !== "all") return null;
    return filteredAchievements.reduce((acc, achievement) => {
      const category = achievement.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(achievement);
      return acc;
    }, {} as Record<string, Achievement[]>);
  }, [filteredAchievements, selectedCategory]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedCards(prev => {
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
      case "ArrowRight":
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, maxIndex));
        cards[Math.min(index + 1, maxIndex)]?.focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        cards[Math.max(index - 1, 0)]?.focus();
        break;
      case "ArrowDown":
        // Move to next row (approximate)
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 3, maxIndex));
        cards[Math.min(index + 3, maxIndex)]?.focus();
        break;
      case "ArrowUp":
        // Move to previous row
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 3, 0));
        cards[Math.max(index - 3, 0)]?.focus();
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
          toggleExpand(filteredAchievements[index].id);
        }
        break;
    }
  }, [filteredAchievements, toggleExpand]);

  const [focusedIndex, setFocusedIndex] = useState(0);

  // Scroll animation for section entrance
  useScrollAnimation();

  if (loading) {
    return (
      <section className={`${styles.achievements} fade-up`} aria-labelledby="achievements-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="achievements">🏆</span>
              Key Achievements
            </span>
            <h2 id="achievements-title" className={styles.title}>
              Professional Highlights
            </h2>
            <p className={styles.subtitle}>
              Highlights of my professional journey and accomplishments
            </p>
          </div>

          <div className={styles.masonryGrid} role="list" aria-label="Achievements grid">
            {[1, 2, 3, 4, 5].map((i) => {
              return (
                <article key={i} className={styles.skeletonCard} role="listitem" aria-hidden="true">
                  <div className={styles.skeletonCardInner}>
                    <div className={styles.skeletonIcon} />
                    <div className={styles.skeletonContent}>
                      <div className={styles.skeletonTitle} />
                      <div className={styles.skeletonTitle} style={{ width: "70%" }} />
                      <div className={styles.skeletonDescription} />
                      <div className={styles.skeletonDescription} style={{ width: "60%" }} />
                      <div className={styles.skeletonDescription} style={{ width: "40%" }} />
                      <div className={styles.skeletonDate} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${styles.achievements} fade-up`} aria-labelledby="achievements-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="achievements">🏆</span>
              Key Achievements
            </span>
            <h2 id="achievements-title" className={styles.title}>
              Professional Highlights
            </h2>
            <p className={styles.subtitle}>
              Highlights of my professional journey and accomplishments
            </p>
          </div>
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

  if (achievementsData.length === 0) {
    return (
      <section className={`${styles.achievements} fade-up`} aria-labelledby="achievements-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="achievements">🏆</span>
              Key Achievements
            </span>
            <h2 id="achievements-title" className={styles.title}>
              Professional Highlights
            </h2>
            <p className={styles.subtitle}>
              Highlights of my professional journey and accomplishments
            </p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <div className={styles.emptyStateBadge}>
                <FaTrophy className={styles.emptyStateTrophyIcon} aria-hidden="true" />
              </div>
            </div>
            <p className={styles.emptyStateText}>
              No achievements found.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.achievements} fade-up`} aria-labelledby="achievements-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="achievements">🏆</span>
              Key Achievements
            </span>
            <h2 id="achievements-title" className={styles.title}>
              Professional Highlights
            </h2>
            <p className={styles.subtitle}>
              Highlights of my professional journey and accomplishments
            </p>
          </div>

          {categories.length > 1 && (
            <div className={styles.filterBar} role="group" aria-label="Filter achievements by category">
              <FaFilter className={styles.filterIcon} aria-hidden="true" />
              <div className={styles.filterButtons}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.filterButton} ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                  >
                    {CATEGORY_ICONS[cat] || <FaStar aria-hidden="true" />}
                    <span>{formatCategoryTitle(cat)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedCategory === "all" && groupedAchievements ? (
          <>
            {Object.entries(groupedAchievements).map(([category, achievements], catIndex) => (
              <div
                key={category}
                className={styles.categorySection}
                style={{ "--stagger-delay": (catIndex * 150) + "ms" } as React.CSSProperties}
              >
                <h3 className={styles.categoryTitle}>
                  <span
                    className={styles.categoryIcon}
                    style={{ "--category-color": CATEGORY_COLORS[category] } as React.CSSProperties}
                  >
                    {CATEGORY_ICONS[category] || <FaStar aria-hidden="true" />}
                  </span>
                  {formatCategoryTitle(category)}
                </h3>
                <div className={`${styles.masonryGrid} stagger-up`} role="list" aria-label={`${formatCategoryTitle(category)} achievements`}>
                  {achievements.map((achievement, index) => (
                    <AchievementCard
                      key={achievement.id}
                      ref={(el) => { cardRefs.current[catIndex * 100 + index] = el; }}
                      achievement={achievement}
                      isExpanded={expandedCards.has(achievement.id)}
                      onToggle={() => toggleExpand(achievement.id)}
                      onKeyDown={(e) => handleKeyDown(e, catIndex * 100 + index)}
                      index={catIndex * 100 + index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className={`${styles.masonryGrid} stagger-up`} role="list" aria-label={`${selectedCategory === "all" ? "All" : formatCategoryTitle(selectedCategory)} achievements`}>
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                achievement={achievement}
                isExpanded={expandedCards.has(achievement.id)}
                onToggle={() => toggleExpand(achievement.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                index={index}
              />
            ))}
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className={styles.noResults}>
            <FaFilter className={styles.noResultsIcon} aria-hidden="true" />
            <p>No achievements found in this category.</p>
            <button onClick={() => setSelectedCategory("all")} className={styles.clearFilterButton}>
              Show All Categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function formatCategoryTitle(category: string): string {
  return category
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface AchievementCardProps {
  achievement: Achievement;
  isExpanded: boolean;
  onToggle: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  index: number;
}

const AchievementCardComponent = memo(forwardRef<HTMLElement, AchievementCardProps>(function AchievementCard({
  achievement,
  isExpanded,
  onToggle,
  onKeyDown,
}: AchievementCardProps, ref) {
  const category = achievement.category || "other";
  const categoryColor = CATEGORY_COLORS[category] || "#6366F1";
  const categoryIcon = CATEGORY_ICONS[category] || <FaStar aria-hidden="true" />;

  const cardStyle = { "--category-color": categoryColor } as React.CSSProperties;

  return (
    <article
      ref={ref}
      className={`${styles.achievementCard} ${isExpanded ? "expanded" : ""}`}
      style={cardStyle}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? `Collapse ${achievement.title}` : `Expand ${achievement.title}`}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <div className={styles.cardIconWrapper}>
            {categoryIcon}
          </div>
          <div className={styles.cardMeta}>
            <h3 className={styles.cardTitle}>{achievement.title}</h3>
          </div>
        </div>

        <div className={styles.cardContent} role="region" aria-label={`${achievement.title} details`}>
          <p className={styles.cardDescription}>{achievement.description}</p>

          {achievement.date && (
            <div className={styles.cardDate}>
              <span className={styles.dateIcon} aria-hidden="true">📅</span>
              <span>{achievement.date}</span>
            </div>
          )}

          {achievement.url && (
            <a
              href={achievement.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt className={styles.linkIcon} aria-hidden="true" />
              View Details
            </a>
          )}
        </div>
      </div>

      <div className={styles.cardGlow} aria-hidden="true" />
    </article>
  );
}));

export const AchievementCard = AchievementCardComponent;