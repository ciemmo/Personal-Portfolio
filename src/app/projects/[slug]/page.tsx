import { notFound } from "next/navigation";
import Link from "next/link";
import { skillRolesByTech, skillIcons } from "@/data/skillRoles";
import styles from "@/app/projects/ProjectDetail.module.css";

export async function generateMetadata(context: any) {
    const { slug } = await context.params;

    try {
        const res = await fetch(`http://localhost:3000/api/projects/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            // Return fallback metadata if API fails
            return {
                title: `${slug.replace(/-/g, ' ')} – Emmanuel's Portfolio`,
                description: `Project details for ${slug.replace(/-/g, ' ')}`,
            };
        }

        const project = await res.json();

        return {
            title: `${project.title} – Emmanuel's Portfolio`,
            description: project.description || project.longDescription?.slice(0, 150),
            openGraph: {
                title: project.title,
                description: project.description || project.longDescription?.slice(0, 150),
                url: `https://your-domain.com/projects/${slug}`,
                images: project.image ? [project.image] : [],
            },
        };
    } catch (error) {
        // Return fallback metadata if API fails
        return {
            title: `${slug.replace(/-/g, ' ')} – Emmanuel's Portfolio`,
            description: `Project details for ${slug.replace(/-/g, ' ')}`,
        };
    }
}

export default async function ProjectDetailPage(context: any) {
    const { slug } = await context.params;

    try {
        const res = await fetch(`http://localhost:3000/api/projects/${slug}`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return notFound();
        }

        const project = await res.json();

        // Fetch all projects for navigation and related projects
        const allProjectsRes = await fetch("http://localhost:3000/api/projects", {
            cache: "force-cache"
        });
        const allProjects: any[] = await allProjectsRes.json();

        const currentIndex = allProjects.findIndex(p => p.slug === slug);

        const prevProject = allProjects[
          (currentIndex - 1 + allProjects.length) % allProjects.length
        ];
        const nextProject = allProjects[
          (currentIndex + 1) % allProjects.length
        ];

        // Calculate related projects (sharing skills/tech)
        const getRelatedProjects = (currentProject: any, allProjects: any[]) => {
          return allProjects
            .filter(p => p.slug !== currentProject.slug)
            .map(project => {
              // Calculate skill overlap score
              const currentSkills = new Set(currentProject.skillRoles || []);
              const projectSkills = new Set(project.skillRoles || []);
              const intersection = [...currentSkills].filter(skill => projectSkills.has(skill));
              const score = intersection.length;

              return { project, score };
            })
            .filter(item => item.score > 0) // Only projects with shared skills
            .sort((a, b) => b.score - a.score) // Highest score first
            .slice(0, 3) // Top 3 related projects
            .map(item => item.project);
        };

        const relatedProjects = getRelatedProjects(project, allProjects);

        return (
            <section className={styles.projectDetail}>
                {/* Back to Projects */}
                <a
                    href="/projects"
                    className={styles.backLink}
                >
                    ← Back to Projects
                </a>

                <h1 className={styles.projectTitle}>
                    {project.title}
                </h1>

                <div className={styles.projectLongDescription}>
                    {project.longDescription.split("\n").map((line: string, i: number) => (
                        <p key={i}>
                            {line}
                        </p>
                    ))}
                </div>

                <h2 className={styles.sectionTitle}>
                    Tech Stack
                </h2>

                <div className={styles.techStack}>
                    <div className={styles.techTags}>
                      {project.tech.map((tech: string) => {
                        const roles = skillRolesByTech[tech as keyof typeof skillRolesByTech] || [];
                        const icon = skillIcons[tech as keyof typeof skillIcons] || '•';
                        const primaryRole = roles[0] || 'frontend'; // fallback

                        return (
                          <span
                            key={tech}
                            className={`${styles.techTag} ${styles[`role-${primaryRole}`]} ${styles.techTagInteractive}`}
                            title={roles.length > 0 ? roles.join(', ') : 'Skill'}
                          >
                            <span className={styles.techIcon}>{icon}</span>
                            <span className={styles.techName}>{tech}</span>
                          </span>
                        );
                      })}
                    </div>
                </div>

                <div className={styles.actionButtons}>
                  {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton + " " + styles.actionButtonPrimary}
                    >
                        View on GitHub
                    </a>
                  )}

                  {project.demo && (
                    <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionButton + " " + styles.actionButtonSecondary}
                    >
                        Live Demo
                    </a>
                  )}
                </div>

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                  <>
                    <h2 className={styles.sectionTitle}>You might also like</h2>
                    <div className={styles.relatedProjects}>
                      <div className={styles.relatedProjectsGrid}>
                        {relatedProjects.map((relatedProject) => {
                          // Calculate shared skills for display
                          const currentSkills = new Set(project.skillRoles || []);
                          const relatedSkills = new Set(relatedProject.skillRoles || []);
                          const sharedSkills = [...currentSkills].filter(skill => relatedSkills.has(skill));

                          return (
                            <div key={relatedProject.slug} className={styles.relatedProjectCard}>
                              <h3 className={styles.relatedProjectTitle}>
                                <Link href={`/projects/${relatedProject.slug}`} className={styles.relatedProjectTitle}>
                                  {relatedProject.title}
                                </Link>
                              </h3>
                              <div className={styles.relatedProjectMeta}>
                                <span>{sharedSkills.length} shared skills</span>
                              </div>
                              {sharedSkills.length > 0 && (
                                <div className={styles.relatedProjectSkills}>
                                  {sharedSkills.slice(0, 3).map((skill, index) => (
                                    <span key={`${skill}-{index}`}>
                                      {skill + (index < sharedSkills.length - 1 ? ', ' : '')}
                                    </span>
                                  ))}
                                  {sharedSkills.length > 3 && '...'}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Project Navigation */}
                <nav className={styles.projectNavigation}>
                  <Link
                      href={`/projects/${prevProject.slug}`}
                      className={styles.navLink + " " + styles.navLinkPrev}
                      aria-label="Previous project"
                  >
                      <span className="nav-label">Previous Project</span>
                      <span className="nav-title">{prevProject.title}</span>
                  </Link>

                  <Link
                      href={`/projects/${nextProject.slug}`}
                      className={styles.navLink + " " + styles.navLinkNext}
                      aria-label="Next project"
                  >
                      <span className="nav-label">Next Project</span>
                      <span className="nav-title">{nextProject.title}</span>
                  </Link>
                </nav>
            </section>
        );
    } catch (error) {
        // Return notFound if API fails
        return notFound();
    }
}