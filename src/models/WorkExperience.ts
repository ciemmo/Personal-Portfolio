import mongoose, { Schema, models } from "mongoose";

const WorkExperienceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: String, // ISO date or year/month format
      required: true
    },
    endDate: {
      type: String, // ISO date or year/month format (null/undefined for current position)
      default: null
    },
    duration: {
      type: String, // Formatted duration string (e.g., "Jan 2020 - Present", "2 years 6 months")
      trim: true
    },
    responsibilities: [{
      type: String,
      trim: true
    }],
    technologies: [{
      type: String,
      trim: true
    }],
    highlights: [{
      type: String,
      trim: true
    }],
    url: {
      type: String, // Company website URL
      trim: true
    },
    logo: {
      type: String, // Company logo path or URL
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster querying by company and role
WorkExperienceSchema.index({ company: 1, role: 1 });

export default models.WorkExperience || mongoose.model("WorkExperience", WorkExperienceSchema);