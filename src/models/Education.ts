import mongoose, { Schema, models } from "mongoose";

const EducationSchema = new Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    startDate: {
      type: String, // ISO date string or year/month format
      required: true
    },
    endDate: {
      type: String, // ISO date string or year/month format (null/undefined for current)
      default: null
    },
    location: {
      type: String,
      trim: true
    },
    description: {
      type: String
    },
    honors: [{
      type: String,
      trim: true
    }],
    gpa: {
      type: String, // Store as string to preserve formatting like "3.8/4.0"
      trim: true
    },
    activities: [{
      type: String,
      trim: true
    }],
    certificateUrl: {
      type: String, // URL to verify degree/certificate
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster querying by institution and degree
EducationSchema.index({ institution: 1, degree: 1 });

export default models.Education || mongoose.model("Education", EducationSchema);