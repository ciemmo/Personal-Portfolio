"use client";

import { useEffect, useState } from "react";
import styles from "./Education.module.css";

// Types
interface Education {
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
  createdAt: string;
  updatedAt: string;
}

export default function AdminEducationContent() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
    honors: [],
    gpa: "",
    activities: [],
    certificateUrl: "",
  });

  // Fetch all educations
  const fetchEducations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/education");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setEducations(data);
    } catch (err) {
      setError("Failed to load educations. Please try again later.");
      console.error("Error fetching educations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;

    if (type === "checkbox") {
      const checkboxTarget = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkboxTarget.checked,
      }));
    } else if (type === "select-one") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "honors" || name === "activities") {
      // Handle comma-separated values for arrays
      setFormData(prev => ({
        ...prev,
        [name]: value
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0),
      }));
    } else {
      // For text inputs and textarea
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.institution || !formData.degree || !formData.startDate) {
      setError("Institution, degree, and start date are required");
      return;
    }

    try {
      if (editingEducationId && editingEducationId !== "ADD_MODE") {
        // Update existing education
        const response = await fetch(`/api/education/${editingEducationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`);
        }

        setEditingEducationId(null);
        setFormData({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          honors: [],
          gpa: "",
          activities: [],
          certificateUrl: "",
        });
      } else {
        // Create new education
        const response = await fetch("/api/education", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create: ${response.statusText}`);
        }

        // Reset form
        setEditingEducationId(null);
        setFormData({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          location: "",
          description: "",
          honors: [],
          gpa: "",
          activities: [],
          certificateUrl: "",
        });
      }

      // Refresh educations list
      await fetchEducations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error saving education:", err);
    }
  };

  // Handle delete education
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchEducations();
    } catch (err) {
      setError("Failed to delete education");
      console.error("Error deleting education:", err);
    }
  };

  // Handle edit education
  const handleEdit = (education: Education) => {
    setEditingEducationId(education._id);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy || "",
      startDate: education.startDate,
      endDate: education.endDate || "",
      location: education.location || "",
      description: education.description || "",
      honors: Array.isArray(education.honors) ? education.honors : [],
      gpa: education.gpa || "",
      activities: Array.isArray(education.activities) ? education.activities : [],
      certificateUrl: education.certificateUrl || "",
    });
  };

  // Load educations on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Standard data fetching pattern on mount
  useEffect(() => {
    fetchEducations();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading educations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchEducations()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Education Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingEducationId("ADD_MODE");
              setFormData({
                institution: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                location: "",
                description: "",
                honors: [],
                gpa: "",
                activities: [],
                certificateUrl: "",
              });
            }}
          >
            Add New Education
          </button>
        </div>
      </div>

      {editingEducationId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingEducationId === "ADD_MODE" ? "Add New Education" : "Edit Education"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="institution" className={styles.label}>
                Institution
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter institution name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="degree" className={styles.label}>
                Degree
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter degree (e.g., Bachelor of Science)"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fieldOfStudy" className={styles.label}>
                Field of Study (optional)
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter field of study or major"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startDate" className={styles.label}>
                Start Date
              </label>
              <input
                type="text"
                id="startDate"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter start date (YYYY or YYYY-MM)"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date (leave blank for current)
              </label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter end date (YYYY or YYYY-MM) or leave blank"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Location (optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter city, country"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Enter description or details"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="honors" className={styles.label}>
                Honors/Awards (comma-separated)
              </label>
              <input
                type="text"
                id="honors"
                name="honors"
                value={Array.isArray(formData.honors) ? formData.honors.join(", ") : formData.honors || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter honors/awards (e.g., Cum Laude, Dean's List)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gpa" className={styles.label}>
                GPA (optional)
              </label>
              <input
                type="text"
                id="gpa"
                name="gpa"
                value={formData.gpa || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter GPA (e.g., 3.8/4.0)"
              />
              <p className={styles.helpText}>Enter as X.X/X.X format (e.g., 3.7/4.0 or 4.0/5.0)</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="activities" className={styles.label}>
                Activities (comma-separated)
              </label>
              <input
                type="text"
                id="activities"
                name="activities"
                value={Array.isArray(formData.activities) ? formData.activities.join(", ") : formData.activities || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter activities (e.g., Student Club, Sports Team)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="certificateUrl" className={styles.label}>
                Certificate URL (optional)
              </label>
              <input
                type="text"
                id="certificateUrl"
                name="certificateUrl"
                value={formData.certificateUrl || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter URL to verify degree/certificate"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                {editingEducationId ? "Update Education" : "Add Education"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingEducationId(null);
                  setFormData({
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    location: "",
                    description: "",
                    honors: [],
                    gpa: "",
                    activities: [],
                    certificateUrl: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.educationsList}>
        <h2 className={styles.sectionTitle}>All Educations ({educations.length})</h2>
        {educations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No educations found. Add your first education above!</p>
          </div>
        ) : (
          <div className={styles.educationsGrid}>
            {educations.map(edu => (
              <div key={edu._id} className={styles.educationCard}>
                <div className={styles.educationHeader}>
                  <h3 className={styles.educationDegree}>{edu.degree}</h3>
                  <div className={styles.educationMeta}>
                    <span className={styles.educationInstitution}>
                      {edu.institution}
                    </span>
                    {edu.fieldOfStudy && (
                      <span className={styles.educationField}>
                        {edu.fieldOfStudy}
                      </span>
                    )}
                  </div>
                </div>

                {edu.description && (
                  <div className={styles.educationDescription}>
                    <p>{edu.description}</p>
                  </div>
                )}

                <div className={styles.educationDetails}>
                  <div className={styles.detailItem}>
                    <strong>Period:</strong>
                    <span>
                      {edu.startDate}{" "}
                      {edu.endDate ? `– ${edu.endDate}` : "– Present"}
                    </span>
                  </div>
                  {edu.location && (
                    <div className={styles.detailItem}>
                      <strong>Location:</strong>
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {edu.honors && edu.honors.length > 0 && (
                    <div className={styles.detailItem}>
                      <strong>Honors:</strong>
                      <span>{edu.honors.join(", ")}</span>
                    </div>
                  )}
                  {edu.gpa && (
                    <div className={styles.detailItem}>
                      <strong>GPA:</strong>
                      <span>{edu.gpa}</span>
                    </div>
                  )}
                  {edu.activities && edu.activities.length > 0 && (
                    <div className={styles.detailItem}>
                      <strong>Activities:</strong>
                      <span>{edu.activities.join(", ")}</span>
                    </div>
                  )}
                </div>

                {edu.certificateUrl && (
                  <div className={styles.educationAction}>
                    <a
                      href={edu.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      View Certificate
                    </a>
                  </div>
                )}

                <div className={styles.educationActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(edu)}
                    title="Edit Education"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(edu._id)}
                    title="Delete Education"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <h3>{educations.length}</h3>
          <p>Total Educations</p>
        </div>
      </div>
    </div>
  );
}