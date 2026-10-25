"use client";

import { useEffect, useState } from "react";
import styles from "./AdminStatsContent.module.css";

// Types
interface Stat {
  _id: string;
  key: string;
  label: string;
  value: string;
  section: "hero" | "about" | "both";
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StatFormData {
  key: string;
  label: string;
  value: string;
  section: "hero" | "about" | "both";
  displayOrder: number;
  isVisible: boolean;
}

export default function AdminStatsContent() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StatFormData>({
    key: "",
    label: "",
    value: "",
    section: "both",
    displayOrder: 0,
    isVisible: true,
  });

  // Fetch all stats
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load stats. Please try again later.");
      console.error("Error fetching stats:", err);
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
      setFormData((prev) => ({
        ...prev,
        [name]: checkboxTarget.checked,
      }));
    } else if (type === "select-one") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "displayOrder") {
      const numValue = parseInt(value, 10) || 0;
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      // For text inputs and textarea
      setFormData((prev) => ({
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
    const keyIsValid = typeof formData.key === "string" && formData.key.trim() !== "";
    const labelIsValid = typeof formData.label === "string" && formData.label.trim() !== "";
    const valueIsValid = typeof formData.value === "string" && formData.value.trim() !== "";

    if (!keyIsValid || !labelIsValid || !valueIsValid) {
      setError("Key, label, and value are required");
      return;
    }

    try {
      if (editingStatId && editingStatId !== "ADD_MODE") {
        // Update existing stat
        const response = await fetch(`/api/stats/${editingStatId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          let errorDetails = response.statusText;
          try {
            const errorBody = await response.json();
            errorDetails = errorBody.details || errorBody.error || response.statusText;
          } catch {
            // ignore parse errors
          }
          throw new Error(`Failed to update: ${errorDetails}`);
        }

        setEditingStatId(null);
        setFormData({
          key: "",
          label: "",
          value: "",
          section: "both",
          displayOrder: 0,
          isVisible: true,
        });
      } else {
        // Create new stat
        const response = await fetch("/api/stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          let errorDetails = response.statusText;
          try {
            const errorBody = await response.json();
            errorDetails = errorBody.details || errorBody.error || response.statusText;
          } catch {
            // ignore parse errors
          }
          throw new Error(`Failed to create: ${errorDetails}`);
        }

        // Reset form
        setEditingStatId(null);
        setFormData({
          key: "",
          label: "",
          value: "",
          section: "both",
          displayOrder: 0,
          isVisible: true,
        });
      }

      // Refresh stats list
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error saving stat:", err);
    }
  };

  // Handle delete stat
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this stat?")) {
      return;
    }

    try {
      const response = await fetch(`/api/stats/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchStats();
    } catch (err) {
      setError("Failed to delete stat");
      console.error("Error deleting stat:", err);
    }
  };

  // Handle edit stat
  const handleEdit = (stat: Stat) => {
    setEditingStatId(stat._id);
    setFormData({
      key: stat.key,
      label: stat.label,
      value: stat.value,
      section: stat.section,
      displayOrder: stat.displayOrder,
      isVisible: stat.isVisible,
    });
  };

  // Load stats on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Standard data fetching pattern on mount
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchStats()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Site Stats Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingStatId("ADD_MODE");
              setFormData({
                key: "",
                label: "",
                value: "",
                section: "both",
                displayOrder: 0,
                isVisible: true,
              });
            }}
          >
            Add New Stat
          </button>
        </div>
      </div>

      {editingStatId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingStatId === "ADD_MODE" ? "Add New Stat" : "Edit Stat"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="statKey" className={styles.label}>
                Key (unique identifier)
              </label>
              <input
                type="text"
                id="statKey"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., yearsExperience, projectsBuilt, technologies, certifications"
                required
                disabled={editingStatId !== "ADD_MODE"}
              />
              <p className={styles.helpText}>
                {editingStatId !== "ADD_MODE"
                  ? "Key cannot be changed after creation"
                  : "Unique identifier (lowercase, no spaces). Used internally to identify the stat."}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="statLabel" className={styles.label}>
                Display Label
              </label>
              <input
                type="text"
                id="statLabel"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., Years of Experience, Projects Built"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="statValue" className={styles.label}>
                Value
              </label>
              <input
                type="text"
                id="statValue"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., 5+, 30+, 15+, 10+"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="statSection" className={styles.label}>
                Section
              </label>
              <select
                id="statSection"
                name="section"
                value={formData.section}
                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)}
                className={styles.select}
              >
                <option value="both">Both Hero & About</option>
                <option value="hero">Hero Only</option>
                <option value="about">About Only</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="statDisplayOrder" className={styles.label}>
                Display Order
              </label>
              <input
                type="number"
                id="statDisplayOrder"
                name="displayOrder"
                value={String(formData.displayOrder)}
                onChange={handleInputChange}
                className={styles.input}
                min="0"
                placeholder="0"
              />
              <p className={styles.helpText}>Lower numbers appear first</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleInputChange}
                />
                Visible
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.buttonPrimary}>
                {editingStatId ? "Update Stat" : "Add Stat"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingStatId(null);
                  setFormData({
                    key: "",
                    label: "",
                    value: "",
                    section: "both",
                    displayOrder: 0,
                    isVisible: true,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.statsList}>
        <h2 className={styles.sectionTitle}>All Stats ({stats.length})</h2>
        {stats.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No stats found. Add your first stat above!</p>
          </div>
        ) : (
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat._id} className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div>
                    <div className={styles.statKey}>{stat.key}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                  <div className={styles.statMeta}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statSection}>{stat.section}</span>
                  </div>
                </div>

                {!stat.isVisible && (
                  <div className={styles.statSection} style={{ background: "var(--text-muted)", color: "var(--text-primary)" }}>
                    Hidden
                  </div>
                )}

                <div className={styles.statActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(stat)}
                    title="Edit Stat"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(stat._id)}
                    title="Delete Stat"
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
          <h3>{stats.length}</h3>
          <p>Total Stats</p>
        </div>
        <div className={styles.statItem}>
          <h3>{stats.filter((s) => s.section === "hero").length}</h3>
          <p>Hero Stats</p>
        </div>
        <div className={styles.statItem}>
          <h3>{stats.filter((s) => s.section === "about").length}</h3>
          <p>About Stats</p>
        </div>
        <div className={styles.statItem}>
          <h3>{stats.filter((s) => s.section === "both").length}</h3>
          <p>Shared Stats</p>
        </div>
      </div>
    </div>
  );
}