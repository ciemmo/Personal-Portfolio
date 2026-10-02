import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
  _id?: string;
  createdAt?: Date;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [allTech, setAllTech] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        // Extract all unique technologies
        const techSet = new Set<string>();
        data.forEach((p: Project) => {
          p.tech.forEach(tech => techSet.add(tech));
        });

        setProjects(data);
        setAllTech(Array.from(techSet).sort());
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects based on selected technologies
  const filteredProjects = selectedFilters.size === 0
    ? projects
    : projects.filter(project =>
        [...selectedFilters].every(tech =>
          project.tech.includes(tech)
        )
      );

  if (isLoading) {
    return (
      <section className="projects-page">
        <div className="projects-loading">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-page">
      {/* Page Header */}
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">
          Explore my work across different technologies and domains
        </p>
      </div>

      {/* Filter Controls */}
      <div className="project-filters">
        <button
          className={`filter-btn ${selectedFilters.size === 0 ? "active-filter" : ""}`}
          onClick={() => {
            setSelectedFilters(new Set());
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
              className={`filter-btn ${selectedFilters.has(tech) ? "active-filter" : ""}`}
              onClick={() => {
                const newSet = new Set(selectedFilters);
                if (newSet.has(tech)) {
                  newSet.delete(tech);
                } else {
                  newSet.add(tech);
                }
                setSelectedFilters(newSet);
              }}
            >
              {tech} ({count})
            </button>
          );
        })}
      </div>

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
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={250}
                      className="project-image"
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
          <p>No projects match the selected filters.</p>
          <p>Try adjusting your filter selections.</p>
        </div>
      )}

      {/* Results count and filters info */}
      <div className="projects-footer">
        <div className="results-count">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
          {selectedFilters.size > 0 && ` | Filtered by: ${[...selectedFilters].join(", ")}`}
        </div>
        <div className="clear-filters">
          {selectedFilters.size > 0 && (
            <button
              onClick={() => setSelectedFilters(new Set())}
              className="clear-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}