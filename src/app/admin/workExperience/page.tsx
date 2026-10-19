"use client";

import { useEffect, useState } from "react";
import styles from "./WorkExperience.module.css";
import { useRouter } from "next/navigation";

// Types
interface WorkExperience {
  _id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  duration?: string;
  responsibilities?: string[];
  technologies?: string[];
  highlights?: string[];
  url?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminWorkExperiencePage() {
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkExperienceId, setEditingWorkExperienceId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WorkExperience>>({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    duration: "",
    responsibilities: [],
    technologies: [],
    highlights: [],
    url: "",
    logo: "",
  });
  const router = useRouter();

  // Fetch all work experiences
  const fetchWorkExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/workExperience");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setWorkExperiences(data);
    } catch (err: any) {
      setError("Failed to load work experiences. Please try again later.");
      console.error("Error fetching work experiences:", err);
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
    } else if (name === "responsibilities" || name === "technologies" || name === "highlights") {
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
    if (!formData.company || !formData.role || !formData.startDate) {
      setError("Company, role, and start date are required");
      return;
    }

    try {
      if (editingWorkExperienceId && editingWorkExperienceId !== "ADD_MODE") {
        // Update existing work experience
        const response = await fetch(`/api/workExperience/${editingWorkExperienceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`);
        }

        setEditingWorkExperienceId(null);
        setFormData({
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          duration: "",
          responsibilities: [],
          technologies: [],
          highlights: [],
          url: "",
          logo: "",
        });
      } else {
        // Create new work experience
        const response = await fetch("/api/workExperience", {
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
        setEditingWorkExperienceId(null);
        setFormData({
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          duration: "",
          responsibilities: [],
          technologies: [],
          highlights: [],
          url: "",
          logo: "",
        });
      }

      // Refresh work experiences list
      await fetchWorkExperiences();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving work experience:", err);
    }
  };

  // Handle delete work experience
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this work experience entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/workExperience/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchWorkExperiences();
    } catch (err: any) {
      setError("Failed to delete work experience");
      console.error("Error deleting work experience:", err);
    }
  };

  // Handle edit work experience
  const handleEdit = (workExperience: WorkExperience) => {
    setEditingWorkExperienceId(workExperience._id);
    setFormData({
      company: workExperience.company,
      role: workExperience.role,
      location: workExperience.location || "",
      startDate: workExperience.startDate,
      endDate: workExperience.endDate || "",
      duration: workExperience.duration || "",
      responsibilities: Array.isArray(workExperience.responsibilities) ? workExperience.responsibilities : [],
      technologies: Array.isArray(workExperience.technologies) ? workExperience.technologies : [],
      highlights: Array.isArray(workExperience.highlights) ? workExperience.highlights : [],
      url: workExperience.url || "",
      logo: workExperience.logo || "",
    });
  };

  // Load work experiences on mount
  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading work experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchWorkExperiences()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Work Experience Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingWorkExperienceId("ADD_MODE");
              setFormData({
                company: "",
                role: "",
                location: "",
                startDate: "",
                endDate: "",
                duration: "",
                responsibilities: [],
                technologies: [],
                highlights: [],
                url: "",
                logo: "",
              });
            }}
          >
            Add New Work Experience
          </button>
        </div>
      </div>

      {editingWorkExperienceId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingWorkExperienceId === "ADD_MODE" ? "Add New Work Experience" : "Edit Work Experience"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.label}>
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role" className={styles.label}>
                Role/Position
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter job title/role"
                required
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
              <p className={styles.helpText}>Use formats like 2023 or 2023-06</p>
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
              <p className={styles.helpText}>Use formats like 2023 or 2023-06</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="duration" className={styles.label}>
                Duration (optional)
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter formatted duration (e.g., 'Jan 2020 - Present')"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="responsibilities" className={styles.label}>
                Responsibilities (comma-separated)
              </label>
              <input
                type="text"
                id="responsibilities"
                name="responsibilities"
                value={Array.isArray(formData.responsibilities) ? formData.responsibilities.join(", ") : formData.responsibilities || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter responsibilities (comma-separated)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="technologies" className={styles.label}>
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={Array.isArray(formData.technologies) ? formData.technologies.join(", ") : formData.technologies || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter technologies (comma-separated)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="highlights" className={styles.label}>
                Highlights/Achievements (comma-separated)
              </label>
              <input
                type="text"
                id="highlights"
                name="highlights"
                value={Array.isArray(formData.highlights) ? formData.highlights.join(", ") : formData.highlights || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter highlights/achievements (comma-separated)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="url" className={styles.label}>
                Company URL (optional)
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={formData.url || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter company website URL"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="logo" className={styles.label}>
                Company Logo URL (optional)
              </label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter company logo URL"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                {editingWorkExperienceId ? "Update Work Experience" : "Add Work Experience"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingWorkExperienceId(null);
                  setFormData({
                    company: "",
                    role: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    duration: "",
                    responsibilities: [],
                    technologies: [],
                    highlights: [],
                    url: "",
                    logo: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.workExperiencesList}>
        <h2 className={styles.sectionTitle}>All Work Experiences ({workExperiences.length})</h2>
        {workExperiences.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No work experiences found. Add your first work experience above!</p>
          </div>
        ) : (
          <div className={styles.workExperiencesGrid}>
            {workExperiences.map(exp => (
              <div key={exp._id} className={styles.workExperienceCard}>
                <div className={styles.workExperienceHeader}>
                  <h3 className={styles.workExperienceRole}>{exp.role}</h3>
                  <div className={styles.workExperienceMeta}>
                    <span className={styles.workExperienceCompany}>
                      {exp.company}
                    </span>
                    <span className={styles.workExperienceDivider}>|</span>
                    <span className={styles.workExperienceLocation}>
                      {exp.location || "Remote"}
                    </span>
                  </div>
                </div>

                <div className={styles.workExperienceDetails}>
                  <div className={styles.detailItem}>
                    <strong>Period:</strong>
                    <span>
                      {exp.startDate}{" "}
                      {exp.endDate ? `– ${exp.endDate}` : "– Present"}
                    </span>
                  </div>
                  {exp.duration && (
                    <div className={styles.detailItem}>
                      <strong>Duration:</strong>
                      <span>{exp.duration}</span>
                    </div>
                  )}
                </div>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className={styles.responsibilitiesSection}>
                    <h4 className={styles.sectionSubtitle}>Responsibilities:</h4>
                    <ul className={styles.responsibilitiesList}>
                      {exp.responsibilities.map((resp, index) => (
                        <li key={index} className={styles.responsibilityItem}>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className={styles.technologiesSection}>
                    <h4 className={styles.sectionSubtitle}>Technologies:</h4>
                    <div className={styles.technologiesTags}>
                      {exp.technologies.map((tech, index) => (
                        <span key={index} className={styles.technologyTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <div className={styles.highlightsSection}>
                    <h4 className={styles.sectionSubtitle}>Highlights:</h4>
                    <ul className={styles.highlightsList}>
                      {exp.highlights.map((highlight, index) => (
                        <li key={index} className={styles.highlightItem}>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.url && (
                  <div className={styles.workExperienceAction}>
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      Visit Company Website
                    </a>
                  </div>
                )}

                {exp.logo && (
                  <div className={styles.workExperienceLogo}>
                    <img
                      src={exp.logo}
                      alt={`${exp.company} logo`}
                      className={styles.logoImage}
                    />
                  </div>
                )}

                <div className={styles.workExperienceActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(exp)}
                    title="Edit Work Experience"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(exp._id)}
                    title="Delete Work Experience"
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
          <h3>{workExperiences.length}</h3>
          <p>Total Work Experiences</p>
        </div>
      </div>
    </div>
  );
}