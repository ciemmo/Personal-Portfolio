import mongoose, { Schema, models } from "mongoose";

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        // Core categories
        'Languages',
        'Frameworks',
        'DevOps and Cloud',
        'Developer Tools',
        // New categories
        'AI and Machine Learning',
        'Data Science',
        'Databases',
        'Mobile',
        'Testing',
        'UI/UX Design',
        'Architecture',
        'Other'
      ]
    },
    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    }, // 0: Beginner, 1: Intermediate, 2: Advanced, 3: Expert
    description: {
      type: String
    },
    icon: {
      type: String
    }, // URL or emoji for skill icon
    color: {
      type: String
    }, // Hex color for skill badge
    isFeatured: {
      type: Boolean,
      default: false
    },
    // For tracking when proficiency was last updated
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for faster querying by category
SkillSchema.index({ category: 1 });

// Delete existing model to prevent issues with hot reloading in Next.js development
if (mongoose.models.Skill) {
  delete mongoose.models.Skill;
}
export default mongoose.model("Skill", SkillSchema);