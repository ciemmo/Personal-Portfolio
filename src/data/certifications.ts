// Certification data model
export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string; // ISO date
  expirationDate?: string | null; // ISO date (null/undefined for no expiration)
  credentialId?: string; // Unique identifier for verification
  credentialUrl?: string; // URL to verify the certification
  skills: string[]; // Related skills
  description?: string; // Brief description of what the certification covers
  logoUrl?: string; // Organization logo or certification badge
  color?: string; // Theme color for the badge (optional)
}

// Sample certification data
export const certificationsData: Certification[] = [
  {
    id: "1",
    name: "AWS Certified Solutions Architect - Associate",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2023-05-15",
    expirationDate: "2026-05-15",
    credentialId: "ABCD1234EFGH5678",
    credentialUrl: "https://www.youracclaim.com/badges/abc123",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "Lambda", "CloudFormation"],
    description: "Validates ability to design and deploy scalable systems on AWS",
    logoUrl: "/logos/aws.png",
    color: "#FF9900"
  },
  {
    id: "2",
    name: "Microsoft Certified: Azure Administrator Associate",
    issuingOrganization: "Microsoft",
    issueDate: "2023-02-20",
    expirationDate: "2025-02-20",
    credentialId: "MSFT9876ZYXW5432",
    credentialUrl: "https://learn.microsoft.com/api/credentials/share",
    skills: ["Azure", "Virtual Machines", "Networking", "Storage", "Active Directory"],
    description: "Demonstrates expertise in implementing, managing, and monitoring Azure environments",
    logoUrl: "/logos/microsoft.png",
    color: "#0078D4"
  },
  {
    id: "3",
    name: "Google Cloud Professional Cloud Architect",
    issuingOrganization: "Google Cloud",
    issueDate: "2022-11-03",
    expirationDate: "2025-11-03",
    credentialId: "GCPL5555XXXX3333",
    credentialUrl: "https://www.cloudskillsboost.google/public_profiles",
    skills: ["GCP", "Compute Engine", "Kubernetes Engine", "Cloud Storage", "BigQuery"],
    description: "Validates ability to design, develop, and manage robust solutions on Google Cloud",
    logoUrl: "/logos/google-cloud.png",
    color: "#4285F4"
  },
  {
    id: "4",
    name: "Oracle Certified Professional, Java SE 11 Developer",
    issuingOrganization: "Oracle Corporation",
    issueDate: "2022-08-10",
    expirationDate: null, // No expiration
    credentialId: "ORCL7777YYYY8888",
    credentialUrl: "https://education.oracle.com",
    skills: ["Java", "OOP", "Collections", "Streams", "Lambda", "JDBC"],
    description: "Certifies proficiency in Java programming and software development",
    logoUrl: "/logos/oracle.png",
    color: "#D04A02"
  },
  {
    id: "5",
    name: "Certified Kubernetes Administrator (CKA)",
    issuingOrganization: "Cloud Native Computing Foundation",
    issueDate: "2023-01-22",
    expirationDate: "2025-01-22",
    credentialId: "CNCF1111ZZZZ2222",
    credentialUrl: "https://www.cncf.io/certification/cka",
    skills: ["Kubernetes", "Docker", "YAML", "Pods", "Deployments", "Services", "Ingress"],
    description: "Validates ability to perform the responsibilities of a Kubernetes administrator",
    logoUrl: "/logos/cncf.png",
    color: "#326CE5"
  }
];

// Continuing Education / Coursework data
export interface ContinuingEducation {
  id: string;
  name: string;
  provider: string;
  completionDate: string; // ISO date
  hours?: number; // Credit hours or duration
  skills: string[]; // Skills gained
  description?: string; // Brief description
  certificateUrl?: string; // URL to certificate if available
  logoUrl?: string; // Provider logo
}

export const continuingEducationData: ContinuingEducation[] = [
  {
    id: "ce1",
    name: "Advanced React Patterns",
    provider: "Frontend Masters",
    completionDate: "2023-06-30",
    hours: 8,
    skills: ["React", "Hooks", "Context API", "Performance Optimization"],
    description: "Advanced techniques for building scalable React applications",
    certificateUrl: "https://frontendmasters.com/certificates/advanced-react",
    logoUrl: "/logos/frontend-masters.png"
  },
  {
    id: "ce2",
    name: "Database Design and Optimization",
    provider: "Coursera (University of Colorado)",
    completionDate: "2023-04-15",
    hours: 20,
    skills: ["SQL", "Database Design", "Normalization", "Indexing", "Query Optimization"],
    description: "Comprehensive course on relational database design and performance tuning",
    certificateUrl: "https://coursera.org/verify/database-design",
    logoUrl: "/logos/coursera.png"
  },
  {
    id: "ce3",
    name: "Machine Learning Fundamentals",
    provider: "edX (MIT)",
    completionDate: "2023-03-10",
    hours: 40,
    skills: ["Python", "Machine Learning", "TensorFlow", "Scikit-learn", "Data Analysis"],
    description: "Introduction to machine learning algorithms and applications",
    certificateUrl: "https://edx.org/certificate/ml-fundamentals",
    logoUrl: "/logos/mit.png"
  }
];