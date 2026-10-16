"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github?: string;
  demo?: string;
  _id?: string;
}

interface SearchablePage {
  path: string;
  title: string;
  description: string;
  icon: string;
}

const searchablePages: SearchablePage[] = [
  {
    path: "/contact",
    title: "Contact Me",
    description: "Get in touch for collaborations, opportunities, or questions",
    icon: "📧"
  },
  {
    path: "/workExperience",
    title: "Work Experience",
    description: "Professional journey and technical expertise gained through various roles",
    icon: "💼"
  },
  {
    path: "/certifications",
    title: "Certifications",
    description: "Official certifications, badges, and ongoing learning pursuits",
    icon: "🏆"
  }
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredPages, setFilteredPages] = useState<SearchablePage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const projectsRef = useRef<Project[]>([]);
  const router = useRouter();

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsSearching(true);
        const res = await fetch("http://localhost:3000/api/projects", {
          cache: "force-cache", // Cache since projects don't change often
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
        projectsRef.current = data; // Fixed: assign to ref.current
        setFilteredProjects(data); // Initially show all
      } catch (error) {
        console.error("Error fetching projects for search:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProjects(projectsRef.current);
      setActiveIndex(-1);
      return;
    }

    const searchTerm = query.trim().toLowerCase();
    const filtered = projectsRef.current.filter((project) => {
      // Search in title, description, longDescription, and tech stack
      return (
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.longDescription.toLowerCase().includes(searchTerm) ||
        project.tech.some((tech) => tech.toLowerCase().includes(searchTerm))
      );
    });

    setFilteredProjects(filtered);
    setActiveIndex(-1); // Reset active index when filter changes
  }, [query]);

  // Handle closing search when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-bar")) {
        setIsOpen(false);
        setQuery("");
        setFilteredProjects(projectsRef.current);
        setFilteredPages(searchablePages);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const totalResults = filteredProjects.length + filteredPages.length;
    if (totalResults === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setFilteredProjects(projectsRef.current);
        setFilteredPages(searchablePages);
        setActiveIndex(-1);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev >= totalResults - 1 ? 0 : prev + 1
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? totalResults - 1 : prev - 1
        );
        return;
      }

      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        // Check if active item is a project or page
        if (activeIndex < filteredProjects.length) {
          // It's a project
          const project = filteredProjects[activeIndex];
          router.push(`/projects/${project.slug}`);
        } else {
          // It's a page
          const pageIndex = activeIndex - filteredProjects.length;
          const page = filteredPages[pageIndex];
          router.push(page.path);
        }
        setIsOpen(false);
        setQuery("");
        setFilteredProjects(projectsRef.current);
        setFilteredPages(searchablePages);
        setActiveIndex(-1);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredProjects.length, filteredPages.length, activeIndex, router]);

  // Handle form submission (Enter key in input)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0) {
      // Check if active item is a project or page
      const totalProjects = filteredProjects.length;
      if (activeIndex < totalProjects) {
        // It's a project
        const project = filteredProjects[activeIndex];
        router.push(`/projects/${project.slug}`);
      } else {
        // It's a page
        const pageIndex = activeIndex - totalProjects;
        const page = filteredPages[pageIndex];
        router.push(page.path);
      }
      setIsOpen(false);
      setQuery("");
      setFilteredProjects(projectsRef.current);
      setFilteredPages(searchablePages);
      setActiveIndex(-1);
    }
  };

  // Handle project selection from click
  const handleProjectSelect = (project: Project) => {
    router.push(`/projects/${project.slug}`);
    setIsOpen(false);
    setQuery("");
    setFilteredProjects(projectsRef.current);
    setFilteredPages(searchablePages);
    setActiveIndex(-1);
  };

  // Handle page selection from click
  const handlePageSelect = (page: SearchablePage) => {
    router.push(page.path);
    setIsOpen(false);
    setQuery("");
    setFilteredProjects(projectsRef.current);
    setFilteredPages(searchablePages);
    setActiveIndex(-1);
  };

  // Toggle search bar open/closed
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Closing
      setQuery("");
      setFilteredProjects(projectsRef.current);
      setActiveIndex(-1);
    } else {
      // Opening - focus input after animation completes
      setTimeout(() => {
        const input = document.getElementById("search-input");
        input?.focus();
      }, 100);
    }
  };

  if (isSearching && projects.length === 0) {
    return (
      <div className="search-bar">
        <div className="search-loader">
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-bar">
      {/* Search Toggle Button */}
      <button
        className="search-toggle"
        onClick={toggleSearch}
        aria-label="Search projects and pages"
        title="Search projects and pages"
      >
        🔍
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div className="search-panel">
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search projects, pages, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search projects and pages"
              autoComplete="off"
            />
            <button
              type="submit"
              className="search-submit"
              aria-label="Submit search"
            >
              →
            </button>
          </form>

          {/* Results Dropdown */}
          <div className="search-results">
            {filteredProjects.length > 0 && (
              <>
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.slug}
                    className={`search-result-item ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="search-result-content">
                      <h3 className="search-result-title">{project.title}</h3>
                      <p className="search-result-description">{project.description}</p>
                      {project.tech.length > 0 && (
                        <div className="search-result-tech">
                          {project.tech.map((tech) => (
                            <span key={tech} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            {filteredPages.length > 0 && (
              <>
                {filteredPages.map((page, index) => {
                  const resultIndex = filteredProjects.length + index;
                  return (
                    <div
                      key={page.path}
                      className={`search-result-item ${
                        resultIndex === activeIndex ? "active" : ""
                      }`}
                      onMouseEnter={() => setActiveIndex(resultIndex)}
                      onClick={() => handlePageSelect(page)}
                    >
                      <div className="search-result-content">
                        <div className="search-result-icon">{page.icon}</div>
                        <div>
                          <h3 className="search-result-title">{page.title}</h3>
                          <p className="search-result-description">{page.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Empty State */}
          {query.trim() !== "" && (filteredProjects.length === 0 && filteredPages.length === 0) && (
            <div className="search-empty">
              <p>No results match "{query}"</p>
              <p>Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}