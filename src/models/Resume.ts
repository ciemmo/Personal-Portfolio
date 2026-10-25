import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    // Personal Info
    fullName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    summary: {
      type: String
    },

    // Experience
    experience: [{
      company: { type: String, trim: true },
      role: { type: String, trim: true },
      location: { type: String, trim: true },
      startDate: { type: String, trim: true },
      endDate: { type: String, trim: true },
      duration: { type: String, trim: true },
      responsibilities: [{ type: String, trim: true }],
      technologies: [{ type: String, trim: true }],
      highlights: [{ type: String, trim: true }],
      url: { type: String, trim: true },
      logo: { type: String, trim: true }
    }],

    // Education
    education: [{
      institution: { type: String, trim: true },
      degree: { type: String, trim: true },
      fieldOfStudy: { type: String, trim: true },
      startDate: { type: String, trim: true },
      endDate: { type: String, trim: true },
      location: { type: String, trim: true },
      description: { type: String, trim: true },
      honors: [{ type: String, trim: true }],
      gpa: { type: String, trim: true },
      activities: [{ type: String, trim: true }],
      certificateUrl: { type: String, trim: true }
    }],

    // Certifications
    certifications: [{
      name: { type: String, trim: true },
      issuingOrganization: { type: String, trim: true },
      issueDate: { type: String, trim: true },
      expirationDate: { type: String, trim: true },
      credentialId: { type: String, trim: true },
      credentialUrl: { type: String, trim: true },
      skills: [{ type: String, trim: true }],
      description: { type: String, trim: true },
      logoUrl: { type: String, trim: true },
      color: { type: String, trim: true }
    }],

    // Skills
    skills: [{
      name: { type: String, trim: true },
      category: { type: String, trim: true },
      proficiency: { type: Number, min: 1, max: 5 },
      icon: { type: String, trim: true }
    }],

    // Projects
    projects: [{
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      longDescription: { type: String, trim: true },
      tech: [{ type: String, trim: true }],
      skillRoles: [{ type: String, trim: true }],
      github: { type: String, trim: true },
      demo: { type: String, trim: true },
      image: { type: String, trim: true },
      featured: { type: Boolean, default: false },
      category: { type: String, trim: true }
    }],

    // Achievements
    achievements: [{
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      date: { type: String, trim: true },
      organization: { type: String, trim: true },
      category: { type: String, trim: true },
      icon: { type: String, trim: true }
    }]
  },
  {
    timestamps: true
  }
);

// Index for faster querying (single document, but useful for findOne)
ResumeSchema.index({ updatedAt: -1 });

export default models.Resume || mongoose.model("Resume", ResumeSchema);