import Link from "next/link";

// Define the project interface to match what we expect from the API
interface Project {
  slug: string;
  title: string;
  description: string;
  demo?: string;
  github?: string;
  image?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const handleClick = () => {
    window.location.href = `/projects/${project.slug}`;
  };

  return (
    <div
      className="project-card-link"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="project-card">
        {project.image && (
          <div className="project-card-image">
            <img
              src={project.image}
              alt={project.title}
              className="project-card-image-img"
            />
          </div>
        )}
        <div className="project-card-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-card-actions">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="action-link demo-link"
                aria-label="View live demo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2v6M12 14v6M5 12h6M15 12h6"></path>
                </svg>
                View Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="action-link github-link"
                aria-label="View source code"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18 7.31 18 4c-1.49.51-3.41.57-4.65.84-.95.11-1.95.16-2.95.16-1.14 0-2.18.05-3.22.18m.5 4.28v2.95c-.11.23-.24.42-.39.57-.42.41-.66.85-.66 1.35 0 .77.2 1.4.5 1.9.5.1.9.01 1.3-.01.37-.02.72-.1 1.03-.27M5 12a7 7 0 1 0 14 0 7 7 0 0 0z"/>
                </svg>
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}