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
import { fetchHomepageData } from "@/lib/fetchHomepageData";

// Fetch all homepage data in parallel (server-side) to eliminate waterfall
const homepageData = await fetchHomepageData();

export default async function Home() {
    return (
        <>
            <Hero />
            <About />
            <Achievements initialData={homepageData.achievements} />
            <WorkExperience initialData={homepageData.workExperience} />
            <Education initialData={homepageData.education} />
            <Certifications initialCertifications={homepageData.certifications} initialContinuingEducation={homepageData.continuingEducation} />
            <InteractiveSkills initialData={homepageData.skills} />
            <ProjectsGrid projects={homepageData.projects} />
        </>
    );
}