"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useSkills, Skill } from "@/lib/skillData";
import ProficiencyIndicator from "@/components/ui/ProficiencyIndicator";
import { FaHtml5, FaCss3Alt, FaJsSquare, FaReact, FaNodeJs, FaPython, FaJava,
       FaDatabase, FaGitAlt, FaLinux, FaAndroid, FaFigma, FaCloud, FaCode } from "react-icons/fa";
import { SiTypescript, SiMongodb, SiExpress, SiDocker, SiKubernetes, SiSpring,
       SiDotnet, SiRubyonrails, SiLaravel, SiWordpress, SiShopify } from "react-icons/si";
import { TbBrandNextjs, TbBrandCSharp, TbBrandCpp } from "react-icons/tb";
import styles from "./InteractiveSkills.module.css";

// Skill to icon mapping
const skillIcons = {
  // Programming Languages
  "JavaScript": FaJsSquare,
  "TypeScript": SiTypescript,
  "Python": FaPython,
  "Java": FaJava,
  "C#": TbBrandCSharp,
  "C++": TbBrandCpp,
  "HTML": FaHtml5,
  "CSS": FaCss3Alt,
  "SQL": FaDatabase,

  // Frameworks & Libraries
  "React": FaReact,
  "Next.js": TbBrandNextjs,
  "Node.js": FaNodeJs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Spring": SiSpring,
  ".NET": SiDotnet,
  "Ruby on Rails": SiRubyonrails,
  "Laravel": SiLaravel,
  "WordPress": SiWordpress,
  "Shopify": SiShopify,

  // Tools & Platforms
  "Git": FaGitAlt,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "Linux": FaLinux,
  "Android": FaAndroid,
  "Figma": FaFigma,
  "AWS": FaCloud, // Using cloud as generic AWS icon
};

// Helper function to get icon component for a skill
const getSkillIcon = (skillName) => {
  const IconComponent = skillIcons[skillName];
  if (IconComponent) {
    // Handle custom JSX functions
    if (typeof IconComponent === 'function' && IconComponent.name === '') {
      return IconComponent();
    }
    return <IconComponent size={24} className="skill-icon" />;
  }
  // Fallback to a generic code icon
  return <FaCode size={24} className="skill-icon" />;
};

