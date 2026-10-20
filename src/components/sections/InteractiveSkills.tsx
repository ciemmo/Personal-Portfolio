"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useCallback, useRef, KeyboardEvent, MouseEvent } from "react";
import { useSkills, Skill } from "@/lib/skillData";
import {
  FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaPython, FaJava,
  FaDatabase, FaGitAlt, FaLinux, FaAndroid, FaFigma, FaCloud, FaCode
} from "react-icons/fa";
import {
  SiTypescript, SiMongodb, SiExpress, SiDocker, SiKubernetes, SiSpring,
  SiDotnet, SiRubyonrails, SiLaravel, SiWordpress, SiShopify, SiFigma
} from "react-icons/si";
import { TbBrandNextjs, TbBrandCSharp, TbBrandCpp } from "react-icons/tb";
import styles from "./InteractiveSkills.module.css";

// Skill to icon mapping
const skillIcons = {
  // Programming Languages
  "JavaScript": FaJsSquare,
  "TypeScript": SiTypescript,
  "Python": FaPython,
  "Java": FaJava,
  "C#": TbBrandCSharp,
  "C++": TbBrandCpp,
  "HTML": FaHtml5,
  "CSS": FaCss3Alt,
  "SQL": FaDatabase,

  // Frameworks & Libraries
  "React": FaReact,
  "Next.js": TbBrandNextjs,
  "Node.js": FaNodeJs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Spring": SiSpring,
  ".NET": SiDotnet,
  "Ruby on Rails": SiRubyonrails,
  "Laravel": SiLaravel,
  "WordPress": SiWordpress,
  "Shopify": SiShopify,

  // Tools & Platforms
  "Git": FaGitAlt,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "Linux": FaLinux,
  "Android": FaAndroid,
  "Figma": SiFigma,
  "AWS": FaCloud,
};

// Helper function to get icon component for a skill
const getSkillIcon = (skillName: string) => {
  const IconComponent = skillIcons[skillName as keyof typeof skillIcons];
  if (IconComponent) {
    if (typeof IconComponent === 'function' && IconComponent.name === '') {
      return <IconComponent size={28} className={styles.skillIcon} />;
    }
    return <IconComponent size={28} className={styles.skillIcon} />;
  }
  return <FaCode size={28} className={styles.skillIcon} />;
};

// Category order for tabs
const CATEGORIES = [
  "Languages",
  "Frameworks",
  "DevOps and Cloud",
  "Developer Tools",
] as const;

type Category = typeof CATEGORIES[number];

// Map API categories to display categories
const categoryMap: Record<string, Category> = {
  // Languages
  "frontend": "Languages",
  "backend": "Languages",
  "database": "Languages",

  // Frameworks
  "react": "Frameworks",
  "vue": "Frameworks",
  "angular": "Frameworks",
  "nextjs": "Frameworks",
  "express": "Frameworks",
  "spring": "Frameworks",
  "django": "Frameworks",
  "laravel": "Frameworks",

  // DevOps and Cloud
  "devops": "DevOps and Cloud",
  "cloud": "DevOps and Cloud",
  "aws": "DevOps and Cloud",
  "azure": "DevOps and Cloud",
  "gcp": "DevOps and Cloud",
  "docker": "DevOps and Cloud",
  "kubernetes": "DevOps and Cloud",
  "ci/cd": "DevOps and Cloud",

  // Developer Tools
  "tools": "Developer Tools",
  "testing": "Developer Tools",
  "vcs": "Developer Tools",
  "ide": "Developer Tools",
  "other": "Developer Tools",
};

