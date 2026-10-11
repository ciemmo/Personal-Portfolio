import Link from "next/link";

// Define the project interface to match what we expect from the API
interface Project {
  slug: string;
  title: string;
  description: string;
  demo?: string;
  github?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card-link">
      <div className="project-card">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        {project.demo && (
          <span className="demo-indicator">
            Live Demo
          </span>
        )}
      </div>
    </Link>
  );
}