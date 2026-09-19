import { notFound } from "next/navigation";

export async function generateMetadata(context: any) {
    const { slug } = await context.params;

    const res = await fetch(`http://localhost:3000/api/projects/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return {
            title: "Project Not Found",
            description: "This project could not be found.",
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
}

export default async function ProjectDetailPage(context: any) {
    const { slug } = await context.params;

    const res = await fetch(`http://localhost:3000/api/projects/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return notFound();
    }

    const project = await res.json();

    return (
        <section
            style={{
                padding: "var(--space-xl) var(--space-md)",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            {/* Back to Projects */}
            <a
                href="/projects"
                style={{
                    display: "inline-block",
                    marginBottom: "var(--space-lg)",
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                }}
            >
                ← Back to Projects
            </a>

            <h1
                style={{
                    fontSize: "2rem",
                    marginBottom: "var(--space-md)",
                }}
            >
                {project.title}
            </h1>

            <div
                style={{
                    marginBottom: "var(--space-lg)",
                    lineHeight: "1.7",
                    color: "var(--color-text)",
                }}
            >
                {project.longDescription.split("\n").map((line: string, i: number) => (
                    <p key={i} style={{ marginBottom: "var(--space-md)" }}>
                        {line}
                    </p>
                ))}
            </div>

            <h2
                style={{
                    marginBottom: "var(--space-sm)",
                    fontSize: "1.25rem",
                }}
            >
                Tech Stack
            </h2>

            <ul
                style={{
                    marginBottom: "var(--space-lg)",
                    paddingLeft: "var(--space-md)",
                    color: "var(--color-text-light)",
                }}
            >
                {project.tech.map((t: string) => (
                    <li key={t} style={{ marginBottom: "var(--space-sm)" }}>
                        {t}
                    </li>
                ))}
            </ul>

            {project.github && (
                <a
                    href={project.github}
                    target="_blank"
                    style={{
                        display: "inline-block",
                        padding: "var(--space-sm) var(--space-md)",
                        background: "var(--color-primary)",
                        color: "var(--color-bg)",
                        borderRadius: "var(--radius-md)",
                        textDecoration: "none",
                        fontWeight: 500,
                    }}
                >
                    View on GitHub
                </a>
            )}
        </section>
    );
}
