"use client";

import { useEffect, useState } from "react";
import styles from "./Achievements.module.css";
import { useRouter } from "next/navigation";

// Types
interface Achievement {
  _id: string;
  title: string;
  description?: string;
  date: string;
  category?: string;
  icon?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: "",
    description: "",
    date: "",
    category: "",
    icon: "",
    url: "",
  });
  const router = useRouter();

  // Fetch all achievements
  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/achievements");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setAchievements(data);
    } catch (err: any) {
      setError("Failed to load achievements. Please try again later.");
      console.error("Error fetching achievements:", err);
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
    if (!formData.title || !formData.date) {
      setError("Title and date are required");
      return;
    }

    try {
      if (editingAchievementId) {
        // Update existing achievement
        const response = await fetch(`/api/achievements/${editingAchievementId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`);
        }

        setEditingAchievementId(null);
        setFormData({
          title: "",
          description: "",
          date: "",
          category: "",
          icon: "",
          url: "",
        });
      } else {
        // Create new achievement
        const response = await fetch("/api/achievements", {
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
          title: "",
          description: "",
          date: "",
          category: "",
          icon: "",
          url: "",
        });
      }

      // Refresh achievements list
      await fetchAchievements();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving achievement:", err);
    }
  };

  // Handle delete achievement
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) {
      return;
    }

    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchAchievements();
    } catch (err: any) {
      setError("Failed to delete achievement");
      console.error("Error deleting achievement:", err);
    }
  };

  // Handle edit achievement
  const handleEdit = (achievement: Achievement) => {
    setEditingAchievementId(achievement._id);
    setFormData({
      title: achievement.title,
      description: achievement.description || "",
      date: achievement.date,
      category: achievement.category || "",
      icon: achievement.icon || "",
      url: achievement.url || "",
    });
  };

  // Load achievements on mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchAchievements()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Achievements Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingAchievementId(null);
              setFormData({
                title: "",
                description: "",
                date: "",
                category: "",
                icon: "",
                url: "",
              });
            }}
          >
            Add New Achievement
          </button>
        </div>
      </div>

      {editingAchievementId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingAchievementId ? "Edit Achievement" : "Add New Achievement"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter achievement title"
                required
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
                rows="3"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter date (YYYY or YYYY-MM-DD)"
                required
              />
              <p className={styles.helpText>Use formats like 2023 or 2023-06-15</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Category (e.g., award, milestone, education, certification, publication)
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter category"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="icon" className={styles.label}>
                Icon (optional - emoji or identifier)
              </label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter emoji (e.g., 🏆) or icon identifier"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="url" className={styles.label}>
                URL (optional - link to certificate, award page, etc.)
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
                {editingAchievementId ? "Update Achievement" : "Add Achievement"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingAchievementId(null);
                  setFormData({
                    title: "",
                    description: "",
                    date: "",
                    category: "",
                    icon: "",
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

      <div className={styles.achievementsList}>
        <h2 className={styles.sectionTitle}>All Achievements ({achievements.length})</h2>
        {achievements.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No achievements found. Add your first achievement above to get started!</p>
          </div>
        ) : (
          <div className={styles.achievementsGrid}>
            {achievements.map(ach => (
              <div key={ach._id} className={styles.achievementCard}>
                <div className={styles.achievementHeader}>
                  <h3 className={styles.achievementTitle}>{ach.title}</h3>
                  <div className={styles.achievementMeta}>
                    <span className={styles.achievementCategory}>
                      {ach.category || "N/A"}
                    </span>
                    <span className={styles.achievementDivider}>|</span>
                    <span className={styles.achievementDate}>
                      {ach.date}
                    </span>
                  </div>
                </div>

                {ach.description && (
                  <div className={styles.achievementDescription}>
                    <p>{ach.description}</p>
                  </div>
                )}

                {ach.icon && (
                  <div className={styles.achievementIcon}>
                    <span
                      role="img"
                      aria-label={ach.icon}
                    >
                      {ach.icon}
                    </span>
                  </div>
                )}

                {ach.url && (
                  <div className={styles.achievementAction}>
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buttonLink}
                    >
                      View Details
                    </a>
                  </div>
                )}

                <div className={styles.achievementActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(ach)}
                    title="Edit Achievement"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(ach._id)}
                    title="Delete Achievement"
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
          <h3>{achievements.length}</h3>
          <p>Total Achievements</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {achievements.filter(ach => ach.category === "award").length}
          </h3>
          <p>Awards</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {achievements.filter(ach => ach.category === "milestone").length}
          </h3>
          <p>Milestones</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {achievements.filter(ach => ach.category === "education").length}
          </h3>
          <p>Education</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {achievements.filter(ach => ach.category === "certification").length}
          </h3>
          <p>Certifications</p>
        </div>
      </div>
    </div>
  );
}