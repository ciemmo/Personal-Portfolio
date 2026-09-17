import Link from "next/link";
import Image from "next/image";

export default async function ProjectsPage() {
    const res = await fetch("http://localhost:3000/api/projects", {
        cache: "no-store",
    });

    const projects = await res.json();

    return (
        <section
            style={{
                padding: "var(--space-xl) var(--space-md)",
                maxWidth: "900px",
                margin: "0 auto",
            }}
        >
            <h1
                style={{
                    fontSize: "2rem",
                    marginBottom: "var(--space-lg)",
                }}
            >
                Projects
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "var(--space-lg)",
                }}
            >
                {projects.map((project: any) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        style={{
                            display: "block",
                            padding: "var(--space-md)",
                            borderRadius: "var(--radius-md)",
                            border: `1px solid var(--color-border)`,
                            textDecoration: "none",
                            color: "inherit",
                            boxShadow: "var(--shadow-sm)",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                    >
                        {project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={400}
                                height={250}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "var(--radius-sm)",
                                    marginBottom: "var(--space-md)",
                                }}
                            />
                        )}

                        <h2
                            style={{
                                fontSize: "1.25rem",
                                marginBottom: "var(--space-sm)",
                            }}
                        >
                            {project.title}
                        </h2>

                        <p
                            style={{
                                color: "var(--color-text-light)",
                                marginBottom: "var(--space-md)",
                            }}
                        >
                            {project.description}
                        </p>

                        <span
                            style={{
                                color: "var(--color-primary)",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                            }}
                        >
                            View Details →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
