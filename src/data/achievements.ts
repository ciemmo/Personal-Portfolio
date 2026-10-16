/**
 * Achievements data
 * Contains key achievements, awards, certifications, and milestones
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string or year
  category?: string; // e.g., "award", "certification", "milestone", "education", "publication"
  icon?: string; // Emoji or icon identifier
  url?: string; // Link to certificate, award page, etc.
}

/**
 * Sample achievements data
 * In a real application, this might come from a database or CMS
 */
export const achievements: Achievement[] = [
  {
    id: "graduation",
    title: "Bachelor of Science in Computer Science",
    description: "Graduated with honors from University of Technology",
    date: "2023",
    category: "education",
    icon: "🎓",
    url: "https://example.edu/credentials/bs-cs"
  },
  {
    id: "aws-cert",
    title: "AWS Certified Solutions Architect",
    description: "Achieved AWS Solutions Architect Associate certification",
    date: "2024-03-15",
    category: "certification",
    icon: "☁️",
    url: "https://www.credly.com/badges/aws-solutions-architect-associate"
  },
  {
    id: "oss-contribution",
    title: "Open Source Contributor",
    description: "Regular contributor to multiple open source projects with over 100 merged pull requests",
    date: "2022-2024",
    category: "milestone",
    icon: "🐙",
    url: "https://github.com/emmanuel"
  },
  {
    id: "hackathon-winner",
    title: "Hackathon First Place",
    description: "Won first place at the 2023 Regional Tech Hackathon for innovative AI-powered accessibility solution",
    date: "2023-11-10",
    category: "award",
    icon: "🏆",
    url: "https://example.com/hackathon2023/winners"
  },
  {
    id: "tech-talk",
    title: "Technical Conference Speaker",
    description: "Presented 'Modern Approaches to Full-Stack Development' at DevCon 2024",
    date: "2024-05-22",
    category: "publication",
    icon: "🎤",
    url: "https://devcon2024.com/speakers/emmanuel"
  },
  {
    id: "leadership-role",
    title: "Technical Team Lead",
    description: "Led a team of 5 developers in delivering a successful e-commerce platform for local business",
    date: "2023-08-01 to 2024-03-31",
    category: "milestone",
    icon: "👥",
    url: undefined
  }
];