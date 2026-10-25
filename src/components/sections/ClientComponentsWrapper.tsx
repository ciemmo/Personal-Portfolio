"use client";

import dynamic from "next/dynamic";
import styles from "../../app/page.module.css";

// Lazy load heavy client components to reduce initial bundle size
// These components are client-side only (useState, useEffect, etc.)
const InteractiveSkills = dynamic(
  () => import("./InteractiveSkills").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className={styles.skillsSkeleton} aria-hidden="true" />,
  }
);

const ProjectsGrid = dynamic(
  () => import("./ProjectsGrid").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className={styles.projectsSkeleton} aria-hidden="true" />,
  }
);

interface ClientComponentsWrapperProps {
  skillsData?: any[];
  projectsData?: any[];
}

export default function ClientComponentsWrapper({
  skillsData = [],
  projectsData = [],
}: ClientComponentsWrapperProps) {
  return (
    <>
      <InteractiveSkills initialData={skillsData} />
      <ProjectsGrid projects={projectsData} />
    </>
  );
}