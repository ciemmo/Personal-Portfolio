"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback, useRef, KeyboardEvent } from "react";
import { useSkills, Skill } from "@/lib/skillData";
import { getSkillIcon } from "./skillIcons";
import styles from "./InteractiveSkills.module.css";
import useScrollAnimation from "@/hooks/useScrollAnimation";

// Memoized icon component using Devicon
const SkillIcon = React.memo(({ skillName }: { skillName: string }) => {
  const IconComponent = getSkillIcon(skillName);
  return <IconComponent size={28} className={styles.skillIcon} />;
});

// Category order for tabs - all 12 categories from Skill model
const CATEGORIES = [
  "Languages",
  "Frameworks",
  "DevOps and Cloud",
  "Developer Tools",
  "AI and Machine Learning",
  "Data Science",
  "Databases",
  "Mobile",
  "Testing",
  "UI/UX Design",
  "Architecture",
  "Other",
] as const;

type Category = typeof CATEGORIES[number];

// Map API categories to display categories (1:1 mapping for most)
const categoryMap: Record<string, Category> = {
  // Direct mappings (exact matches)
  "languages": "Languages",
  "frameworks": "Frameworks",
  "devops and cloud": "DevOps and Cloud",
  "developer tools": "Developer Tools",
  "ai and machine learning": "AI and Machine Learning",
  "data science": "Data Science",
  "databases": "Databases",
  "mobile": "Mobile",
  "testing": "Testing",
  "ui/ux design": "UI/UX Design",
  "architecture": "Architecture",
  "other": "Other",

  // Common variations/aliases
  "frontend": "Languages",
  "backend": "Languages",
  "database": "Databases",
  "react": "Frameworks",
  "vue": "Frameworks",
  "angular": "Frameworks",
  "nextjs": "Frameworks",
  "express": "Frameworks",
  "spring": "Frameworks",
  "django": "Frameworks",
  "laravel": "Frameworks",
  "devops": "DevOps and Cloud",
  "cloud": "DevOps and Cloud",
  "aws": "DevOps and Cloud",
  "azure": "DevOps and Cloud",
  "gcp": "DevOps and Cloud",
  "docker": "DevOps and Cloud",
  "kubernetes": "DevOps and Cloud",
  "ci/cd": "DevOps and Cloud",
  "tools": "Developer Tools",
  "vcs": "Developer Tools",
  "ide": "Developer Tools",
};

// Language keywords for fallback categorization
const LANGUAGE_KEYWORDS = [
  "javascript", "typescript", "python", "java", "c#", "c++", "html", "css", "sql",
  "mysql", "postgresql", "mongodb", "ruby", "php", "go", "rust", "swift", "kotlin"
];

const FRAMEWORK_KEYWORDS = [
  "react", "next.js", "vue", "angular", "express", "spring", "django", "laravel",
  "rails", "node.js", "flask", "fastapi"
];

const DEVOPS_KEYWORDS = [
  "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible",
  "jenkins", "github actions", "gitlab ci", "circleci"
];

const TOOL_KEYWORDS = [
  "git", "github", "gitlab", "vscode", "intellij", "vim", "jest", "cypress",
  "playwright", "eslint", "prettier", "webpack", "vite", "figma", "jira", "postman"
];

const AI_KEYWORDS = [
  "tensorflow", "pytorch", "keras", "scikit-learn", "hugging face", "openai",
  "anthropic", "langchain", "llm", "machine learning", "deep learning", "neural"
];

const DATA_SCIENCE_KEYWORDS = [
  "pandas", "numpy", "matplotlib", "seaborn", "jupyter", "tableau", "power bi",
  "data analysis", "data visualization", "statistics", "r language", "spark"
];

const DATABASE_KEYWORDS = [
  "postgresql", "mysql", "mongodb", "redis", "sqlite", "dynamodb", "cassandra",
  "elasticsearch", "neo4j", "firestore", "supabase", "prisma", "typeorm"
];

const MOBILE_KEYWORDS = [
  "react native", "flutter", "swift", "kotlin", "xamarin", "ionic", "capacitor",
  "android", "ios", "expo"
];

const TESTING_KEYWORDS = [
  "jest", "vitest", "cypress", "playwright", "selenium", "mocha", "chai",
  "testing library", "pytest", "junit", "testng", "k6"
];

const DESIGN_KEYWORDS = [
  "figma", "sketch", "adobe xd", "framer", "photoshop", "illustrator", "indesign",
  "ui design", "ux design", "user research", "prototyping", "design system"
];