// Helper to determine display category from skill
const getDisplayCategory = (skill: Skill): Category => {
  // First try exact category match
  const apiCategory = skill.category.toLowerCase();
  if (categoryMap[apiCategory]) {
    return categoryMap[apiCategory];
  }

  // Fallback: determine by skill name
  const name = skill.name.toLowerCase();

  // Languages
  const languages = ["javascript", "typescript", "python", "java", "c#", "c++", "html", "css", "sql", "mysql", "postgresql", "mongodb", "ruby", "php", "go", "rust", "swift", "kotlin"];
  if (languages.some(lang => name.includes(lang))) {
    return "Languages";
  }

  // Frameworks
  const frameworks = ["react", "next.js", "vue", "angular", "express", "spring", "django", "laravel", "rails", "node.js", "flask", "fastapi"];
  if (frameworks.some(fw => name.includes(fw))) {
    return "Frameworks";
  }

  // DevOps and Cloud
  const devops = ["docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "circleci"];
  if (devops.some(d => name.includes(d))) {
    return "DevOps and Cloud";
  }

  // Developer Tools
  const tools = ["git", "github", "gitlab", "vscode", "intellij", "vim", "jest", "cypress", "playwright", "eslint", "prettier", "webpack", "vite", "figma", "jira", "postman"];
  if (tools.some(t => name.includes(t))) {
    return "Developer Tools";
  }

  // Default
  return "Developer Tools";
};

// Calculate stroke-dashoffset for proficiency ring
// Radius = 30, circumference = 2 * PI * 30 = 188.5
const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const getStrokeDashoffset = (proficiency: number) => {
  // proficiency: 0-3 (Beginner to Expert)
  // Map to percentage: 0, 33, 66, 100
  const percentages = [0, 0.33, 0.66, 1];
  const percentage = percentages[proficiency] ?? 0;
  return RING_CIRCUMFERENCE * (1 - percentage);
};

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function InteractiveSkills() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Languages");
  const [searchQuery, setSearchQuery] = useState("");
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tiltStates, setTiltStates] = useState<Record<string, { x: number; y: number }>>({});
  const { skills: allSkills, loading, error } = useSkills();
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

  // Group skills by category using display category mapping
  const groupedSkills = useMemo((): Record<string, Skill[]> => {
    if (!allSkills || allSkills.length === 0) {
      return {
        Languages: [],
        Frameworks: [],
        "DevOps and Cloud": [],
        "Developer Tools": [],
      };
    }

    const grouped: Record<string, Skill[]> = {
      Languages: [],
      Frameworks: [],
      "DevOps and Cloud": [],
      "Developer Tools": [],
    };

    allSkills.forEach(skill => {
      const displayCategory = getDisplayCategory(skill);
      grouped[displayCategory].push(skill);
    });

    Object.keys(grouped).forEach(category => {
      (grouped[category as keyof typeof grouped] as Skill[]).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

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

  // Debounced search for better performance
  const debouncedSearch = useDebounce(searchQuery, 150);

  // Handle mouse move for tilt effect
  const handleMouseMove = useCallback((e: MouseEvent<HTMLButtonElement>, skillId: string) => {
    if (prefersReducedMotion.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt: max 5 degrees
    const maxTilt = 5;
    const tiltX = ((y - centerY) / centerY) * maxTilt * -1; // Invert Y
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setTiltStates(prev => ({
      ...prev,
      [skillId]: { x: tiltX, y: tiltY }
    }));
  }, []);

  const handleMouseLeave = useCallback((_e: MouseEvent<HTMLButtonElement>, skillId: string) => {
    setTiltStates(prev => {
      const next = { ...prev };
      delete next[skillId];
      return next;
    });
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, index: number, skillId: string) => {
    const cards = cardRefs.current.filter((ref): ref is HTMLButtonElement => ref !== null);
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
        // Move to next row (approximate - 3 columns)
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
        // Could open a detail modal or navigate to projects filtered by this skill
        e.preventDefault();
        window.location.href = `/projects?skill=${encodeURIComponent(skillId)}`;
        break;
    }
  }, [cardRefs]);

  // Focus management for tab changes
  useEffect(() => {
    setFocusedIndex(-1);
    // Focus first card when category changes
    setTimeout(() => {
      const firstCard = cardRefs[0];
      if (firstCard) {
        firstCard.focus();
        setFocusedIndex(0);
      }
    }, 100);
  }, [selectedCategory, filteredSkills.length]);

  // Loading state
  if (loading) {
    return (
      <section className={styles.interactiveSkills} aria-labelledby="skills-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
            <p className={styles.subtitle}>Explore my technical expertise across languages, frameworks, and tools</p>
          </div>
          <div className={styles.searchWrapper} role="search" aria-label="Search skills">
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search skills..."
              aria-label="Search skills"
              disabled
            />
          </div>
          <div className={styles.tabsContainer} role="tablist" aria-label="Skill categories">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                aria-controls={`panel-${cat}`}
                id={`tab-${cat}`}
                className={`${styles.tab} ${selectedCategory === cat ? styles.active : ""}`}
                onClick={() => setSelectedCategory(cat)}
                disabled
              >
                {cat}
                <span className={styles.tabCount}>{(groupedSkills[cat] || []).length}</span>
              </button>
            ))}
          </div>
          <div className={styles.skillsContainer} role="tabpanel" id={`panel-${selectedCategory}`} aria-labelledby={`tab-${selectedCategory}`}>
            <div className={styles.skillsGrid} role="list" aria-label={`${selectedCategory} skills`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={styles.skeletonCard} role="listitem">
                  <div className={styles.skeletonIcon} aria-hidden="true" />
                  <div className={styles.skeletonTitle} aria-hidden="true" />
                  <div className={styles.skeletonRing} aria-hidden="true" />
                  <div className={styles.skeletonCategory} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.interactiveSkills} aria-labelledby="skills-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
            <p className={styles.subtitle}>Unable to load skills data</p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Error Loading Skills</h3>
            <p className={styles.emptyStateText}>
              {error}. Please try again later or contact the administrator.
            </p>
            <button
              className={styles.actionButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!allSkills || allSkills.length === 0) {
    return (
      <section className={styles.interactiveSkills} aria-labelledby="skills-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
            <p className={styles.subtitle}>No skills data available yet</p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
                <line x1="6" y1="9" x2="18" y2="9"></line>
                <line x1="6" y1="13" x2="18" y2="13"></line>
                <line x1="10" y1="17" x2="14" y2="17"></line>
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>No Skills Found</h3>
            <p className={styles.emptyStateText}>
              Skills will appear here once data is loaded from the server.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Render proficiency ring SVG
  const renderProficiencyRing = (proficiency: number, size: "large" | "small" = "large") => {
    const offset = getStrokeDashoffset(proficiency);
    const dimension = size === "large" ? 64 : 24;
    const strokeWidth = size === "large" ? 4 : 3;
    const radius = size === "large" ? 30 : 9;
    const circumference = 2 * Math.PI * radius;
    const textSize = size === "large" ? "0.875rem" : "0.625rem";

    const percentages = ["0%", "33%", "66%", "100%"];
    const labels = ["Beginner", "Intermediate", "Advanced", "Expert"];

    return (
      <div className={styles.proficiencyRing} style={{ width: dimension, height: dimension }} role="img" aria-label={`Proficiency: ${labels[proficiency] ?? "Unknown"} (${percentages[proficiency] ?? "0%"})`}>
        <svg className={styles.proficiencyRingSvg} viewBox={`0 0 ${dimension} ${dimension}`} aria-hidden="true">
          <circle
            className={styles.proficiencyRingBg}
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
          />
          <circle
            className={styles.proficiencyRingProgress}
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            style={{
              strokeDashoffset: offset,
              transition: prefersReducedMotion.current ? "none" : `stroke-dashoffset 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)`
            }}
          />
        </svg>
        <span className={styles.proficiencyRingText} style={{ fontSize: textSize }}>
          {percentages[proficiency] ?? "0%"}
        </span>
      </div>
    );
  };

  // Render legend ring SVG
  const renderLegendRing = (level: 0 | 1 | 2 | 3) => {
    const radius = 9;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - [0, 0.33, 0.66, 1][level]);

    return (
      <div className={styles.legendRing} aria-hidden="true">
        <svg className={styles.legendRingSvg} viewBox="0 0 24 24">
          <circle
            className={styles.legendRingBg}
            cx="12"
            cy="12"
            r={radius}
          />
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
  };

  return (
    <section className={styles.interactiveSkills} aria-labelledby="skills-title">
      {/* Subtle background orbs */}
      <div className={styles.backgroundOrbs} aria-hidden="true">
        <div className={styles.bgOrb} style={{ top: "10%", left: "5%" }} />
        <div className={styles.bgOrb} style={{ top: "20%", right: "5%" }} />
        <div className={styles.bgOrb} style={{ bottom: "15%", left: "10%" }} />
        <div className={styles.bgOrb} style={{ bottom: "10%", right: "10%" }} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h2 id="skills-title" className={styles.title}>Technical Skills</h2>
          <p className={styles.subtitle}>Explore my technical expertise across languages, frameworks, and tools</p>
        </header>

        {/* Search */}
        <div className={styles.searchWrapper} role="search" aria-label="Search skills">
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
        <div className={styles.tabsContainer} role="tablist" aria-label="Skill categories">
          {CATEGORIES.map((cat) => (
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
                {(filteredSkills.filter(s => s.category === cat)).length || (groupedSkills[cat] || []).length}
              </span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div
          className={styles.skillsContainer}
          role="tabpanel"
          id={`panel-${selectedCategory}`}
          aria-labelledby={`tab-${selectedCategory}`}
        >
          {filteredSkills.length === 0 ? (
            <div className={styles.emptyState} role="status">
              <div className={styles.emptyStateIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className={styles.emptyStateTitle}>No Skills Match</h3>
              <p className={styles.emptyStateText}>
                No skills found matching "{debouncedSearch}" in {selectedCategory}.
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          ) : (
            <div
              className={styles.skillsGrid}
              role="list"
              aria-label={`${selectedCategory} skills`}
            >
              {filteredSkills.map((skill, index) => {
                const proficiencyLevel = skill.proficiency ?? 0;
                const skillId = `${selectedCategory}-${skill._id}-${index}`;
                const tilt = tiltStates[skillId] || { x: 0, y: 0 };

                // Ref callback - store in ref array (not state) to avoid re-renders
                const cardRef = (node: HTMLButtonElement | null) => {
                  if (node) {
                    node.dataset.skillIndex = index.toString();
                  }
                  cardRefs.current[index] = node;
                };

                return (
                  <button
                    key={skillId}
                    ref={cardRef}
                    className={styles.skillCard}
                    onMouseMove={(e) => handleMouseMove(e, skillId)}
                    onMouseLeave={(e) => handleMouseLeave(e, skillId)}
                    onKeyDown={(e) => handleKeyDown(e, index, skill._id)}
                    onFocus={() => setFocusedIndex(index)}
                    onClick={() => {
                      window.location.href = `/projects?skill=${encodeURIComponent(skill.name)}`;
                    }}
                    style={{
                      transform: prefersReducedMotion.current
                        ? undefined
                        : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    }}
                    tabIndex={0}
                    data-skill-index={index}
                    aria-label={`${skill.name}, ${["Beginner", "Intermediate", "Advanced", "Expert"][proficiencyLevel] ?? "Unknown"} proficiency. Press Enter to view related projects.`}
                  >
                    <div className={styles.skillCardInner} style={{
                      transform: prefersReducedMotion.current
                        ? undefined
                        : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    }}>
                      <div className={styles.skillIconWrapper}>
                        {getSkillIcon(skill.name)}
                      </div>
                      <div className={styles.skillContent}>
                        <h3 className={styles.skillName}>{skill.name}</h3>
                        {renderProficiencyRing(proficiencyLevel)}
                        <div className={styles.skillMeta}>
                          <span className={styles.skillCategory}>{skill.category}</span>
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
              <div
                key={level}
                className={styles.legendItem}
                data-level={level.toString()}
              >
                {renderLegendRing(level)}
                <span>{["Beginner", "Intermediate", "Advanced", "Expert"][level]}</span>
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