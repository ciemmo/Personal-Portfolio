import mongoose, { Schema, models } from "mongoose";

const SiteStatsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    }, // e.g., "yearsExperience", "projectsBuilt", "technologies", "certifications"
    label: {
      type: String,
      required: true,
      trim: true,
    }, // e.g., "Years of Experience", "Projects Built"
    value: {
      type: String,
      required: true,
      trim: true,
    }, // e.g., "5+", "30+", "15+", "10+"
    section: {
      type: String,
      required: true,
      enum: ["hero", "about", "both"],
      default: "both",
    }, // Which section(s) this stat applies to
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
SiteStatsSchema.index({ section: 1, displayOrder: 1 });

// Delete existing model to prevent issues with hot reloading in Next.js development
if (mongoose.models.SiteStats) {
  delete mongoose.models.SiteStats;
}
export default mongoose.model("SiteStats", SiteStatsSchema);