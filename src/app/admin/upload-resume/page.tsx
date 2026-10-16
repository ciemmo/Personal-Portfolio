"use client";

import { useState } from "react";

export default function UploadResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    const formData = new FormData();
    const fileInput = document.getElementById("resume-file") as HTMLInputElement | null;

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setUploadError("Please select a resume file to upload");
      setIsUploading(false);
      return;
    }

    const file = fileInput.files[0];

    // Validate file type
    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed for resume upload");
      setIsUploading(false);
      return;
    }

    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setResumeUrl(result.url);
        setUploadSuccess(true);
        // Clear the file input
        fileInput.value = "";
      } else {
        setUploadError(result.error || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-resume-page">
      <div className="container">
        {uploadSuccess && resumeUrl ? (
          <div className="success-message">
            <h2>Resume Uploaded Successfully!</h2>
            <p>Your resume has been uploaded and is now available on your portfolio.</p>
            <div className="resume-info">
              <p><strong>Resume URL:</strong> <a href={resumeUrl} target="_blank" rel="noopener noreferrer">{resumeUrl}</a></p>
              <p><a href={resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
            </div>
          </div>
        ) : (
          <>
            <h1>Upload Resume</h1>
            <p className="page-description">
              Upload your resume file to replace the missing /resume-emmanuel.pdf file.
              Only PDF files are allowed.
            </p>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label htmlFor="resume-file" className="form-label">
                  Resume File (PDF)
                </label>
                <input
                  type="file"
                  id="resume-file"
                  name="resume-file"
                  accept=".pdf"
                  className={`form-input ${uploadError ? "error" : ""}`}
                  required
                />
                {uploadError && (
                  <span className="error-message">{uploadError}</span>
                )}
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </form>

            {uploadError && (
              <div className="error-message">
                {uploadError}
              </div>
            )}

            <div className="info-box">
              <h3>How to use:</h3>
              <ol>
                <li>Click the "Choose File" button above</li>
                <li>Select your resume PDF file</li>
                <li>Click "Upload Resume"</li>
                <li>Once uploaded, the "View Resume" link in your About section will work</li>
              </ol>
              <p><em>Note: In a production environment, this upload endpoint should be secured with authentication to prevent unauthorized uploads.</em></p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}