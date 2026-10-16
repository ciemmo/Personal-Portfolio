/**
 * Utility for managing skill proficiency data
 * Stores proficiency levels in localStorage with fallback to default values
 */

export type ProficiencyLevel = 0 | 1 | 2 | 3; // 0: Beginner, 1: Intermediate, 2: Advanced, 3: Expert

export interface SkillWithProficiency {
  name: string;
  proficiency: ProficiencyLevel;
}

/**
 * Default proficiency levels for skills
 * These serve as fallbacks when no user preference is set
 */
const defaultProficiencies: Record<string, ProficiencyLevel> = {
  // Frontend
  HTML: 3,
  CSS: 3,
  JavaScript: 3,
  TypeScript: 3,
  React: 3,
  "Next.js": 3,
  "Vue.js": 2,
  Svelte: 1,
  "Tailwind CSS": 3,
  Bootstrap: 2,
  "Material UI": 2,
  Redux: 2,
  Zustand: 1,
  "GraphQL": 2,
  "REST API": 3,
  Webpack: 2,
  Vite: 2,
  Parcel: 1,
  ESLint: 2,
  Prettier: 2,
  "Jest": 2,
  "React Testing Library": 2,
  Cypress: 2,
  Playwright: 2,

  // Backend
  "Node.js": 3,
  "Express.js": 3,
  Python: 2,
  Django: 2,
  Flask: 2,
  "Ruby on Rails": 1,
  Java: 2,
  "Spring Boot": 2,
  "C#": 2,
  ".NET": 2,
  PHP: 1,
  Laravel: 1,
  Go: 2,
  Rust: 2,
  PostgreSQL: 2,
  MySQL: 2,
  MongoDB: 2,
  Redis: 2,
  Elasticsearch: 2,
  WebSockets: 2,
  AWS: 2,
  Docker: 3,
  Kubernetes: 2,
  "CI/CD": 2,

  // DevOps
  Azure: 2,
  "Google Cloud": 2,
  Jenkins: 2,
  "GitLab CI": 2,
  "GitHub Actions": 3,
  Terraform: 2,
  Ansible: 2,
  Prometheus: 2,
  Grafana: 2,
  "ELK Stack": 1,
  NGINX: 2,
  Apache: 2,
  Linux: 2,
  "Bash": 2,
  "Shell Scripting": 2,
  Monitoring: 2,
  Logging: 2,
  Security: 2,
  Networking: 2,
  "Load Balancing": 2,

  // Database
  Cassandra: 1,
  DynamoDB: 2,
  Firebase: 2,
  SQLite: 1,
  MariaDB: 2,
  Oracle: 1,
  "SQL Server": 1,
  "Graph Databases": 1,
  "Time Series Databases": 1,

  // Mobile
  "React Native": 2,
  Flutter: 2,
  Ionic: 1,
  Swift: 1,
  Kotlin: 2,
  "Java Android": 2,
  "Objective-C": 1,
  Xamarin: 1,
  NativeScript: 1,
  Expo: 2,
  Capacitor: 1,
  PhoneGap: 1,
  "Mobile UI/UX": 1,
  "App Store Deployment": 1,
  "Play Store Deployment": 1,
  "Push Notifications": 1,
  "Offline Storage": 2,
  "Background Processing": 2,
  "Native Modules": 1,

  // UI/UX
  Figma: 3,
  "Adobe XD": 2,
  Sketch: 1,
  InVision: 1,
  Photoshop: 2,
  Illustrator: 2,
  "User Research": 2,
  Wireframing: 2,
  Prototyping: 2,
  "Usability Testing": 2,
  "Interaction Design": 2,
  "Visual Design": 2,
  Typography: 2,
  "Color Theory": 2,
  "Design Systems": 2,
  Accessibility: 2,
  "Responsive Design": 2,
  "Motion Design": 1,
  "Microinteractions": 1,
  "Design Thinking": 2,

  // Fullstack
  "Full-stack Development": 3,
  "REST API Development": 3,
  "GraphQL Development": 2,
  "Real-time Applications": 2,
  "Authentication & Authorization": 2,
  "Payment Processing": 2,
  "File Uploads": 2,
  "Email Services": 2,
  "Caching Strategies": 2,
  "Database Optimization": 2,
  "API Documentation": 2,
  "Testing Strategies": 2,
  "Deployment Strategies": 2,
  "Performance Optimization": 2,
  "Security Best Practices": 2,
};

/**
 * Get proficiency level for a skill from localStorage
 * Falls back to default proficiency if not found
 */
export function getSkillProficiency(skillName: string): ProficiencyLevel {
  if (typeof window === "undefined") {
    // Server-side rendering
    return defaultProficiencies[skillName] || 0;
  }

  try {
    const stored = localStorage.getItem("skillProficiencies");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed[skillName] === "number" &&
          parsed[skillName] >= 0 && parsed[skillName] <= 3) {
        return parsed[skillName] as ProficiencyLevel;
      }
    }
  } catch (error) {
    console.warn("Error reading skill proficiencies from localStorage:", error);
  }

  // Return default proficiency
  return defaultProficiencies[skillName] || 0;
}

/**
 * Set proficiency level for a skill in localStorage
 */
export function setSkillProficiency(skillName: string, level: ProficiencyLevel): void {
  if (typeof window === "undefined") {
    // Server-side rendering
    return;
  }

  try {
    const stored = localStorage.getItem("skillProficiencies");
    let proficiencies = stored ? JSON.parse(stored) : {};

    proficiencies[skillName] = level;
    localStorage.setItem("skillProficiencies", JSON.stringify(proficiencies));
  } catch (error) {
    console.error("Error saving skill proficiencies to localStorage:", error);
  }
}

/**
 * Get all skill proficiencies from localStorage
 */
export function getAllSkillProficiencies(): Record<string, ProficiencyLevel> {
  if (typeof window === "undefined") {
    return defaultProficiencies;
  }

  try {
    const stored = localStorage.getItem("skillProficiencies");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        // Merge with defaults to ensure all skills have values
        return { ...defaultProficiencies, ...parsed };
      }
    }
  } catch (error) {
    console.warn("Error reading skill proficiencies from localStorage:", error);
  }

  return { ...defaultProficiencies };
}

/**
 * Reset all skill proficiencies to default values
 */
export function resetSkillProficiencies(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem("skillProficiencies");
  } catch (error) {
    console.error("Error resetting skill proficiencies:", error);
  }
}