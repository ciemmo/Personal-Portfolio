"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import styles from "./ProjectPage.module.css";
import { FaChevronDown, FaTimes, FaFilter, FaSearch } from "react-icons/fa";
import useScrollAnimation from "@/hooks/useScrollAnimation";

interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  skillRoles: string[];
  github?: string;
  demo?: string;
  image?: string;
  _id?: string;
  createdAt?: string;
  featured?: boolean;
  category?: string;
}

interface ProjectsPageClientProps {
  initialProjects?: Project[];
}

const ITEMS_PER_PAGE = 12;

export default function ProjectsPageClient({ initialProjects = [] }: ProjectsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(() =>
    searchParams.get("search") || ""
  );
  const [selectedTech, setSelectedTech] = useState(() =>
    searchParams.get("tech")?.split(",").filter(Boolean) || []
  );
  const [selectedSkills, setSelectedSkills] = useState(() =>
    searchParams.get("skills")?.split(",").filter(Boolean) || []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Scroll animations for section entrance
  useScrollAnimation();

  // Fetch projects only if no initial data provided (fallback/refresh)
  useEffect(() => {
    if (initialProjects.length > 0) {
      // Sort initial data by featured first, then by creation date
      const sorted = [...initialProjects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setProjects(sorted);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/projects", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();

        // Sort by featured first, then by creation date
        data.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialProjects]);

  // Update URL when filters change (debounced)
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTech.length > 0) params.set("tech", selectedTech.join(","));
    if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchQuery, selectedTech, selectedSkills, router, pathname]);

  useEffect(() => {
    const timer = setTimeout(updateURL, 300);
    return () => clearTimeout(timer);
  }, [updateURL]);

  // Extract unique tech and skills from projects
  const allTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(p => p.tech.forEach(t => techSet.add(t)));
    return Array.from(techSet).sort();
  }, [projects]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    projects.forEach(p => (p.skillRoles || []).forEach(s => skillSet.add(s)));
    return Array.from(skillSet).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.skillRoles || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const techMatches = selectedTech.length === 0 ||
        selectedTech.every(t => project.tech.includes(t));

      const skillMatches = selectedSkills.length === 0 ||
        selectedSkills.some(s => (project.skillRoles || []).includes(s));

      return matchesSearch && techMatches && skillMatches;
    });
  }, [projects, searchQuery, selectedTech, selectedSkills]);

  // Paginated projects
  const displayedProjects = filteredProjects.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProjects.length;

  const loadMore = useCallback(() => {
    setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProjects.length));
  }, [filteredProjects.length]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTech([]);
    setSelectedSkills([]);
    setDisplayedCount(ITEMS_PER_PAGE);
  }, []);

  const toggleTech = useCallback((tech: string) => {
    setSelectedTech(prev => prev.includes(tech)
      ? prev.filter(t => t !== tech)
      : [...prev, tech]
    );
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setSelectedSkills(prev => prev.includes(skill)
      ? prev.filter(s => s !== skill)
      : [...prev, skill]
    );
  }, []);

  const removeFilterChip = useCallback((type: "tech" | "skill" | "search", value: string) => {
    if (type === "search") {
      setSearchQuery("");
    } else if (type === "tech") {
      setSelectedTech(prev => prev.filter(t => t !== value));
    } else {
      setSelectedSkills(prev => prev.filter(s => s !== value));
    }
    setDisplayedCount(ITEMS_PER_PAGE);
  }, []);

  // Close filter panel when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth < 1024 && isFilterOpen && filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedTech, selectedSkills]);

  // Loading state
  if (isLoading) {
    return (
      <section className={`${styles.projectsPage} fade-up`} aria-labelledby="projects-title">
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 id="projects-title" className={styles.title}>Projects</h1>
              <p className={styles.subtitle}>Loading your projects...</p>
            </div>
          </header>

          <div className={styles.grid} role="list" aria-label="Projects grid">
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} style={{ "--stagger-delay": (i * 80) + "ms" } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={`${styles.projectsPage} fade-up`} aria-labelledby="projects-title">
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 id="projects-title" className={styles.title}>Projects</h1>
              <p className={styles.subtitle}>Explore my work across different technologies and domains</p>
            </div>
          </header>
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const activeFilterCount = selectedTech.length + selectedSkills.length + (searchQuery ? 1 : 0);

  return (
    <section className={`${styles.projectsPage} fade-up`} aria-labelledby="projects-title">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 id="projects-title" className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>Explore my work across different technologies and domains</p>
          </div>

          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search projects by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setDisplayedCount(ITEMS_PER_PAGE); }}
              aria-label="Search projects"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => { setSearchQuery(""); setDisplayedCount(ITEMS_PER_PAGE); }}
                aria-label="Clear search"
              >
                <FaTimes aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter Trigger (Mobile) */}
          <button
            className={styles.filterTrigger}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label={isFilterOpen ? "Close filters" : "Open filters"}
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <FaFilter className={styles.filterIcon} aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>
        </header>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className={styles.activeFilters} role="status" aria-live="polite" aria-label="Active filters">
            <>
              {searchQuery && (
                <span className={styles.filterChip}>
                  <span>Search: "{searchQuery}"</span>
                  <button onClick={() => removeFilterChip("search", "")} aria-label="Remove search filter">
                    <FaTimes aria-hidden="true" />
                  </button>
                </span>
              )}
              {selectedTech.map(tech => (
                <span key={tech} className={styles.filterChip}>
                  <span>{tech}</span>
                  <button onClick={() => removeFilterChip("tech", tech)} aria-label={`Remove ${tech} filter`}>
                    <FaTimes aria-hidden="true" />
                  </button>
                </span>
              ))}
              {selectedSkills.map(skill => (
                <span key={skill} className={styles.filterChip}>
                  <span>{skill}</span>
                  <button onClick={() => removeFilterChip("skill", skill)} aria-label={`Remove ${skill} filter`}>
                    <FaTimes aria-hidden="true" />
                  </button>
                </span>
              ))}
              {activeFilterCount > 1 && (
                <button className={styles.clearAllChips} onClick={clearFilters}>
                  Clear all
                  <FaTimes aria-hidden="true" />
                </button>
              )}
            </>
          </div>
        )}

        {/* Desktop Sidebar + Grid Layout */}
        <div className={styles.mainLayout}>
          {/* Filter Sidebar (Desktop) */}
          <aside
            ref={filterPanelRef}
            id="filter-panel"
            className={`${styles.filterSidebar} ${isFilterOpen ? "open" : ""}`}
            aria-label="Filter projects"
          >
            <div className={styles.filterSidebarHeader}>
              <h2 className={styles.filterSidebarTitle}>Filters</h2>
              <button
                className={styles.filterSidebarClose}
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <div className={styles.filterSidebarContent}>
              {/* Technology Filters */}
              {allTech.length > 0 && (
                <fieldset className={styles.filterSection}>
                  <legend className={styles.filterSectionTitle}>
                    <FaFilter aria-hidden="true" />
                    Technology
                  </legend>
                  <div className={styles.filterOptions}>
                    {allTech.map(tech => {
                      const count = projects.filter(p => p.tech.includes(tech)).length;
                      return (
                        <label key={tech} className={styles.filterOption}>
                          <input
                            type="checkbox"
                            checked={selectedTech.includes(tech)}
                            onChange={() => { toggleTech(tech); setDisplayedCount(ITEMS_PER_PAGE); }}
                            className={styles.filterCheckbox}
                          />
                          <span className={styles.filterOptionLabel}>{tech}</span>
                          <span className={styles.filterOptionCount}>{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* Skill Role Filters */}
              {allSkills.length > 0 && (
                <fieldset className={styles.filterSection}>
                  <legend className={styles.filterSectionTitle}>
                    <FaChevronDown aria-hidden="true" />
                    Skill Role
                  </legend>
                  <div className={styles.filterOptions}>
                    {allSkills.map(skill => {
                      const count = projects.filter(p => (p.skillRoles || []).includes(skill)).length;
                      return (
                        <label key={skill} className={styles.filterOption}>
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => { toggleSkill(skill); setDisplayedCount(ITEMS_PER_PAGE); }}
                            className={styles.filterCheckbox}
                          />
                          <span className={styles.filterOptionLabel}>{skill}</span>
                          <span className={styles.filterOptionCount}>{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {activeFilterCount > 0 && (
                <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Results Panel */}
          <div className={styles.resultsPanel}>
            {/* Results Header */}
            <div className={styles.resultsHeader}>
              <div className={styles.resultsCount}>
                <span className={styles.countNumber}>{filteredProjects.length}</span>
                <span className={styles.countLabel}>
                  {filteredProjects.length === 1 ? "project" : "projects"} found
                </span>
              </div>
              {activeFilterCount > 0 && (
                <button className={styles.clearFiltersMobile} onClick={clearFilters}>
                  <FaTimes aria-hidden="true" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <>
                <div
                  ref={resultsRef}
                  className={`${styles.grid} stagger-up`}
                  role="list"
                  aria-label="Projects grid"
                >
                  {displayedProjects.map((project, index) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      isFeatured={project.featured}
                      style={{ "--stagger-delay": (Math.min(index * 60, 400)) + "ms" } as React.CSSProperties}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      className={styles.loadMoreBtn}
                      onClick={loadMore}
                      aria-label={`Load ${Math.min(ITEMS_PER_PAGE, filteredProjects.length - displayedCount)} more projects`}
                    >
                      <span>Load More</span>
                      <span className={styles.loadMoreCount}>
                        ({displayedProjects.length} / {filteredProjects.length})
                      </span>
                    </button>
                  </div>
                )}

              </>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <div className={styles.emptyStateBadge}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
                <h2 className={styles.emptyStateTitle}>No Projects Found</h2>
                <p className={styles.emptyStateDescription}>
                  No projects match your current search and filter criteria.
                </p>
                <p className={styles.emptyStateSuggestion}>
                  Try adjusting your search terms or selecting different filters.
                </p>
                {activeFilterCount > 0 && (
                  <button className={styles.emptyStateClearBtn} onClick={clearFilters}>
                    <FaTimes aria-hidden="true" />
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterOpen && window.innerWidth < 1024 && (
          <div className={styles.mobileModalOverlay} onClick={() => setIsFilterOpen(false)} aria-hidden="true">
            <aside
              ref={filterPanelRef}
              className={`${styles.filterSidebar} ${styles.mobileModal}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filter-title"
            >
              <div className={styles.filterSidebarHeader}>
                <h2 id="mobile-filter-title" className={styles.filterSidebarTitle}>Filters</h2>
                <button
                  className={styles.filterSidebarClose}
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close filters"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>
              <div className={styles.filterSidebarContent}>
                {allTech.length > 0 && (
                  <fieldset className={styles.filterSection}>
                    <legend className={styles.filterSectionTitle}>
                      <FaFilter aria-hidden="true" />
                      Technology
                    </legend>
                    <div className={styles.filterOptions}>
                      {allTech.map(tech => {
                        const count = projects.filter(p => p.tech.includes(tech)).length;
                        return (
                          <label key={tech} className={styles.filterOption}>
                            <input
                              type="checkbox"
                              checked={selectedTech.includes(tech)}
                              onChange={() => { toggleTech(tech); setDisplayedCount(ITEMS_PER_PAGE); }}
                              className={styles.filterCheckbox}
                            />
                            <span className={styles.filterOptionLabel}>{tech}</span>
                            <span className={styles.filterOptionCount}>{count}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {allSkills.length > 0 && (
                  <fieldset className={styles.filterSection}>
                    <legend className={styles.filterSectionTitle}>
                      <FaChevronDown aria-hidden="true" />
                      Skill Role
                    </legend>
                    <div className={styles.filterOptions}>
                      {allSkills.map(skill => {
                        const count = projects.filter(p => (p.skillRoles || []).includes(skill)).length;
                        return (
                          <label key={skill} className={styles.filterOption}>
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(skill)}
                              onChange={() => { toggleSkill(skill); setDisplayedCount(ITEMS_PER_PAGE); }}
                              className={styles.filterCheckbox}
                            />
                            <span className={styles.filterOptionLabel}>{skill}</span>
                            <span className={styles.filterOptionCount}>{count}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {activeFilterCount > 0 && (
                  <button className={styles.clearFiltersBtn} onClick={() => { clearFilters(); setIsFilterOpen(false); }}>
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}