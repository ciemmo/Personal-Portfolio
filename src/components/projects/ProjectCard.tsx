import Link from "next/link";

export default function ProjectCard({ project }: { project: { title: string, slug: string, description: string } }) {
    return (
        <Link href={`/projects/${project.slug}`}>
            <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
            </div>
        </Link>
    );
}