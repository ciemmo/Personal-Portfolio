import { memo, useState, useCallback, forwardRef } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";
import styles from "./ProjectCard.module.css";

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

interface ProjectCardProps extends React.HTMLAttributes<HTMLElement> {
  project: Project;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  index?: number;
  isFeatured?: boolean;
}

const ProjectCardComponent = memo(forwardRef<HTMLElement, ProjectCardProps>(function ProjectCard({
  project,
  onKeyDown,
  index = 0,
  isFeatured = false,
  style,
  className = "",
  ...props
}: ProjectCardProps, ref) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    window.location.href = `/projects/${project.slug}`;
  }, [project.slug]);

  const handleDemoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.demo) {
      window.open(project.demo, "_blank", "noopener,noreferrer");
    }
  }, [project.demo]);

  const handleGithubClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.github) {
      window.open(project.github, "_blank", "noopener,noreferrer");
    }
  }, [project.github]);

  const cardClasses = [
    styles.projectCard,
    isFeatured ? styles.featured : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <article
      ref={ref}
      className={cardClasses}
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
      {...props}
    >
      {/* Image/Thumbnail */}
      {project.image && !imageError && (
        <div className={styles.projectCardImage} aria-hidden="true">
          <OptimizedImage
            src={project.image}
            alt={project.title}
            className={styles.projectCardImageImg}
            width={400}
            height={225}
            onError={() => setImageError(true)}
          />
          <div className={styles.projectCardImageOverlay}>
            <div className={styles.projectCardImageOverlayContent}>
              {project.demo && (
                <button
                  className={`${styles.overlayBtn} ${styles.demoBtn}`}
                  onClick={handleDemoClick}
                  aria-label="View live demo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v6M12 14v6M5 12h6M15 12h6"></path>
                  </svg>
                  <span>Live Demo</span>
                </button>
              )}
              {project.github && (
                <button
                  className={`${styles.overlayBtn} ${styles.githubBtn}`}
                  onClick={handleGithubClick}
                  aria-label="View source code"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18 7.31 18 4c-1.49.51-3.41.57-4.65.84-.95.11-1.95.16-2.95.16-1.14 0-2.18.05-3.22.18m.5 4.28v2.95c-.11.23-.24.42-.39.57-.42.41-.66.85-.66 1.35 0 .77.2 1.4.5 1.9.5.1.9.01 1.3-.01.37-.02.72-.1 1.03-.27M5 12a7 7 0 1 0 14 0 7 7 0 0 0z"/>
                  </svg>
                  <span>Source Code</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fallback when no image or image error */}
      {!project.image || imageError ? (
        <div className={styles.projectCardImagePlaceholder} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
            <line x1="6" y1="9" x2="18" y2="9"></line>
            <line x1="6" y1="13" x2="18" y2="13"></line>
            <line x1="10" y1="17" x2="14" y2="17"></line>
          </svg>
        </div>
      ) : null}

      {/* Content */}
      <div className={styles.projectCardContent}>
        {project.category && (
          <span className={styles.projectCardCategory}>{project.category}</span>
        )}

        <h3 className={styles.projectTitle}>{project.title}</h3>

        <p className={styles.projectDescription}>{project.description}</p>

        {project.techStack && project.techStack.length > 0 && (
          <div className={styles.projectTechStack} aria-label="Technologies used">
            {project.techStack.slice(0, 6).map((tech, i) => (
              <span key={i} className={styles.techTag}>{tech}</span>
            ))}
            {project.techStack.length > 6 && (
              <span className={`${styles.techTag} ${styles.more}`}>+{project.techStack.length - 6}</span>
            )}
          </div>
        )}

        <div className={styles.projectCardActions}>
          {project.demo && (
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionLink} ${styles.demoLink}`}
              aria-label={`View live demo for ${project.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>View Demo</span>
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionLink} ${styles.githubLink}`}
              aria-label={`View source code for ${project.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18 7.31 18 4c-1.49.51-3.41.57-4.65.84-.95.11-1.95.16-2.95.16-1.14 0-2.18.05-3.22.18m.5 4.28v2.95c-.11.23-.24.42-.39.57-.42.41-.66.85-.66 1.35 0 .77.2 1.4.5 1.9.5.1.9.01 1.3-.01.37-.02.72-.1 1.03-.27M5 12a7 7 0 1 0 14 0 7 7 0 0 0z"/>
              </svg>
              <span>View Code</span>
            </Link>
          )}
        </div>
      </div>

      {/* Featured badge */}
      {isFeatured && (
        <div className={styles.featuredBadge} aria-label="Featured project">
          <span>Featured</span>
        </div>
      )}
    </article>
  );
}));

export default ProjectCardComponent;