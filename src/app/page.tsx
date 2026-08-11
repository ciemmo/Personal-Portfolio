import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import ProjectsGrid from "@/components/sections/ProjectsGrid";

export default function Home() {
    return (
        <>
            <Hero />
            <About />
            <Skills />
            <ProjectsGrid />
        </>
    );
}