const ARCHITECTURE_KEYWORDS = [
  "microservices", "serverless", "event driven", "domain driven", "clean architecture",
  "hexagonal", "cqrs", "event sourcing", "system design", "scalability"
];

// Helper to determine display category from skill
const getDisplayCategory = (skill: { category: string; name: string }): Category => {
  const apiCategory = skill.category.toLowerCase();
  if (categoryMap[apiCategory]) {
    return categoryMap[apiCategory];
  }

  const name = skill.name.toLowerCase();

  if (LANGUAGE_KEYWORDS.some(lang => name.includes(lang))) return "Languages";
  if (FRAMEWORK_KEYWORDS.some(fw => name.includes(fw))) return "Frameworks";
  if (DEVOPS_KEYWORDS.some(d => name.includes(d))) return "DevOps and Cloud";
  if (AI_KEYWORDS.some(k => name.includes(k))) return "AI and Machine Learning";
  if (DATA_SCIENCE_KEYWORDS.some(k => name.includes(k))) return "Data Science";
  if (DATABASE_KEYWORDS.some(k => name.includes(k))) return "Databases";
  if (MOBILE_KEYWORDS.some(k => name.includes(k))) return "Mobile";
  if (TESTING_KEYWORDS.some(k => name.includes(k))) return "Testing";
  if (DESIGN_KEYWORDS.some(k => name.includes(k))) return "UI/UX Design";
  if (ARCHITECTURE_KEYWORDS.some(k => name.includes(k))) return "Architecture";
  if (TOOL_KEYWORDS.some(t => name.includes(t))) return "Developer Tools";

  return "Other";
};

// Proficiency ring constants
const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getStrokeDashoffset = (proficiency: number) => {
  const percentages = [0, 0.33, 0.66, 1];
  const percentage = percentages[proficiency] ?? 0;
  return RING_CIRCUMFERENCE * (1 - percentage);
};

const PROFICIENCY_LABELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;
const PROFICIENCY_PERCENTAGES = ["0%", "33%", "66%", "100%"] as const;

