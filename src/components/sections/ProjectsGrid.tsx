"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import styles from "./ProjectsGrid.module.css";
import ProjectCard from "@/components/projects/ProjectCard";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface Project {
  slug: string;
  title: string;
  description: string;
  demo?: string;
  github?: string;
  image?: string;
  techStack?: string[];
  featured?: boolean;
  category?: string;
}

interface ProjectsGridProps {
  projects?: Project[];
  limit?: number;
}

export default function ProjectsGrid({ projects: providedProjects, limit = 6 }: ProjectsGridProps) {
  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Scroll animation for section entrance
  useScrollAnimation();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Fetch projects data
  useEffect(() => {
    if (providedProjects && providedProjects.length > 0) {
      setFetchedProjects(providedProjects);
      setIsLoading(false);
    } else {
      async function load() {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/projects");
          if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
          const data = await res.json();
          setFetchedProjects(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching projects:", err);
          setError("Failed to load projects. Please try again later.");
          setIsLoading(false);
        }
      }
      load();
    }
  }, [providedProjects]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  }, []);

  const displayProjects = useMemo(() => {
    const projects = providedProjects && providedProjects.length > 0 ? providedProjects : fetchedProjects;
    return projects.slice(0, limit);
  }, [providedProjects, fetchedProjects, limit]);

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
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 3, maxIndex));
        cards[Math.min(index + 3, maxIndex)]?.focus();
        break;
      case "ArrowUp":
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
    }
  }, []);

  if (isLoading && displayProjects.length === 0) {
    return (
      <section className={`${styles.projects} ${styles.fadeUp} fade-up`} aria-labelledby="projects-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="projects">💻</span>
              Projects
            </span>
            <h2 id="projects-title" className={styles.title}>
              Featured Work
            </h2>
            <p className={styles.subtitle}>
              Some of the work I've built
            </p>
          </div>

          <div className={styles.grid} role="list" aria-label="Projects grid">
            {[1, 2, 3].map((i) => (
              <article key={i} className={styles.skeletonCard} role="listitem" aria-hidden="true">
                <div className={styles.skeletonCardInner}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonCategory} />
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonTitle} style={{ width: "70%" }} />
                    <div className={styles.skeletonDescription} />
                    <div className={styles.skeletonDescription} style={{ width: "60%" }} />
                    <div className={styles.skeletonDescription} style={{ width: "40%" }} />
                    <div className={styles.skeletonTechStack} />
                    <div className={styles.skeletonActions} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${styles.projects} ${styles.fadeUp} fade-up`} aria-labelledby="projects-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="projects">💻</span>
              Projects
            </span>
            <h2 id="projects-title" className={styles.title}>
              Featured Work
            </h2>
            <p className={styles.subtitle}>
              Some of the work I've built
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

  if (displayProjects.length === 0) {
    return (
      <section className={`${styles.projects} ${styles.fadeUp} fade-up`} aria-labelledby="projects-title">
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.sectionLabel}>
              <span className={styles.sectionLabelIcon} role="img" aria-label="projects">💻</span>
              Projects
            </span>
            <h2 id="projects-title" className={styles.title}>
              Featured Work
            </h2>
            <p className={styles.subtitle}>
              Some of the work I've built
            </p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <div className={styles.emptyStateBadge}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                  <path d="M8 21h8"></path>
                  <path d="M12 17v4"></path>
                  <line x1="6" y1="9" x2="18" y2="9"></line>
                  <line x1="6" y1="13" x2="18" y2="13"></line>
                  <line x1="10" y1="17" x2="14" y2="17"></line>
                </svg>
              </div>
            </div>
            <p className={styles.emptyStateText}>
              No projects to display yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.projects} ${styles.fadeUp} fade-up`} aria-labelledby="projects-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>
            <span className={styles.sectionLabelIcon} role="img" aria-label="projects">💻</span>
            Projects
          </span>
          <h2 id="projects-title" className={styles.title}>
            Featured Work
          </h2>
          <p className={styles.subtitle}>
            Some of the work I've built
          </p>
        </div>

        <div className={`${styles.grid} ${styles.staggerUp}`} role="list" aria-label="Projects grid">
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              ref={(el) => { cardRefs.current[index] = el; }}
              project={project}
              onKeyDown={(e) => handleKeyDown(e, index)}
              index={index}
              isFeatured={project.featured}
              style={{ "--stagger-delay": (Math.min(index * 80, 400)) + "ms" } as React.CSSProperties}
            />
          ))}
        </div>

        {(fetchedProjects.length > limit || (providedProjects && providedProjects.length > limit)) && (
          <div className={styles.viewAll}>
            <a href="/projects" className={styles.viewAllButton}>
              View All Projects
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}