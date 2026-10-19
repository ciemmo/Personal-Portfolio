"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import ProjectCard from "@/components/projects/ProjectCard";
import { skillRolesByTech, skillIcons } from "@/data/skillRoles";

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
  createdAt?: Date;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTechFilters, setSelectedTechFilters] = useState<Set<string>>(new Set());
  const [selectedSkillFilters, setSelectedSkillFilters] = useState<Set<string>>(new Set());
  const [allTech, setAllTech] = useState<string[]>([]);
  const [allSkillRoles, setAllSkillRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch projects and extract unique technologies
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/projects", {
          cache: "force-cache"
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();

        // Extract all unique technologies and skill roles
        const techSet = new Set<string>();
        const skillRolesSet = new Set<string>();
        data.forEach((p: Project) => {
          p.tech.forEach(tech => techSet.add(tech));
          (p.skillRoles || []).forEach(role => skillRolesSet.add(role));
        });

        setProjects(data);
        setAllTech(Array.from(techSet).sort());
        setAllSkillRoles(Array.from(skillRolesSet).sort());
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects based on search query, selected technologies, and skill roles
  const filteredProjects = projects.filter(project => {
    // Text search (title, description)
    const matchesSearch =
      searchQuery.trim() === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Check tech filters
    const techMatches = selectedTechFilters.size === 0
      || [...selectedTechFilters].every(tech =>
        project.tech.includes(tech)
      );

    // Check skill role filters
    const skillMatches = selectedSkillFilters.size === 0
      || [...selectedSkillFilters].some(role =>
        (project.skillRoles || []).includes(role)
      );

    // A project matches if it satisfies search AND tech AND skill filters
    return matchesSearch && techMatches && skillMatches;
  });

  if (isLoading) {
    return (
      <section className="projects-page">
        {/* Page Header */}
        <div className="projects-header">
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            Loading your projects...
          </p>
        </div>

        {/* Loading Skeletons */}
        <div className="projects-grid">
          {/* Show 6 skeleton cards while loading */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>

        {/* Loading Hint */}
        <div className="loading-hint">
          <p>Loading projects... Please wait.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-page">
      {/* Page Header with Search and Filter Controls */}
      <div className="projects-header">
        <div className="header-content">
          <h1 className="projects-title">Projects</h1>
          <div className="header-actions">
            {/* Search Bar */}
            <div className="search-wrapper">
              <div className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search projects"
              />
            </div>

            {/* Filter Icon Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`filter-icon-btn ${isFilterOpen ? "active" : ""}`}
              aria-label="Toggle filters"
              aria-expanded={isFilterOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </button>
          </div>
        </div>
        <p className="projects-subtitle">
          Explore my work across different technologies and domains
        </p>
      </div>

      {/* Filter Menu (conditionally rendered) */}
      {isFilterOpen && (
        <div className="filter-menu">
          <div className="filter-menu-header">
            <h3>Filter Projects</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="close-filter-btn"
              aria-label="Close filters"
            >
              ×
            </button>
          </div>

          <div className="filter-menu-content">
            {/* Technology Filters */}
            <div className="filter-section">
              <div className="filter-section-header">
                <h4>Filter by Technology</h4>
                <p className="filter-section-description">Select technologies to filter projects</p>
              </div>
              <div className="filter-button-group">
                <button
                  className={`filter-btn ${selectedTechFilters.size === 0 ? "active-filter" : ""}`}
                  onClick={() => {
                    setSelectedTechFilters(new Set());
                  }}
                >
                  All ({projects.length})
                </button>
                {allTech.map(tech => {
                  const count = projects.filter(p =>
                    p.tech.includes(tech)
                  ).length;

                  return (
                    <button
                      key={tech}
                      className={`filter-btn ${selectedTechFilters.has(tech) ? "active-filter" : ""}`}
                      onClick={() => {
                        const newSet = new Set(selectedTechFilters);
                        if (newSet.has(tech)) {
                          newSet.delete(tech);
                        } else {
                          newSet.add(tech);
                        }
                        setSelectedTechFilters(newSet);
                      }}
                    >
                      {tech} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skill Role Filters */}
            <div className="filter-section">
              <div className="filter-section-header">
                <h4>Filter by Skill Role</h4>
                <p className="filter-section-description">Select skill roles to filter projects</p>
              </div>
              <div className="filter-button-group">
                <button
                  className={`filter-btn ${selectedSkillFilters.size === 0 ? "active-filter" : ""}`}
                  onClick={() => {
                    setSelectedSkillFilters(new Set());
                  }}
                >
                  All ({projects.length})
                </button>
                {allSkillRoles.map(role => {
                  const count = projects.filter(p =>
                    (p.skillRoles || []).includes(role)
                  ).length;

                  return (
                    <button
                      key={role}
                      className={`filter-btn ${selectedSkillFilters.has(role) ? "active-filter" : ""}`}
                      onClick={() => {
                        const newSet = new Set(selectedSkillFilters);
                        if (newSet.has(role)) {
                          newSet.delete(role);
                        } else {
                          newSet.add(role);
                        }
                        setSelectedSkillFilters(newSet);
                      }}
                    >
                      {role} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-menu-footer">
              <button
                onClick={() => {
                  setSelectedTechFilters(new Set());
                  setSelectedSkillFilters(new Set());
                }}
                className="clear-filters-btn"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ?
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.slug} project={project}></ProjectCard>
          ))}

        </div>
        : (
          <div className="projects-empty">
            <div className="projects-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <p className="projects-empty-title">No projects found</p>
            <p className="projects-empty-description">
              No projects match your current search and filter criteria.
              Try adjusting your search terms or selecting different filters.
            </p>
            <p className="projects-empty-suggestion">
              <em>Tip: Start with a broad search, then narrow down using filters</em>
            </p>
          </div>
        )}

      {/* Results count and filters info */}
      <div className="projects-footer">
        <div className="results-count">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
        </div>
        {(() => {
          let filterText = '';

          // Add search query if present
          if (searchQuery.trim() !== "") {
            filterText += `"${searchQuery}"`;

            // Add separator if we also have filters
            if (selectedTechFilters.size > 0 || selectedSkillFilters.size > 0) {
              filterText += ' • ';
            }
          }

          // Add tech filters
          if (selectedTechFilters.size > 0) {
            filterText += [...selectedTechFilters].join(', ');
          }

          // Add separator between tech and skill filters
          if (selectedTechFilters.size > 0 && selectedSkillFilters.size > 0) {
            filterText += ' • ';
          }

          // Add skill role filters
          if (selectedSkillFilters.size > 0) {
            filterText += [...selectedSkillFilters].join(', ');
          }

          return filterText;
        })() && (
            <span className="filters-info">
              Filtered by: {(() => {
                let filterText = '';

                // Add search query if present
                if (searchQuery.trim() !== "") {
                  filterText += `"${searchQuery}"`;

                  // Add separator if we also have filters
                  if (selectedTechFilters.size > 0 || selectedSkillFilters.size > 0) {
                    filterText += ' • ';
                  }
                }

                // Add tech filters
                if (selectedTechFilters.size > 0) {
                  filterText += [...selectedTechFilters].join(', ');
                }

                // Add separator between tech and skill filters
                if (selectedTechFilters.size > 0 && selectedSkillFilters.size > 0) {
                  filterText += ' • ';
                }

                // Add skill role filters
                if (selectedSkillFilters.size > 0) {
                  filterText += [...selectedSkillFilters].join(', ');
                }

                return filterText;
              })()}
            </span>
          )}
      </div>
    </section>
  );
}