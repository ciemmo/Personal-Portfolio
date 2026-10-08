import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import InteractiveSkills from "@/components/sections/InteractiveSkills";
import ProjectsGrid from "@/components/sections/ProjectsGrid";

export default async function Home() {
    // Fetch projects data for immediate loading on homepage
    const res = await fetch("http://localhost:3000/api/projects", {
        // Use cache for better performance on subsequent visits
        // force-cache on first visit, then fallback to cache
        cache: "force-cache"
    });
    const projects = await res.json();

    return (
        <>
            <Hero />
            <About />
            <InteractiveSkills />
            <ProjectsGrid projects={projects} />
        </>
    );
}
