// Role-based mapping (for InteractiveSkills component)
export const skillRoles: Record<string, string[]> = {
  Languages: [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Scala",
    // Markup & Query Languages
    "HTML",
    "CSS",
    "SQL",
    "GraphQL",
  ],
  Frameworks: [
    // Frontend Frameworks & Libraries
    "React",
    "Next.js",
    "Vue.js",
    "Svelte",
    "Angular",
    // UI Libraries
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Ant Design",
    "Chakra UI",
    // Backend Frameworks
    "Node.js",
    "Express.js",
    "NestJS",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    ".NET",
    "Laravel",
    "Ruby on Rails",
    // Testing Frameworks
    "Jest",
    "Mocha",
    "Chai",
    "JUnit",
    "TestNG",
    "Cypress",
    "Playwright",
    // Mobile Frameworks
    "React Native",
    "Flutter",
    "Ionic",
    // Database Frameworks/Tools
    "Prisma",
    "Mongoose",
    "Sequelize",
  ],
  "DevOps and Cloud": [
    // Cloud Platforms
    "AWS",
    "Azure",
    "Google Cloud",
    "Firebase",
    // Containerization & Orchestration
    "Docker",
    "Kubernetes",
    // Infrastructure as Code
    "Terraform",
    "Ansible",
    "Pulumi",
    // CI/CD
    "Jenkins",
    "Travis CI",
    "GitLab CI",
    "GitHub Actions",
    "CircleCI",
    // Monitoring & Logging
    "Prometheus",
    "Grafana",
    "ELK Stack",
    "Datadog",
    "New Relic",
    // Operating Systems & Servers
    "Linux",
    "Ubuntu",
    "CentOS",
    "Windows Server",
    "NGINX",
    "Apache",
    // Other DevOps Tools
    "Helm",
    "Istio",
    "Consul",
    "Nomad",
  ],
  "Developer Tools": [
    // Version Control
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    // IDEs & Editors
    "VS Code",
    "WebStorm",
    "IntelliJ IDEA",
    "Eclipse",
    "Vim",
    "Neovim",
    // API Tools
    "Postman",
    "Insomnia",
    // Design & Prototyping
    "Figma",
    "Adobe XD",
    "Sketch",
    "InVision",
    // Testing & Quality Assurance
    "Selenium",
    "Cypress",
    "Jest",
    "Testing Library",
    // Package Managers
    "npm",
    "yarn",
    "pnpm",
    // Build Tools
    "Webpack",
    "Vite",
    "Parcel",
    "Rollup",
    // Databases (as tools)
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    // Other Developer Tools
    "Linux",
    "Windows",
    "macOS",
    "Shell Scripting",
    "Bash",
    "PowerShell",
  ],
};

// Tech-based mapping (for Project detail pages - derived from role-based)
export const skillRolesByTech: Record<string, string[]> = (() => {
  const techMap: Record<string, string[]> = {};

  // Initialize all techs with empty arrays
  Object.values(skillRoles).forEach(roles => {
    roles.forEach(tech => {
      if (!techMap[tech]) {
        techMap[tech] = [];
      }
    });
  });

  // Populate the mapping
  Object.entries(skillRoles).forEach(([role, techs]) => {
    techs.forEach(tech => {
      if (techMap[tech]) {
        techMap[tech].push(role as string);
      }
    });
  });

  return techMap;
})();

