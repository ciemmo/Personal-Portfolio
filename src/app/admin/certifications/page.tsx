"use client";

import { useEffect, useState } from "react";
import styles from "./Certifications.module.css";
import { useRouter } from "next/navigation";

// Types
interface Certification {
  _id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
  description?: string;
  logoUrl?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCertificationId, setEditingCertificationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    credentialUrl: "",
    skills: [],
    description: "",
    logoUrl: "",
    color: "",
  });
  const router = useRouter();

  // Fetch all certifications
  const fetchCertifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/certifications");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setCertifications(data);
    } catch (err: any) {
      setError("Failed to load certifications. Please try again later.");
      console.error("Error fetching certifications:", err);
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
    } else if (name === "skills") {
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
    if (!formData.name || !formData.issuingOrganization || !formData.issueDate) {
      setError("Name, issuing organization, and issue date are required");
      return;
    }

    try {
      if (editingCertificationId && editingCertificationId !== "ADD_MODE") {
        // Update existing certification
        const response = await fetch(`/api/certifications/${editingCertificationId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`);
        }

        setEditingCertificationId(null);
        setFormData({
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expirationDate: "",
          credentialId: "",
          credentialUrl: "",
          skills: [],
          description: "",
          logoUrl: "",
          color: "",
        });
      } else {
        // Create new certification
        const response = await fetch("/api/certifications", {
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
        setEditingCertificationId(null);
        setFormData({
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expirationDate: "",
          credentialId: "",
          credentialUrl: "",
          skills: [],
          description: "",
          logoUrl: "",
          color: "",
        });
      }

      // Refresh certifications list
      await fetchCertifications();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving certification:", err);
    }
  };

  // Handle delete certification
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) {
      return;
    }

    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchCertifications();
    } catch (err: any) {
      setError("Failed to delete certification");
      console.error("Error deleting certification:", err);
    }
  };

  // Handle edit certification
  const handleEdit = (certification: Certification) => {
    setEditingCertificationId(certification._id);
    setFormData({
      name: certification.name,
      issuingOrganization: certification.issuingOrganization,
      issueDate: certification.issueDate,
      expirationDate: certification.expirationDate || "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      skills: Array.isArray(certification.skills) ? certification.skills : [],
      description: certification.description || "",
      logoUrl: certification.logoUrl || "",
      color: certification.color || "",
    });
  };

  // Load certifications on mount
  useEffect(() => {
    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading certifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchCertifications()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Certifications Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingCertificationId("ADD_MODE");
              setFormData({
                name: "",
                issuingOrganization: "",
                issueDate: "",
                expirationDate: "",
                credentialId: "",
                credentialUrl: "",
                skills: [],
                description: "",
                logoUrl: "",
                color: "",
              });
            }}
          >
            Add New Certification
          </button>
        </div>
      </div>

      {editingCertificationId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingCertificationId === "ADD_MODE" ? "Add New Certification" : "Edit Certification"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Certification Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter certification name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issuingOrganization" className={styles.label}>
                Issuing Organization
              </label>
              <input
                type="text"
                id="issuingOrganization"
                name="issuingOrganization"
                value={formData.issuingOrganization || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter issuing organization"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="issueDate" className={styles.label}>
                Issue Date
              </label>
              <input
                type="text"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter issue date (YYYY-MM-DD)"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="expirationDate" className={styles.label}>
                Expiration Date (leave blank for no expiration)
              </label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter expiration date (YYYY-MM-DD) or leave blank"
              />
              <p className={styles.helpText>Leave blank if the certification does not expire</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="credentialId" className={styles.label}>
                Credential ID (optional)
              </label>
              <input
                type="text"
                id="credentialId"
                name="credentialId"
                value={formData.credentialId || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter credential ID for verification"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="credentialUrl" className={styles.label}>
                Credential URL (optional)
              </label>
              <input
                type="text"
                id="credentialUrl"
                name="credentialUrl"
                value={formData.credentialUrl || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter URL to verify certification"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skills" className={styles.label}>
                Related Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter related skills (comma-separated)"
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
                placeholder="Enter description of what the certification covers"
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="logoUrl" className={styles.label}>
                Logo URL (optional)
              </label>
              <input
                type="text"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter organization logo or badge URL"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="color" className={styles.label}>
                Theme Color (optional)
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter theme color (e.g., #FF9900)"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                {editingCertificationId ? "Update Certification" : "Add Certification"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingCertificationId(null);
                  setFormData({
                    name: "",
                    issuingOrganization: "",
                    issueDate: "",
                    expirationDate: "",
                    credentialId: "",
                    credentialUrl: "",
                    skills: [],
                    description: "",
                    logoUrl: "",
                    color: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.certificationsList}>
        <h2 className={styles.sectionTitle}>All Certifications ({certifications.length})</h2>
        {certifications.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No certifications found. Add your first certification above!</p>
          </div>
        ) : (
          <div className={styles.certificationsGrid}>
            {certifications.map(cert => (
              <div key={cert._id} className={styles.certificationCard}>
                <div className={styles.certificationHeader}>
                  <h3 className={styles.certificationName}>{cert.name}</h3>
                  <div className={styles.certificationMeta}>
                    <span className={styles.certificationIssuer}>
                      {cert.issuingOrganization}
                    </span>
                    <span className={styles.certificationDivider}>|</span>
                    <span className={styles.certificationDate}>
                      {cert.issueDate}
                    </span>
                  </div>
                </div>

                {cert.description && (
                  <div className={styles.certificationDescription}>
                    <p>{cert.description}</p>
                  </div>
                )}

                {cert.description && (
                  <div className={styles.certificationDescription}>
                    <p>{cert.description}</p>
                  </div>
                )}

                <div className={styles.certificationDetails}>
                  {cert.skills && cert.skills.length > 0 && (
                    <div className={styles.skillsSection}>
                      <h4 className={styles.sectionSubtitle}>Related Skills:</h4>
                      <div className={styles.skillsTags}>
                        {cert.skills.map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )
                  )}

                  {cert.color && (
                    <div className={styles.colorIndicator}>
                      <div
                        style={{ backgroundColor: cert.color, width: "20px", height: "20px", borderRadius: "3px" }}
                      />
                      <span>Theme Color</span>
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className={styles.certificationAction}>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      Verify Credential
                    </a>
                  </div>
                )}

                <div className={styles.certificationActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(cert)}
                    title="Edit Certification"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(cert._id)}
                    title="Delete Certification"
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
          <h3>{certifications.length}</h3>
          <p>Total Certifications</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {certifications.filter(cert => !cert.expirationDate).length}
          </h3>
          <p>No Expiration</p>
        </div>
      </div>
    </div>
  );
}