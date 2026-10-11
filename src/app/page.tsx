import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Hero from "@/components/sections/Hero";
import InteractiveSkills from "@/components/sections/InteractiveSkills";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import { getAllBlogPosts } from "@/lib/mdx";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
    let projects = [];
    try {
        // Fetch projects data for immediate loading on homepage
        const res = await fetch("http://localhost:3000/api/projects", {
            // Use cache for better performance on subsequent visits
            // force-cache on first visit, then fallback to cache
            cache: "force-cache"
        });
        projects = await res.json();
    } catch (error) {
        // If API fails (e.g., during build), use empty array
        projects = [];
    }

    const blogPosts = await getAllBlogPosts();

    return (
        <>
            <Hero />
            <About />
            <Achievements />
            <section className={styles.blogSection}>
                <h2 className={styles.title}>Recent Blog Posts</h2>
                <p className={styles.description}>
                    Check out my latest technical writings and insights.
                </p>
                <div className={styles.postsGrid}>
                    {blogPosts.slice(0, 3).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.postLink}
                        >
                            <article className={styles.postCard}>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <p className={styles.postExcerpt}>{post.excerpt}</p>
                            </article>
                        </Link>
                    ))}
                </div>
                <Link href="/blog" className={styles.blogLink}>
                    View All Posts →
                </Link>
            </section>
            <InteractiveSkills />
            <ProjectsGrid projects={projects} />
        </>
    );
}