// Shared state component for loading/error/empty states
function StateView({
  title,
  subtitle,
  icon,
  message,
  actionLabel,
  onAction
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className={`${styles.interactiveSkills} fade-up`} aria-labelledby="skills-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon} aria-hidden="true">{icon}</div>
          <h3 className={styles.emptyStateTitle}>{title}</h3>
          {message && <p className={styles.emptyStateText}>{message}</p>}
          {actionLabel && onAction && (
            <button className={styles.actionButton} onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// Proficiency Ring Component
function ProficiencyRing({ proficiency, size = "large" }: { proficiency: number; size?: "large" | "small" }) {
  const dimension = size === "large" ? 64 : 24;
  const strokeWidth = size === "large" ? 4 : 3;
  const radius = size === "large" ? 30 : 9;
  const textSize = size === "large" ? "0.875rem" : "0.625rem";
  const circumference = 2 * Math.PI * radius;
  const percentages = [0, 0.33, 0.66, 1];
  const percentage = percentages[proficiency] ?? 0;
  const offset = circumference * (1 - percentage);

  return (
    <div className={styles.proficiencyRing} style={{ width: dimension, height: dimension }} role="img" aria-label={`Proficiency: ${PROFICIENCY_LABELS[proficiency] ?? "Unknown"} (${PROFICIENCY_PERCENTAGES[proficiency] ?? "0%"})`}>
      <svg className={styles.proficiencyRingSvg} viewBox={`0 0 ${dimension} ${dimension}`} aria-hidden="true">
        <circle className={styles.proficiencyRingBg} cx={dimension / 2} cy={dimension / 2} r={radius} />
        <circle
          className={styles.proficiencyRingProgress}
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <span className={styles.proficiencyRingText} style={{ fontSize: textSize }}>
        {PROFICIENCY_PERCENTAGES[proficiency] ?? "0%"}
      </span>
    </div>
  );
}

// Legend Ring Component
function LegendRing({ level }: { level: 0 | 1 | 2 | 3 }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - [0, 0.33, 0.66, 1][level]);

  return (
    <div className={styles.legendRing} aria-hidden="true">
      <svg className={styles.legendRingSvg} viewBox="0 0 24 24">
        <circle className={styles.legendRingBg} cx="12" cy="12" r={radius} />
        <circle
          className={styles.legendRingProgress}
          cx="12"
          cy="12"
          r={radius}
          style={{ strokeDashoffset: offset }}
          data-level={level.toString()}
        />
      </svg>
    </div>
  );
}

// Loading Skeleton
function SkillSkeleton() {
  return (
    <div className={styles.skeletonCard} role="listitem" aria-hidden="true">
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonRing} />
      <div className={styles.skeletonCategory} />
    </div>
  );
}

export interface InteractiveSkill {
  _id: string;
  id?: string;
  name: string;
  category: string;
  proficiency: number; // 0-3
  description?: string;
  icon?: string;
  color?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface InteractiveSkillsProps {
  initialData?: InteractiveSkill[];
}

export default function InteractiveSkills({ initialData = [] }: InteractiveSkillsProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Languages");
  const [searchQuery, setSearchQuery] = useState("");
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Use initialData if provided, otherwise use the hook for client-side fetching
  const { skills: hookSkills, loading: hookLoading, error: hookError } = useSkills();
  const allSkills = initialData.length > 0 ? initialData : hookSkills;
  const loading = initialData.length > 0 ? false : hookLoading;
  const error = initialData.length > 0 ? null : hookError;

  const prefersReducedMotion = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // Scroll animation for section entrance
  useScrollAnimation();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches; };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Group skills by category using display category mapping
  const groupedSkills = useMemo((): Record<string, InteractiveSkill[]> => {
    if (!allSkills?.length) {
      return {
        Languages: [],
        Frameworks: [],
        "DevOps and Cloud": [],
        "Developer Tools": [],
        "AI and Machine Learning": [],
        "Data Science": [],
        Databases: [],
        Mobile: [],
        Testing: [],
        "UI/UX Design": [],
        Architecture: [],
        Other: [],
      };
    }

    const grouped: Record<string, InteractiveSkill[]> = {
      Languages: [],
      Frameworks: [],
      "DevOps and Cloud": [],
      "Developer Tools": [],
      "AI and Machine Learning": [],
      "Data Science": [],
      Databases: [],
      Mobile: [],
      Testing: [],
      "UI/UX Design": [],
      Architecture: [],
      Other: [],
    };

    allSkills.forEach(skill => {
      const displayCategory = getDisplayCategory(skill);
      grouped[displayCategory].push(skill);
    });

    Object.values(grouped).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));

    return grouped;
  }, [allSkills]);

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedSkills[selectedCategory] || [];
    }
    const query = searchQuery.toLowerCase().trim();
    return (groupedSkills[selectedCategory] || []).filter(skill =>
      skill.name.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query)
    );
  }, [groupedSkills, selectedCategory, searchQuery]);

  // Only show categories that have skills
  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter(cat => (groupedSkills[cat]?.length || 0) > 0);
  }, [groupedSkills]);

  // Ensure selectedCategory is valid (falls back to first visible category)
  useEffect(() => {
    if (visibleCategories.length > 0 && !visibleCategories.includes(selectedCategory)) {
      setSelectedCategory(visibleCategories[0]);
    }
  }, [visibleCategories, selectedCategory]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, index: number, skillId: string) => {
    const cards = cardRefs.current.filter((ref): ref is HTMLButtonElement => ref !== null);
    const maxIndex = cards.length - 1;

    switch (e.key) {
      case "ArrowRight": e.preventDefault(); setFocusedIndex(p => Math.min(p + 1, maxIndex)); cards[Math.min(index + 1, maxIndex)]?.focus(); break;
      case "ArrowLeft": e.preventDefault(); setFocusedIndex(p => Math.max(p - 1, 0)); cards[Math.max(index - 1, 0)]?.focus(); break;
      case "ArrowDown": e.preventDefault(); setFocusedIndex(p => Math.min(p + 3, maxIndex)); cards[Math.min(index + 3, maxIndex)]?.focus(); break;
      case "ArrowUp": e.preventDefault(); setFocusedIndex(p => Math.max(p - 3, 0)); cards[Math.max(index - 3, 0)]?.focus(); break;
      case "Home": e.preventDefault(); setFocusedIndex(0); cards[0]?.focus(); break;
      case "End": e.preventDefault(); setFocusedIndex(maxIndex); cards[maxIndex]?.focus(); break;
      case "Enter":
      case " ": e.preventDefault(); window.location.href = `/projects?skill=${encodeURIComponent(skillId)}`; break;
    }
  }, []);

  // Focus management for tab changes (only on user interaction, not initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setFocusedIndex(-1);
    setTimeout(() => {
      const firstCard = cardRefs.current[0];
      if (firstCard) { firstCard.focus(); setFocusedIndex(0); }
    }, 100);
  }, [selectedCategory, filteredSkills.length]);

  // Loading state
  if (loading || !isMounted) {
    return (
      <StateView
        title="Loading Skills..."
        subtitle="Explore my technical expertise across languages, frameworks, and tools"
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        )}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <StateView
        title="Error Loading Skills"
        subtitle="Unable to load skills data"
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
        message={`${error}. Please try again later or contact the administrator.`}
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  // Empty state (no skills at all)
  if (!allSkills?.length) {
    return (
      <StateView
        title="No Skills Found"
        subtitle="No skills data available yet"
        icon={(
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
            <line x1="6" y1="9" x2="18" y2="9"></line>
            <line x1="6" y1="13" x2="18" y2="13"></line>
            <line x1="10" y1="17" x2="14" y2="17"></line>
          </svg>
        )}
        message="Skills will appear here once data is loaded from the server."
      />
    );
  }

  // Search icon SVG
  const searchIcon = (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  // Empty search results icon
  const emptySearchIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  return (
    <section className={`${styles.interactiveSkills} fade-up`} aria-labelledby="skills-title">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
          <p className={styles.subtitle}>Explore my technical expertise across languages, frameworks, and tools</p>
        </header>

        {/* Search */}
        <div className={styles.searchWrapper} role="search" aria-label="Search skills">
          {searchIcon}
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search skills"
            aria-describedby="search-hint"
          />
          <span id="search-hint" className={styles.visuallyHidden}>
            Type to filter skills by name. Results update as you type.
          </span>
        </div>

        {/* Category Tabs */}
        {visibleCategories.length > 0 && (
          <div className={styles.tabsContainer} role="tablist" aria-label="Skill categories">
            {visibleCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                aria-controls={`panel-${cat}`}
                id={`tab-${cat}`}
                className={`${styles.tab} ${selectedCategory === cat ? styles.active : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span className={styles.tabCount}>
                  {groupedSkills[cat]?.length || 0}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        <div
          className={styles.skillsContainer}
          role="tabpanel"
          id={`panel-${selectedCategory}`}
          aria-labelledby={`tab-${selectedCategory}`}
        >
          {filteredSkills.length === 0 ? (
            <div className={styles.emptyState} role="status">
              <div className={styles.emptyStateIcon} aria-hidden="true">{emptySearchIcon}</div>
              <h3 className={styles.emptyStateTitle}>No Skills Match</h3>
              <p className={styles.emptyStateText}>
                No skills found matching "{searchQuery}" in {selectedCategory}.
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          ) : (
            <div className={styles.skillsGrid} role="list" aria-label={`${selectedCategory} skills`}>
              {filteredSkills.map((skill, index) => {
                const proficiencyLevel = skill.proficiency ?? 0;

                const cardRef = (node: HTMLButtonElement | null) => {
                  if (node) node.dataset.skillIndex = index.toString();
                  cardRefs.current[index] = node;
                };

                return (
                  <button
                    key={skill._id}
                    ref={cardRef}
                    className={styles.skillCard}
                    onKeyDown={(e) => handleKeyDown(e, index, skill._id)}
                    onFocus={() => setFocusedIndex(index)}
                    onClick={() => { window.location.href = `/projects?skill=${encodeURIComponent(skill.name)}`; }}
                    tabIndex={0}
                    data-skill-index={index}
                    aria-label={`${skill.name}, ${PROFICIENCY_LABELS[proficiencyLevel] ?? "Unknown"} proficiency. Press Enter to view related projects.`}
                  >
                    <div className={styles.skillCardInner}>
                      <div className={styles.skillIconWrapper}>
                        <SkillIcon skillName={skill.name} />
                      </div>
                      <div className={styles.skillContent}>
                        <h3 className={styles.skillName}>{skill.name}</h3>
                        <ProficiencyRing proficiency={proficiencyLevel} />
                        <div className={styles.skillMeta}>
                          <span className={styles.skillCategory}>{getDisplayCategory(skill)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Proficiency Legend */}
        <div className={styles.legend} aria-labelledby="legend-title">
          <h3 id="legend-title" className={styles.legendTitle}>Proficiency Levels</h3>
          <div className={styles.legendItems}>
            {([0, 1, 2, 3] as const).map((level) => (
              <div key={level} className={styles.legendItem} data-level={level.toString()}>
                <LegendRing level={level} />
                <span>{PROFICIENCY_LABELS[level]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <a href="/projects" className={styles.actionButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>View Projects with Skill Filtering</span>
        </a>
      </div>
    </section>
  );
}