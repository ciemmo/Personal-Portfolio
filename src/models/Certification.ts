import mongoose, { Schema, models } from "mongoose";

const CertificationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: String, // ISO date
      required: true
    },
    expirationDate: {
      type: String, // ISO date (null/undefined for no expiration)
      default: null
    },
    credentialId: {
      type: String, // Unique identifier for verification
      trim: true
    },
    credentialUrl: {
      type: String, // URL to verify the certification
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    description: {
      type: String
    },
    logoUrl: {
      type: String, // Organization logo or certification badge
      trim: true
    },
    color: {
      type: String, // Theme color for the badge (optional)
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster querying by name and issuing organization
CertificationSchema.index({ name: 1, issuingOrganization: 1 });

export default models.Certification || mongoose.model("Certification", CertificationSchema);