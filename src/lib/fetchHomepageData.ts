import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Achievement from "@/models/Achievement";
import Certification from "@/models/Certification";
import WorkExperience from "@/models/WorkExperience";
import Education from "@/models/Education";
import ContinuingEducation from "@/models/ContinuingEducation";
import SiteStats from "@/models/SiteStats";

/**
 * Server-side data fetching for homepage
 * Fetches all section data in parallel to eliminate waterfall requests
 */

export interface HomepageData {
  projects: ProjectData[];
  skills: SkillData[];
  achievements: AchievementData[];
  certifications: CertificationData[];
  workExperience: WorkExperienceData[];
  education: EducationData[];
  continuingEducation: ContinuingEducationData[];
  stats: SiteStatsData[];
}

export interface ProjectData {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  skillRoles: string[];
  github?: string;
  demo?: string;
  image?: string;
  _id?: string;
  createdAt?: string;
  featured?: boolean;
  category?: string;
}

export interface SkillData {
  _id: string;
  id: string; // alias for _id
  name: string;
  category: string;
  proficiency: number;
  description?: string;
  icon?: string;
  color?: string;
  isFeatured?: boolean;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementData {
  _id: string;
  id: string; // alias for _id to match UnifiedAchievement
  title: string;
  description?: string;
  date: string;
  category?: string;
  icon?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationData {
  _id: string;
  id: string; // alias for _id
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  description?: string;
  logoUrl?: string;
  color?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperienceData {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  duration: string;
  responsibilities: string[];
  technologies: string[];
  highlights?: string[];
  url?: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationData {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  description?: string;
  honors?: string[];
  gpa?: string;
  activities?: string[];
  certificateUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContinuingEducationData {
  _id: string;
  id: string; // alias for _id
  name: string; // alias for institution
  provider: string; // alias for institution
  completionDate: string; // alias for startDate
  skills: string[];
  description?: string;
  certificateUrl?: string;
  logoUrl?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteStatsData {
  _id: string;
  id: string; // alias for _id
  key: string;
  label: string;
  value: string;
  section: "hero" | "about" | "both";
  displayOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Convert Mongoose document to plain object with stringified IDs and dates
 * Handles both Mongoose documents (with toObject()) and lean() plain objects
 */
function toPlainObject<T extends { _id?: unknown; createdAt?: Date | string; updatedAt?: Date | string; lastUpdated?: Date | string }>(doc: T): T & { _id: string; id: string; createdAt: string; updatedAt: string; lastUpdated: string } {
  // When using .lean(), doc is already a plain object, not a Mongoose document
  const obj = doc as any;
  const id = obj._id?.toString() || "";
  return {
    ...obj,
    _id: id,
    id: id,
    createdAt: obj.createdAt ? new Date(obj.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt).toISOString() : new Date().toISOString(),
    lastUpdated: obj.lastUpdated ? new Date(obj.lastUpdated).toISOString() : new Date().toISOString(),
  };
}

/**
 * Fetch all homepage data in parallel
 */
export async function fetchHomepageData(): Promise<HomepageData> {
  try {
    await connectDB();

    const [
      projectsData,
      skillsData,
      achievementsData,
      certificationsData,
      workExperienceData,
      educationData,
      continuingEducationData,
      statsData,
    ] = await Promise.all([
      Project.find({}).sort({ createdAt: -1 }).lean(),
      Skill.find({}).sort({ category: 1, name: 1 }).lean(),
      Achievement.find({}).sort({ date: -1 }).lean(),
      Certification.find({}).sort({ name: 1 }).lean(),
      WorkExperience.find({}).sort({ startDate: -1 }).lean(),
      Education.find({}).sort({ startDate: -1 }).lean(),
      ContinuingEducation.find({}).sort({ startDate: -1 }).lean(),
      SiteStats.find({ isVisible: true }).sort({ displayOrder: 1 }).lean(),
    ]);

    return {
      projects: projectsData.map(toPlainObject) as ProjectData[],
      skills: skillsData.map(toPlainObject) as SkillData[],
      achievements: achievementsData.map(toPlainObject) as AchievementData[],
      certifications: certificationsData.map(toPlainObject) as CertificationData[],
      workExperience: workExperienceData.map(toPlainObject) as WorkExperienceData[],
      education: educationData.map(toPlainObject) as EducationData[],
      continuingEducation: continuingEducationData.map(toPlainObject) as ContinuingEducationData[],
      stats: statsData.map(toPlainObject) as SiteStatsData[],
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      projects: [],
      skills: [],
      achievements: [],
      certifications: [],
      workExperience: [],
      education: [],
      continuingEducation: [],
      stats: [],
    };
  }
}

/**
 * Fetch projects data for projects page
 */
export async function fetchProjectsData(): Promise<ProjectData[]> {
  try {
    await connectDB();
    const projectsData = await Project.find({}).sort({ createdAt: -1 }).lean();
    return projectsData.map(toPlainObject) as ProjectData[];
  } catch (error) {
    console.error("Error fetching projects data:", error);
    return [];
  }
}

/**
 * Fetch single project by slug
 */
export async function fetchProjectBySlug(slug: string): Promise<ProjectData | null> {
  try {
    await connectDB();
    const project = await Project.findOne({ slug }).lean();
    if (!project) return null;
    return toPlainObject(project) as ProjectData;
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}