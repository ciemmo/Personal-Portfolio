"use client";

import { useEffect, useState } from "react";
import styles from "./ContinuingEducation.module.css";
import { useRouter } from "next/navigation";

// Types
interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
  grade?: string;
  description?: string;
  activities?: string[];
  honors?: string[];
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContinuingEducationPage() {
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
    grade: "",
    description: "",
    activities: [],
    honors: [],
    url: "",
  });
  const router = useRouter();

  // Fetch all educations (including continuing education)
  const fetchEducations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/continuingEducation");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setEducations(data);
    } catch (err: any) {
      setError("Failed to load continuing education records. Please try again later.");
      console.error("Error fetching continuing education:", err);
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
    } else if (name === "activities" || name === "honors") {
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
    if (!formData.institution || !formData.degree || !formData.fieldOfStudy || !formData.startDate) {
      setError("Institution, degree, field of study, and start date are required");
      return;
    }

    try {
      if (editingEducationId) {
        // Update existing education
        const response = await fetch(`/api/continuingEducation/${editingEducationId}`, {
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
          grade: "",
          description: "",
          activities: [],
          honors: [],
          url: "",
        });
      } else {
        // Create new education
        const response = await fetch("/api/continuingEducation", {
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
        setFormData({
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
          description: "",
          activities: [],
          honors: [],
          url: "",
        });
      }

      // Refresh educations list
      await fetchEducations();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving education:", err);
    }
  };

  // Handle delete education
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this education record?")) {
      return;
    }

    try {
      const response = await fetch(`/api/continuingEducation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchEducations();
    } catch (err: any) {
      setError("Failed to delete education record");
      console.error("Error deleting education:", err);
    }
  };

  // Handle edit education
  const handleEdit = (education: Education) => {
    setEditingEducationId(education._id);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate,
      endDate: education.endDate || "",
      grade: education.grade || "",
      description: education.description || "",
      activities: Array.isArray(education.activities) ? education.activities : [],
      honors: Array.isArray(education.honors) ? education.honors : [],
      url: education.url || "",
    });
  };

  // Load educations on mount
  useEffect(() => {
    fetchEducations();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading continuing education records...</p>
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
        <h1 className={styles.title}>Continuing Education Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingEducationId(null);
              setFormData({
                institution: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                grade: "",
                description: "",
                activities: [],
                honors: [],
                url: "",
              });
            }}
          >
            Add New Education Record
          </button>
        </div>
      </div>

      {editingEducationId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingEducationId ? "Edit Education Record" : "Add New Education Record"}
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
                Degree or Certificate
              </label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={formData.degree || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter degree or certificate name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fieldOfStudy" className={styles.label}>
                Field of Study
              </label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={formData.fieldOfStudy || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter field of study or specialization"
                required
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
                placeholder="Enter start date (YYYY-MM-DD)"
                required
              />
              <p className={styles.helpText}>Use formats like 2023 or 2023-06-15</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate" className={styles.label}>
                End Date (leave blank if ongoing)
              </label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter end date (YYYY-MM-DD) or leave blank if ongoing"
              />
              <p className={styles.helpText}>Use formats like 2023 or 2023-06-15</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="grade" className={styles.label}>
                Grade or Score (optional)
              </label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter grade, GPA, or score"
              />
              <p className={styles.helpText}>Enter as X.X/X.X format (e.g., 3.7/4.0 or 4.0/5.0)</p>
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
                placeholder="Enter description of the program or coursework"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="activities" className={styles.label}>
                Activities or Coursework (comma-separated)
              </label>
              <input
                type="text"
                id="activities"
                name="activities"
                value={Array.isArray(formData.activities) ? formData.activities.join(", ") : formData.activities || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter relevant activities or coursework (comma-separated)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="honors" className={styles.label}>
                Honors or Awards (comma-separated)
              </label>
              <input
                type="text"
                id="honors"
                name="honors"
                value={Array.isArray(formData.honors) ? formData.honors.join(", ") : formData.honors || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter honors or awards received (comma-separated)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="url" className={styles.label}>
                URL (optional - link to certificate or program page)
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter URL for verification"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                {editingEducationId ? "Update Education Record" : "Add Education Record"}
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
                    grade: "",
                    description: "",
                    activities: [],
                    honors: [],
                    url: "",
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
        <h2 className={styles.sectionTitle}>All Continuing Education Records ({educations.length})</h2>
        {educations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No continuing education records found. Add your first record above!</p>
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
                    <span className={styles.educationDivider}>|</span>
                    <span className={styles.educationDate}>
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                    </span>
                  </div>
                </div>

                {edu.fieldOfStudy && (
                  <div className={styles.educationFieldOfStudy}>
                    <p><strong>Field of Study:</strong> {edu.fieldOfStudy}</p>
                  </div>
                )}

                {edu.description && (
                  <div className={styles.educationDescription}>
                    <p>{edu.description}</p>
                  </div>
                )}

                {edu.activities && edu.activities.length > 0 && (
                  <div className={styles.educationActivities}>
                    <h4 className={styles.sectionSubtitle}>Activities/Coursework:</h4>
                    <div className={styles.educationActivitiesList}>
                      {edu.activities.map((activity, index) => (
                        <span key={index} className={styles.activityTag}>
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.honors && edu.honors.length > 0 && (
                  <div className={styles.educationHonors}>
                    <h4 className={styles.sectionSubtitle}>Honors/Awards:</h4>
                    <div className={styles.educationHonorsList}>
                      {edu.honors.map((honor, index) => (
                        <span key={index} className={styles.honorTag}>
                          {honor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {edu.grade && (
                  <div className={styles.educationGrade}>
                    <p><strong>Grade:</strong> {edu.grade}</p>
                  </div>
                )}

                {edu.url && (
                  <div className={styles.educationAction}>
                    <a
                      href={edu.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      View Certificate/Program
                    </a>
                  </div>
                )}

                <div className={styles.educationActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(edu)}
                    title="Edit Education Record"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(edu._id)}
                    title="Delete Education Record"
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
          <p>Total Records</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {educations.filter(edu => !edu.endDate).length}
          </h3>
          <p>Ongoing</p>
        </div>
      </div>
    </div>
  );
}