import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { skillRolesByTech, skillIcons } from "@/data/skillRoles";
import styles from "./ProjectDetail.module.css";

// Tech descriptions for tooltips
const techDescriptions: Record<string, string> = {
  // Frontend
  "HTML": "HyperText Markup Language - Standard markup language for web pages",
  "CSS": "Cascading Style Sheets - Styling language for web pages",
  "JavaScript": "Programming language for web interactivity",
  "TypeScript": "Typed superset of JavaScript for large-scale applications",
  "React": "JavaScript library for building user interfaces",
  "Next.js": "React framework for production-grade applications",
  "Vue.js": "Progressive JavaScript framework for building UIs",
  "Svelte": "Compiler-based reactive UI framework",
  "Angular": "Platform for building mobile and desktop web applications",
  "Tailwind CSS": "Utility-first CSS framework for rapid UI development",
  "Bootstrap": "Popular CSS framework for responsive design",
  "Material UI": "React component library implementing Material Design",
  "Redux": "Predictable state container for JavaScript apps",
  "Zustand": "Lightweight state management for React",
  "GraphQL": "Query language and runtime for APIs",
  "REST API": "Architectural style for networked applications",
  "Vite": "Next-generation frontend build tool",
  "Webpack": "Module bundler for JavaScript applications",
  // Backend
  "Node.js": "JavaScript runtime for server-side development",
  "Express.js": "Minimalist web framework for Node.js",
  "NestJS": "Progressive Node.js framework for scalable applications",
  "Python": "Versatile programming language for backend and data",
  "Django": "High-level Python web framework for rapid development",
  "FastAPI": "Modern, fast Python web framework for APIs",
  "Flask": "Lightweight Python web framework",
  "C++": "High-performance systems programming language",
  "Java": "Object-oriented language for enterprise applications",
  "Spring Boot": "Opinionated framework for Spring applications",
  "C#": "Modern object-oriented language for .NET ecosystem",
  ".NET": "Microsoft's developer platform for building applications",
  "Go": "Fast, statically typed language for scalable services",
  "Rust": "Memory-safe systems programming language",
  "PostgreSQL": "Advanced open-source relational database",
  "MySQL": "Popular open-source relational database",
  "MongoDB": "Document-oriented NoSQL database",
  "Redis": "In-memory data structure store",
  "Docker": "Containerization platform for consistent deployments",
  "Kubernetes": "Container orchestration platform",
  "AWS": "Amazon Web Services cloud platform",
  "Azure": "Microsoft cloud computing platform",
  "Google Cloud": "Google's cloud computing services",
  "Terraform": "Infrastructure as code tool",
  "GitHub Actions": "CI/CD platform integrated with GitHub",
  "GitLab CI": "Built-in CI/CD for GitLab",
  "Jenkins": "Open-source automation server",
  // DevOps Tools
  "Linux": "Open-source operating system kernel",
  "Ubuntu": "Popular Linux distribution",
  "NGINX": "High-performance web server and reverse proxy",
  "Prometheus": "Monitoring and alerting toolkit",
  "Grafana": "Analytics and monitoring dashboard platform",
  "Figma": "Collaborative interface design tool",
  "VS Code": "Lightweight code editor from Microsoft",
  "Git": "Distributed version control system",
  "GitHub": "Git repository hosting and collaboration platform",
  // Mobile
  "React Native": "Framework for building native mobile apps with React",
  "Flutter": "UI toolkit for building natively compiled applications",
  "Swift": "Programming language for iOS/macOS development",
  "Kotlin": "Modern language for Android development",
};

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
  images?: string[];
  _id?: string;
  createdAt?: string;
  featured?: boolean;
  category?: string;
  // Case study fields
  problem?: string;
  solution?: string;
  results?: string;
  challenges?: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(context: ProjectDetailPageProps) {
  const { slug } = await context.params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        title: `${slug.replace(/-/g, ' ')} – Emmanuel's Portfolio`,
        description: `Project details for ${slug.replace(/-/g, ' ')}`,
      };
    }

    const project = await res.json();

    return {
      title: `${project.title} – Emmanuel's Portfolio`,
      description: project.description || project.longDescription?.slice(0, 150) || `Project details for ${project.title}`,
      openGraph: {
        title: project.title,
        description: project.description || project.longDescription?.slice(0, 150) || `Project details for ${project.title}`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/projects/${slug}`,
        images: project.image ? [project.image] : [],
        type: 'article',
        publishedTime: project.createdAt,
        tags: project.tech,
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description || project.longDescription?.slice(0, 150) || `Project details for ${project.title}`,
        images: project.image ? [project.image] : [],
      },
      other: {
        'article:published_time': project.createdAt || '',
        'article:tag': project.tech.join(', '),
      },
    };
  } catch (error) {
    return {
      title: `${slug.replace(/-/g, ' ')} – Emmanuel's Portfolio`,
      description: `Project details for ${slug.replace(/-/g, ' ')}`,
    };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return notFound();
    }

    const project: Project = await res.json();

    // Fetch all projects for navigation and related projects
    const allProjectsRes = await fetch(`${baseUrl}/api/projects`, {
      cache: "force-cache"
    });
    const allProjects: Project[] = await allProjectsRes.json();

    const currentIndex = allProjects.findIndex(p => p.slug === slug);

    const prevProject = allProjects[
      (currentIndex - 1 + allProjects.length) % allProjects.length
    ];
    const nextProject = allProjects[
      (currentIndex + 1) % allProjects.length
    ];

    // Calculate related projects (sharing skills/tech)
    const getRelatedProjects = (currentProject: Project, allProjects: Project[]) => {
      return allProjects
        .filter(p => p.slug !== currentProject.slug)
        .map(project => {
          // Calculate skill overlap score
          const currentSkills = new Set(currentProject.skillRoles || []);
          const projectSkills = new Set(project.skillRoles || []);
          const techOverlap = currentProject.tech.filter(t => project.tech.includes(t));
          const skillOverlap = [...currentSkills].filter(skill => projectSkills.has(skill));
          const score = techOverlap.length * 2 + skillOverlap.length; // Weight tech higher

          return { project, score, sharedTech: techOverlap, sharedSkills: skillOverlap };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => ({
          ...item.project,
          _sharedTech: item.sharedTech,
          _sharedSkills: item.sharedSkills,
        }));
    };

    const relatedProjects = getRelatedProjects(project, allProjects);

    // Prepare gallery images
    const galleryImages = project.images && project.images.length > 0
      ? project.images
      : project.image
        ? [project.image]
        : [];

    // Build case study sections dynamically
    const caseStudySections = [];

    if (project.problem) {
      caseStudySections.push({
        number: 1,
        title: "The Problem",
        subtitle: "Understanding the challenge and constraints",
        content: project.problem,
        type: 'text' as const,
      });
    }

    if (project.solution) {
      caseStudySections.push({
        number: caseStudySections.length + 1,
        title: "The Solution",
        subtitle: "Technical approach and implementation details",
        content: project.solution,
        type: 'text' as const,
      });
    }

    if (project.challenges && project.challenges.length > 0) {
      caseStudySections.push({
        number: caseStudySections.length + 1,
        title: "Key Challenges",
        subtitle: "Technical hurdles and how they were overcome",
        content: project.challenges,
        type: 'list' as const,
      });
    }

    if (project.results) {
      caseStudySections.push({
        number: caseStudySections.length + 1,
        title: "Results & Impact",
        subtitle: "Measurable outcomes and business value",
        content: project.results,
        type: 'text' as const,
      });
    }

    // If no case study fields, fall back to longDescription
    if (caseStudySections.length === 0 && project.longDescription) {
      caseStudySections.push({
        number: 1,
        title: "Project Overview",
        subtitle: "Detailed description and implementation notes",
        content: project.longDescription.split("\n").filter(Boolean),
        type: 'paragraphs' as const,
      });
    }

    return (
      <section className={styles.projectDetail} aria-labelledby="project-title">
        {/* Back to Projects */}
        <Link
          href="/projects"
          className={styles.backLink}
          aria-label="Back to projects listing"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Text Content */}
            <div className={styles.heroText}>
              <div className={styles.projectMeta}>
                {project.featured && (
                  <span className={styles.metaTagFeatured}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Featured
                  </span>
                )}
                {project.category && (
                  <span className={styles.metaTag}>{project.category}</span>
                )}
                {project.createdAt && (
                  <span className={styles.metaTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                )}
              </div>

              <h1 id="project-title" className={styles.projectTitle}>
                {project.title}
              </h1>

              <p className={styles.projectDescription}>
                {project.description}
              </p>

              <div className={styles.projectActions}>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    aria-label={`View live demo for ${project.title}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    aria-label={`View source code for ${project.title}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18 7.31 18 4c-1.49.51-3.41.57-4.65.84-.95.11-1.95.16-2.95.16-1.14 0-2.18.05-3.22.18m.5 4.28v2.95c-.11.23-.24.42-.39.57-.42.41-.66.85-.66 1.35 0 .77.2 1.4.5 1.9.5.1.9.01 1.3-.01.37-.02.72-.1 1.03-.27M5 12a7 7 0 1 0 14 0 7 7 0 0 0z"/>
                    </svg>
                    Source Code
                  </a>
                )}
                {!project.demo && !project.github && (
                  <span className={`${styles.btn} ${styles.btnGhost}`} style={{ cursor: 'default', pointerEvents: 'none' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Private Repository
                  </span>
                )}
              </div>
            </div>

            {/* Hero Image / Gallery */}
            {galleryImages.length > 0 && (
              <div className={styles.heroImageWrapper} role="region" aria-label="Project screenshots gallery">
                <div className={styles.galleryContainer} style={{ position: 'relative' }}>
                  {galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className={styles.gallerySlide}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: index === 0 ? 1 : 0,
                        pointerEvents: index === 0 ? 'auto' : 'none',
                        transition: 'opacity var(--duration-slow) var(--ease-out)',
                      }}
                      aria-hidden={index !== 0}
                    >
                      <Image
                        src={img}
                        alt={index === 0 ? project.title : `${project.title} - screenshot ${index + 1}`}
                        fill
                        className={styles.heroImage}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      />
                    </div>
                  ))}

                  {/* Gallery Navigation */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                        aria-label="Previous screenshot"
                        onClick={() => {}}
                        disabled
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <button
                        className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                        aria-label="Next screenshot"
                        onClick={() => {}}
                        disabled
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>

                      <div className={styles.galleryIndicators} aria-label="Screenshot indicators">
                        {galleryImages.map((_, index) => (
                          <button
                            key={index}
                            className={`${styles.galleryIndicator} ${index === 0 ? styles.active : ''}`}
                            aria-label={`View screenshot ${index + 1}`}
                            aria-current={index === 0 ? 'true' : 'false'}
                            disabled
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Case Study Sections */}
        {caseStudySections.length > 0 && (
          <div className={styles.caseStudy} role="main">
            {caseStudySections.map((section, sectionIndex) => (
              <article key={section.title} className={styles.caseStudySection} aria-labelledby={`section-${sectionIndex}-title`}>
                <header className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>{section.number}</span>
                  <div>
                    <h2 id={`section-${sectionIndex}-title`} className={styles.sectionTitle}>
                      {section.title}
                    </h2>
                    <p className={styles.sectionSubtitle}>{section.subtitle}</p>
                  </div>
                </header>
                <div className={styles.sectionContent}>
                  {section.type === 'text' && (
                    <div dangerouslySetInnerHTML={{ __html: section.content as string }} />
                  )}
                  {section.type === 'paragraphs' && (
                    <>
                      {(section.content as string[]).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </>
                  )}
                  {section.type === 'list' && (
                    <ul>
                      {(section.content as string[]).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Key Metrics - show after results section */}
                {section.title === "Results & Impact" && project.keyMetrics && project.keyMetrics.length > 0 && (
                  <div className={styles.metrics} role="list" aria-label="Key metrics">
                    {project.keyMetrics.map((metric, i) => (
                      <div key={i} className={styles.metricCard} role="listitem">
                        <div className={styles.metricValue}>{metric.value}</div>
                        <div className={styles.metricLabel}>{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlight box for key insight */}
                {section.title === "The Solution" && project.tech.length > 0 && (
                  <div className={styles.highlightBox} role="complementary" aria-label="Key technologies used">
                    <div className={styles.highlightIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        <path d="M12 22V12M12 2v10"></path>
                      </svg>
                    </div>
                    <div className={styles.highlightText}>
                      <strong>Tech Stack</strong>
                      <p>{project.tech.length} technologies powering this solution</p>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Tech Stack Section */}
        {project.tech.length > 0 && (
          <section className={styles.techStackSection} aria-labelledby="tech-stack-title">
            <header className={styles.techStackHeader}>
              <h2 id="tech-stack-title" className={styles.techStackTitle}>
                Technology Stack
              </h2>
              <span className={styles.techStackCount}>
                {project.tech.length} technologies
              </span>
            </header>
            <div className={styles.techStackGrid} role="list" aria-label="Technologies used">
              {project.tech.map((tech) => {
                const roles = skillRolesByTech[tech as keyof typeof skillRolesByTech] || [];
                const icon = skillIcons[tech as keyof typeof skillIcons] || '⬢';
                const primaryRole = roles[0] || 'technology';
                const description = techDescriptions[tech] || `${tech} - ${primaryRole}`;

                return (
                  <span
                    key={tech}
                    className={styles.techTag}
                    data-tooltip={description}
                    role="listitem"
                    tabIndex={0}
                  >
                    <span className={styles.techIcon} aria-hidden="true">{icon}</span>
                    <span className={styles.techName}>{tech}</span>
                    <span className={styles.techRole}>{primaryRole}</span>
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className={styles.relatedProjects} aria-labelledby="related-projects-title">
            <header className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>🔗</span>
              <div>
                <h2 id="related-projects-title" className={styles.sectionTitle}>
                  Related Projects
                </h2>
                <p className={styles.sectionSubtitle}>
                  Projects sharing similar technologies and domains
                </p>
              </div>
            </header>
            <div className={styles.relatedGrid} role="list" aria-label="Related projects">
              {relatedProjects.map((relatedProject) => (
                <article
                  key={relatedProject.slug}
                  className={styles.relatedCard}
                  role="listitem"
                >
                  <h3 className={styles.relatedCardTitle}>
                    <Link href={`/projects/${relatedProject.slug}`}>
                      {relatedProject.title}
                    </Link>
                  </h3>
                  <div className={styles.relatedCardMeta}>
                    <span>{relatedProject._sharedTech?.length || 0} shared tech</span>
                    <span>·</span>
                    <span>{relatedProject._sharedSkills?.length || 0} shared skills</span>
                  </div>
                  <div className={styles.sharedSkills}>
                    {relatedProject._sharedTech?.slice(0, 4).map((tech, i) => (
                      <span key={i} className={styles.sharedSkill}>{tech}</span>
                    ))}
                    {relatedProject._sharedSkills?.slice(0, 2).map((skill, i) => (
                      <span key={i} className={styles.sharedSkill}>{skill}</span>
                    ))}
                    {(relatedProject._sharedTech?.length || 0) + (relatedProject._sharedSkills?.length || 0) > 6 && (
                      <span className={styles.sharedSkill}>+{((relatedProject._sharedTech?.length || 0) + (relatedProject._sharedSkills?.length || 0) - 6)} more</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Project Navigation */}
        <nav className={styles.projectNavigation} aria-label="Project navigation">
          <Link
            href={`/projects/${prevProject.slug}`}
            className={`${styles.navLink} ${styles.navLinkPrev}`}
            aria-label={`Previous project: ${prevProject.title}`}
          >
            <div className={styles.navThumbnail}>
              {prevProject.image ? (
                <Image
                  src={prevProject.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-quaternary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.navContent}>
              <span className={styles.navLabel}>Previous Project</span>
              <span className={styles.navTitle}>{prevProject.title}</span>
            </div>
            <span className={styles.navArrow} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className={`${styles.navLink} ${styles.navLinkNext}`}
            aria-label={`Next project: ${nextProject.title}`}
          >
            <span className={styles.navArrow} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <div className={styles.navContent}>
              <span className={styles.navLabel}>Next Project</span>
              <span className={styles.navTitle}>{nextProject.title}</span>
            </div>
            <div className={styles.navThumbnail}>
              {nextProject.image ? (
                <Image
                  src={nextProject.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-quaternary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                  </svg>
                </div>
              )}
            </div>
          </Link>
        </nav>
      </section>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    return (
      <section className={`${styles.projectDetail} ${styles.errorState}`} role="alert">
        <div className={styles.errorIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className={styles.errorTitle}>Project Not Found</h1>
        <p className={styles.errorMessage}>
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/projects" className={`${styles.btn} ${styles.btnPrimary} ${styles.retryButton}`}>
          Browse All Projects
        </Link>
      </section>
    );
  }
}