// Icon mapping (for Project detail pages)
export const skillIcons: Record<string, string> = {
  // Frontend
  "HTML": "⌘",
  "CSS": "●",
  "JavaScript": "⬢",
  "TypeScript": "⬢",
  "React": "⚛",
  "Next.js": "⚡",
  "Vue.js": "⚪",
  "Svelte": "⚫",
  "Angular": "⬢",
  "Tailwind CSS": "◬",
  "Bootstrap": "⬢",
  "Material UI": "◼",
  "Ant Design": "◼",
  "Chakra UI": "◼",
  "Redux": "◻",
  "Zustand": "◼",
  "GraphQL": "▣",
  "REST API": "⌬",
  "Webpack": "⬥",
  "Vite": "⚡",
  "Parcel": "📦",
  "Ruby": "◇",
  "Scala": "◆",
  // Testing Frameworks
  "Jest": "▣",
  "Cypress": "▣",
  "Playwright": "▣",
  "Testing Library": "▣",
  "TestNG": "▣",

  // Backend
  "Node.js": "⬢",
  "Express.js": "⬢",
  "NestJS": "⬢",
  "Python": "■",
  "Django": "■",
  "FastAPI": "■",
  "Flask": "■",
  "C++": "⚙", // Custom
  "Ruby on Rails": "◇",
  "Java": "▣",
  "Spring Boot": "▣",
  "C#": "🔷", // Custom since no perfect icon
  ".NET": "⬢",
  "PHP": "◇",
  "Laravel": "◇",
  "Go": "○",
  "Rust": "▥",
  "PostgreSQL": "▣",
  "MySQL": "▣",
  "MongoDB": "◇",
  "Redis": "◇",
  "Elasticsearch": "▣",
  "WebSockets": "∿",
  "AWS": "○",
  "Docker": "⬢",
  "Kubernetes": "ζ",
  "CI/CD": "○",

  // DevOps
  "Azure": "○",
  "Google Cloud": "○",
  "Jenkins": "☩",
  "Travis CI": "○",
  "CircleCI": "○",
  "GitLab CI": "◇",
  "GitHub Actions": "○",
  "Terraform": "⬥",
  "Pulumi": "⬥",
  "Ansible": "◇",
  "Prometheus": "▣",
  "Grafana": "▣",
  "Datadog": "▣",
  "New Relic": "▣",
  "ELK Stack": "▣",
  "NGINX": "▣",
  "Apache": "▣",
  "Linux": "▣",
  "Ubuntu": "▣",
  "CentOS": "▣",
  "Windows Server": "▣",
  "Bash": "▣",
  "Shell Scripting": "▣",
  "Monitoring": "▣",
  "Logging": "▣",
  "Security": "▣",
  "Networking": "▣",
  "Load Balancing": "▣",
  "Helm": "▣",
  "Istio": "▣",
  "Consul": "▣",
  "Nomad": "▣",

  // Database
  "Cassandra": "▣",
  "DynamoDB": "▣",
  "Firebase": "▣",
  "SQLite": "▣",
  "MariaDB": "▣",
  "Oracle": "▣",
  "SQL Server": "▣",
  "Graph Databases": "▣",
  "Time Series Databases": "▣",

  // Mobile
  "React Native": "⚛",
  "Flutter": "▣",
  "Ionic": "▣",
  "Swift": "▣",
  "Kotlin": "▣",
  "Java Android": "▣",
  "Objective-C": "▣",
  "Xamarin": "▣",
  "NativeScript": "▣",
  "Expo": "▣",
  "Capacitor": "▣",
  "PhoneGap": "▣",
  "Mobile UI/UX": "▣",
  "App Store Deployment": "▣",
  "Play Store Deployment": "▣",
  "Push Notifications": "▣",
  "Offline Storage": "▣",
  "Background Processing": "▣",
  "Native Modules": "▣",

  // UI/UX
  "Figma": "▣",
  "Adobe XD": "▣",
  "Sketch": "▣",
  "InVision": "▣",
  "Photoshop": "▣",
  "Illustrator": "▣",
  "User Research": "▣",
  "Wireframing": "▣",
  "Prototyping": "▣",
  "Usability Testing": "▣",
  "Interaction Design": "▣",
  "Visual Design": "▣",
  "Typography": "▣",
  "Color Theory": "▣",
  "Design Systems": "▣",
  "Accessibility": "▣",
  "Responsive Design": "▣",
  "Motion Design": "▣",
  "Microinteractions": "▣",
  "Design Thinking": "▣",

  // Fullstack
  "Full-stack Development": "▣",
  "REST API Development": "⬢",
  "GraphQL Development": "▣",
  "Real-time Applications": "∿",
  "Authentication & Authorization": "▣",
  "Payment Processing": "▣",
  "File Uploads": "▣",
  "Email Services": "▣",
  "Caching Strategies": "▣",
  "Database Optimization": "▣",
  "API Documentation": "▣",
  "Testing Strategies": "▣",
  "Deployment Strategies": "▣",
  "Performance Optimization": "▣",
  "Security Best Practices": "▣",
  // Developer Tools
  "Bitbucket": "▣",
  "WebStorm": "▣",
  "IntelliJ IDEA": "▣",
  "Eclipse": "▣",
  "Vim": "▣",
  "Neovim": "▣",
  "Insomnia": "▣",
  "Rollup": "▣",
  "PowerShell": "▣",
};