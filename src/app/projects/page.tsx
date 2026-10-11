"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
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
            Explore my work across different technologies and domains
          </p>
        </div>

        {/* Loading Skeletons */}
        <div className="projects-grid">
          {/* Show 6 skeleton cards while loading */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
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
              <input
                type="text"
                placeholder="Search projects..."
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
              🔍
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
              <h4>Filter by Technology</h4>
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

            {/* Skill Role Filters */}
            <div className="filter-section">
              <h4>Filter by Skill Role</h4>
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
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card-enhanced"
              passHref
            >
              <div className="card-container">
                {/* Image with hover effects */}
                <div className="card-image-wrapper">
                  {project.image && (
                    <OptimizedImage
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="project-image"
                      // Prioritize first 3 images (above the fold on desktop)
                      priority={filteredProjects.indexOf(project) < 3}
                      // Add blur placeholder for better loading experience
                      blurPlaceholder
                    />
                  )}
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <span className="overlay-tag">View Details</span>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="demo-link"
                          aria-label="Live demo"
                        >
                          🔗 Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link"
                          aria-label="Source code"
                        >
                          💻 Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project info with micro-interactions */}
                <div className="card-info">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {/* Interactive tech tags */}
                  <div className="tech-tags">
                    {project.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="tech-tag"
                        aria-label={`Technology: ${tech}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Depth indicator for long description */}
                  {project.longDescription && (
                    <div className="depth-indicator" aria-label="Full case study available">
                      <span>•••</span>
                      <span className="depth-text">Full case study</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="projects-empty">
          <p>No projects match your search and filters.</p>
          <p>Try adjusting your search or filter selections.</p>
        </div>
      )}

      {/* Results count and filters info */}
      <div className="projects-footer">
        <div className="results-count">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          {((selectedTechFilters.size > 0 || selectedSkillFilters.size > 0 || searchQuery.trim() !== "") &&
            (() => {
              let filterText = '';

              // Add search query if present
              if (searchQuery.trim() !== "") {
                filterText += `Search: "${searchQuery}"`;

                // Add separator if we also have filters
                if (selectedTechFilters.size > 0 || selectedSkillFilters.size > 0) {
                  filterText += ' | ';
                }
              }

              // Add tech filters
              if (selectedTechFilters.size > 0) {
                filterText += [...selectedTechFilters].join(', ');
              }

              // Add separator between tech and skill filters
              if (selectedTechFilters.size > 0 && selectedSkillFilters.size > 0) {
                filterText += ' & ';
              }

              // Add skill role filters
              if (selectedSkillFilters.size > 0) {
                filterText += [...selectedSkillFilters].join(', ');
              }

              return filterText ? ` | Filtered by: ${filterText}` : '';
            })()
          )}
        </div>
      </div>
    </section>
  );
}