export default function InteractiveSkills() {
  const [selectedRole, setSelectedRole] = useState("frontend");
  const { skills: allSkills, loading, error } = useSkills();

  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = React.useMemo(() => {
    if (!allSkills || allSkills.length === 0) {
      return {
        Languages: [],
        Frameworks: [],
        'DevOps and Cloud': [],
        'Developer Tools': [],
      };
    }

    const grouped: Record<string, Skill[]> = {
      Languages: [],
      Frameworks: [],
      'DevOps and Cloud': [],
      'Developer Tools': [],
    };

    allSkills.forEach(skill => {
      if (grouped[skill.category as keyof typeof grouped]) {
        grouped[skill.category as keyof typeof grouped].push(skill);
      }
    });

    // Sort each category by name
    Object.keys(grouped).forEach(category => {
      (grouped[category as keyof typeof grouped] as Skill[]).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

    return grouped;
  }, [allSkills]);

  if (loading) {
    return (
      <section className={styles.interactiveSkills}>
        <h2 className={styles.title}>Skills Visualization</h2>
        <p className={styles.subtitle}>Loading skills...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.interactiveSkills}>
        <h2 className={styles.title}>Skills Visualization</h2>
        <p className={styles.subtitle}>Error loading skills. Please try again later.</p>
      </section>
    );
  }

  // Return null if no skills data
  if (!allSkills || allSkills.length === 0) {
    return null;
  }

  return (
    <section className={styles.interactiveSkills}>
      <h2 className={styles.title}>Skills Visualization</h2>
      <p className={styles.subtitle}>
        Explore my technical skills organized by role and expertise
      </p>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${selectedRole === "Languages" ? styles.activeTab : ""}`}
          onClick={() => setSelectedRole("Languages")}
          aria-selected={selectedRole === "Languages"}
        >
          Languages
        </button>
        <button
          className={`${styles.tab} ${selectedRole === "Frameworks" ? styles.activeTab : ""}`}
          onClick={() => setSelectedRole("Frameworks")}
          aria-selected={selectedRole === "Frameworks"}
        >
          Frameworks
        </button>
        <button
          className={`${styles.tab} ${selectedRole === "DevOps and Cloud" ? styles.activeTab : ""}`}
          onClick={() => setSelectedRole("DevOps and Cloud")}
          aria-selected={selectedRole === "DevOps and Cloud"}
        >
          DevOps and Cloud
        </button>
        <button
          className={`${styles.tab} ${selectedRole === "Developer Tools" ? styles.activeTab : ""}`}
          onClick={() => setSelectedRole("Developer Tools")}
          aria-selected={selectedRole === "Developer Tools"}
        >
          Developer Tools
        </button>
      </div>

      <div className={styles.skillsContainer}>
        <div className={styles.skillsGrid}>
          {(groupedSkills[selectedRole] || []).map((skill, index) => {
            const proficiencyLevel = skill.proficiency ?? 0;
            return (
              <button
                key={`${selectedRole}-${skill._id}-${index}`}
                className={`${styles.skillCard} ${styles.skillHover}`}
              >
                <div className={styles.skillIcon}>
                  {getSkillIcon(skill.name)}
                </div>
                <div className={styles.skillContent}>
                  <h3 className={styles.skillName}>{skill.name}</h3>
                  <div className={styles.skillMeta}>
                    <ProficiencyIndicator level={proficiencyLevel as 0 | 1 | 2 | 3} size="small" showText={false} />
                    <span className={styles.skillDescription}>
                      {selectedRole === "frontend" && (
                        skill.name.toLowerCase().includes("html") ||
                        skill.name.toLowerCase().includes("css")
                      ) && "Markup & Styling"}
                      {selectedRole === "frontend" &&
                        (skill.name.toLowerCase().includes("javascript") ||
                          skill.name.toLowerCase().includes("typescript")) &&
                        "Programming Language"}
                      {selectedRole === "backend" &&
                        (skill.name.toLowerCase().includes("node") ||
                          skill.name.toLowerCase().includes("express")
                        ) && "Runtime & Framework"}
                      {selectedRole === "devops" &&
                        (skill.name.toLowerCase().includes("docker") ||
                          skill.name.toLowerCase().includes("kubernetes"))
                        && "Containerization & Orchestration"}
                      {selectedRole === "database" &&
                        (skill.name.toLowerCase().includes("sql") ||
                          skill.name.toLowerCase().includes("mongo"))
                        && "Data Storage"}
                      {selectedRole === "mobile" &&
                        (skill.name.toLowerCase().includes("react") ||
                          skill.name.toLowerCase().includes("native"))
                        && "Cross-platform Development"}
                      {selectedRole === "uiux" && skill.name.toLowerCase().includes("figma") && "Design Tool"}
                      {selectedRole === "fullstack" && "Full-stack Development"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.connectionNote}>
        Skills are interconnected with project experience. The skills-based
        filtering in the Projects section allows you to explore work by these
        same categories.
      </p>

      <div className={styles.proficiencyLegend}>
        <h3>Proficiency Levels</h3>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <ProficiencyIndicator level={0} size="small" showText={true} />
            <span>Beginner</span>
          </div>
          <div className={styles.legendItem}>
            <ProficiencyIndicator level={1} size="small" showText={true} />
            <span>Intermediate</span>
          </div>
          <div className={styles.legendItem}>
            <ProficiencyIndicator level={2} size="small" showText={true} />
            <span>Advanced</span>
          </div>
          <div className={styles.legendItem}>
            <ProficiencyIndicator level={3} size="small" showText={true} />
            <span>Expert</span>
          </div>
        </div>
      </div>

      <a href="/projects" className={styles.actionButton}>
        View Projects with Skill Filtering →
      </a>
    </section>
  );
}