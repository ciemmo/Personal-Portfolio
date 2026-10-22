import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Hero from "@/components/sections/Hero";
import InteractiveSkills from "@/components/sections/InteractiveSkills";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import WorkExperience from "@/components/sections/WorkExperience";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
    let projects = [];
    try {
        // Fetch projects data for immediate loading on homepage
        // Use relative URL to work both in SSR and client-side
        const res = await fetch("/api/projects", {
            // Use cache for better performance on subsequent visits
            cache: "force-cache"
        });
        projects = await res.json();
    } catch (error) {
        // If API fails (e.g., during build), use empty array
        projects = [];
    }

    return (
        <>
            <Hero />
            <About />
            <Achievements />
            <WorkExperience />
            <Education />
            <Certifications />
            <InteractiveSkills />
            <ProjectsGrid projects={projects} />
        </>
    );
}