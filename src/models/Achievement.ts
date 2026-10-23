import mongoose, { Schema, models } from "mongoose";

const AchievementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    date: {
      type: String, // ISO date string or year
      required: true
    },
    category: {
      type: String, // e.g., "award", "certification", "milestone", "education", "publication"
      trim: true
    },
    icon: {
      type: String, // Emoji or icon identifier
      trim: true
    },
    url: {
      type: String, // Link to certificate, award page, etc.
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster querying
AchievementSchema.index({ category: 1, title: 1 });
AchievementSchema.index({ date: -1 }); // For sorting by date

export default models.Achievement || mongoose.model("Achievement", AchievementSchema);