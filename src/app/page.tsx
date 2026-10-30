import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Hero from "@/components/sections/Hero";
import WorkExperience from "@/components/sections/WorkExperience";
import ClientComponentsWrapper from "@/components/sections/ClientComponentsWrapper";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import styles from "./page.module.css";
import { fetchHomepageData } from "@/lib/fetchHomepageData";

// Force dynamic rendering so admin-updated stats reflect immediately
export const dynamic = 'force-dynamic';

// Fetch all homepage data in parallel (server-side) to eliminate waterfall
const homepageData = await fetchHomepageData();

export default async function Home() {
    return (
        <>
            <Hero stats={homepageData.stats} />
            <About />
            <Achievements initialData={homepageData.achievements} />
            <WorkExperience initialData={homepageData.workExperience} />
            <Education initialData={homepageData.education} />
            <Certifications initialCertifications={homepageData.certifications} initialContinuingEducation={homepageData.continuingEducation} />
            <ErrorBoundary>
              <ClientComponentsWrapper skillsData={homepageData.skills} projectsData={homepageData.projects} />
            </ErrorBoundary>
        </>
    );
}