import mongoose, { Schema, models } from "mongoose";

const ProjectSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        longDescription: { type: String, required: true },
        tech: { type: [String], required: true },
        skillRoles: { type: [String] },
        github: { type: String },
        demo: { type: String },
        image: { type: String },
    },
    { timestamps: true }
);

export default models.Project || mongoose.model("Project", ProjectSchema);
