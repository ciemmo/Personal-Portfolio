// Work experience data model
export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string; // ISO date or year/month format
  endDate?: string | null; // ISO date or year/month format (null/undefined for current position)
  duration: string; // Formatted duration string (e.g., "Jan 2020 - Present", "2 years 6 months")
  responsibilities: string[]; // List of key responsibilities/achievements
  technologies: string[]; // List of technologies used
  highlights?: string[]; // Optional: notable achievements or highlights
  url?: string; // Company website URL
  logo?: string; // Company logo path or URL
}

// Sample work experience data
export const workExperienceData: WorkExperience[] = [
  {
    id: "1",
    company: "Tech Innovations Inc.",
    role: "Senior Software Engineer",
    location: "San Francisco, CA",
    startDate: "2022-03",
    endDate: null, // Current position
    duration: "Mar 2022 - Present",
    responsibilities: [
      "Led a team of 5 engineers in developing a microservices architecture for a cloud-based SaaS platform",
      "Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 70%",
      "Optimized database queries and implemented caching strategies, improving API response times by 40%",
      "Conducted code reviews and mentored junior developers on best practices and code quality",
      "Collaborated with product and design teams to define feature requirements and technical specifications"
    ],
    technologies: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GraphQL"],
    highlights: [
      "Reduced infrastructure costs by 30% through resource optimization",
      "Implemented feature that increased user engagement by 25%",
      "Received 'Employee of the Quarter' award twice in 2023"
    ],
    url: "https://techinnovations.example.com",
    logo: "/logos/tech-innovations.png"
  },
  {
    id: "2",
    company: "WebSolutions Agency",
    role: "Full Stack Developer",
    location: "Remote",
    startDate: "2020-06",
    endDate: "2022-02",
    duration: "Jun 2020 - Feb 2022",
    responsibilities: [
      "Developed and maintained 15+ client websites using React, Node.js, and MongoDB",
      "Implemented responsive designs that improved mobile conversion rates by 35%",
      "Created reusable component library that decreased development time by 25%",
      "Integrated payment gateways (Stripe, PayPal) for e-commerce clients",
      "Performed website optimization and SEO improvements for better search rankings"
    ],
    technologies: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "HTML5", "CSS3", "Bootstrap"],
    highlights: [
      "Maintained 95% client satisfaction rate across all projects",
      "Delivered all projects 2 weeks ahead of schedule on average",
      "Specialized in e-commerce solutions with average client revenue increase of 40%"
    ],
    url: "https://websolutions.example.com",
    logo: "/logos/websolutions.png"
  },
  {
    id: "3",
    company: "StartupXYZ",
    role: "Frontend Developer Intern",
    location: "New York, NY",
    startDate: "2019-05",
    endDate: "2019-08",
    duration: "May 2019 - Aug 2019",
    responsibilities: [
      "Assisted in developing a customer portal using React and Redux",
      "Implemented form validation and error handling systems",
      "Created data visualization dashboards using Chart.js and D3.js",
      "Participated in agile development processes and daily standups",
      "Conducted user testing and incorporated feedback into product improvements"
    ],
    technologies: ["React", "Redux", "JavaScript", "HTML5", "CSS3", "Chart.js", "D3.js"],
    highlights: [
      "Completed internship with full-time offer (chose to continue education)",
      "Received positive feedback on ability to learn quickly and contribute effectively"
    ],
    url: "https://startupxyz.example.com",
    logo: "/logos/startup-xyz.png"
  }
];