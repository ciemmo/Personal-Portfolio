"use client";

import { useEffect, useState } from "react";
import styles from "./Skills.module.css";
import { useRouter } from "next/navigation";

// Types
interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number; // 0-3
  description?: string;
  icon?: string;
  color?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category: "Languages",
    proficiency: 0,
    description: "",
    icon: "",
    color: "",
    isFeatured: false,
  });
  const router = useRouter();

  // Fetch all skills
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/skills");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      // Ensure proficiency values are numbers (handle case where DB stores them as strings)
      const skillsWithNumericProficiency = data.map((skill: typeof data[0]) => ({
        ...skill,
        proficiency: typeof skill.proficiency === 'number'
          ? skill.proficiency
          : parseInt(skill.proficiency, 10) || 0
      }));
      setSkills(skillsWithNumericProficiency);
    } catch (err: any) {
      setError("Failed to load skills. Please try again later.");
      console.error("Error fetching skills:", err);
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
    } else if (name === "proficiency") {
      const numValue = parseInt(value, 10) || 0;
      setFormData(prev => ({
        ...prev,
        proficiency: numValue,
      }));
    } else {
      // For text inputs and textarea
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle proficiency change (special handling for number input)
  const handleProficiencyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 3) {
      setFormData(prev => ({
        ...prev,
        proficiency: value,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    // Check if name is provided and not just whitespace
    const nameIsValid = typeof formData.name === 'string' && formData.name.trim() !== '';
    // Check if category is provided and not empty or just whitespace
    const categoryIsValid = typeof formData.category === 'string' && formData.category.trim() !== '';
    // Check if proficiency is provided and a valid number
    const proficiencyIsValid = typeof formData.proficiency === 'number' && !isNaN(formData.proficiency) && formData.proficiency >= 0 && formData.proficiency <= 3;

    if (!nameIsValid || !categoryIsValid || !proficiencyIsValid) {
      setError("Name, category, and proficiency are required");
      return;
    }

    try {
      if (editingSkillId && editingSkillId !== "ADD_MODE") {
        // Update existing skill
        const response = await fetch(`/api/skills/${editingSkillId}`, {
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

        setEditingSkillId(null);
        setFormData({
          name: "",
          category: "Languages",
          proficiency: 0,
          description: "",
          icon: "",
          color: "",
          isFeatured: false,
        });
      } else {
        // Create new skill
        const response = await fetch("/api/skills", {
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
        setEditingSkillId(null);
        setFormData({
          name: "",
          category: "Languages",
          proficiency: 0,
          description: "",
          icon: "",
          color: "",
          isFeatured: false,
        });
      }

      // Refresh skills list
      await fetchSkills();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving skill:", err);
    }
  };

  // Handle delete skill
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      await fetchSkills();
    } catch (err: any) {
      setError("Failed to delete skill");
      console.error("Error deleting skill:", err);
    }
  };

  // Handle edit skill
  const handleEdit = (skill: Skill) => {
    setEditingSkillId(skill._id);
    // Ensure proficiency is a number (handle case where DB stores it as string)
    const proficiencyValue = typeof skill.proficiency === 'number'
      ? skill.proficiency
      : parseInt(skill.proficiency, 10) || 0;

    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: proficiencyValue,
      description: skill.description || "",
      icon: skill.icon || "",
      color: skill.color || "",
      isFeatured: skill.isFeatured ?? false,
    });
  };

  // Load skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => fetchSkills()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Skills Management</h1>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => {
              setEditingSkillId("ADD_MODE");
              setFormData({
                name: "",
                category: "Languages",
                proficiency: 0,
                description: "",
                icon: "",
                color: "",
                isFeatured: false,
              });
            }}
          >
            Add New Skill
          </button>
        </div>
      </div>

      {editingSkillId !== null && (
        <div className={styles.editPanel}>
          <h2 className={styles.panelTitle}>
            {editingSkillId === "ADD_MODE" ? "Add New Skill" : "Edit Skill"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="skillName" className={styles.label}>
                Skill Name
              </label>
              <input
                type="text"
                id="skillName"
                name="name"
                list="skill-options"
                value={formData.name || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Start typing or select a common skill"
                required
              />
              <datalist id="skill-options">
                {/* Programming Languages */}
                <option value="JavaScript" />
                <option value="TypeScript" />
                <option value="Python" />
                <option value="Java" />
                <option value="C#" />
                <option value="C++" />
                <option value="Go" />
                <option value="Rust" />
                <option value="PHP" />
                <option value="Ruby" />
                <option value="Swift" />
                <option value="Kotlin" />
                <option value="Scala" />
                <option value="HTML" />
                <option value="CSS" />
                <option value="SQL" />

                {/* Frontend Frameworks & Libraries */}
                <option value="React" />
                <option value="Next.js" />
                <option value="Vue.js" />
                <option value="Angular" />
                <option value="Svelte" />
                <option value="jQuery" />
                <option value="Bootstrap" />
                <option value="Tailwind CSS" />
                <option value="Material UI" />
                <option value="Ant Design" />
                <option value="Redux" />
                <option value="Zustand" />
                <option value="GraphQL" />
                <option value="Apollo" />
                <option value="Webpack" />
                <option value="Vite" />
                <option value="Parcel" />
                <option value="SASS" />
                <option value="LESS" />

                {/* Backend Frameworks & Technologies */}
                <option value="Node.js" />
                <option value="Express.js" />
                <option value="NestJS" />
                <option value="Django" />
                <option value="Flask" />
                <option value="Spring Boot" />
                <option value="ASP.NET Core" />
                <option value="Laravel" />
                <option value="Ruby on Rails" />
                <option value="FastAPI" />
                <option value="PostgreSQL" />
                <option value="MySQL" />
                <option value="MongoDB" />
                <option value="Redis" />
                <option value="Elasticsearch" />
                <option value="Docker" />
                <option value="Kubernetes" />
                <option value="AWS" />
                <option value="Azure" />
                <option value="Google Cloud" />
                <option value="Firebase" />
                <option value="Linux" />
                <option value="Git" />
                <option value="GitHub" />

                {/* Mobile Development */}
                <option value="React Native" />
                <option value="Flutter" />
                <option value="Swift" />
                <option value="Kotlin" />
                <option value="Xamarin" />

                {/* DevOps & Tools */}
                <option value="Jenkins" />
                <option value="Travis CI" />
                <option value="GitLab CI" />
                <option value="GitHub Actions" />
                <option value="Terraform" />
                <option value="Ansible" />
                <option value="Prometheus" />
                <option value="Grafana" />
                <option value="ELK Stack" />

                {/* Testing */}
                <option value="Jest" />
                <option value="Cypress" />
                <option value="Mocha" />
                <option value="Chai" />
                <option value="JUnit" />
                <option value="TestNG" />
                <option value="Selenium" />

                {/* Other */}
                <option value="Figma" />
                <option value="Adobe XD" />
                <option value="Photoshop" />
                <option value="Illustrator" />
                <option value="Agile" />
                <option value="Scrum" />
                <option value="REST API" />
                <option value="WebSockets" />
                <option value="Microservices" />
                <option value="Serverless" />
                <option value="TypeScript" />
                <option value="WebAssembly" />
                <option value="Electron" />
                <option value="TensorFlow" />
                <option value="PyTorch" />
              </datalist>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillCategory" className={styles.label}>
                Category
              </label>
              <select
                id="skillCategory"
                name="category"
                value={formData.category || "Languages"}
                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLSelectElement>)}
                className={styles.select}
              >
                <option value="Languages">Languages</option>
                <option value="Frameworks">Frameworks</option>
                <option value="DevOps and Cloud">DevOps and Cloud</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillProficiency" className={styles.label}>
                Proficiency Level (0-3)
              </label>
              <input
                type="number"
                id="skillProficiency"
                name="proficiency"
                value={String(Number(formData.proficiency ?? 0))}
                onChange={handleProficiencyChange}
                className={styles.input}
                min="0"
                max="3"
                required
              />
              <div className={styles.proficiencyLabels}>
                <span>0: Beginner</span>
                <span>1: Intermediate</span>
                <span>2: Advanced</span>
                <span>3: Expert</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillDescription" className={styles.label}>
                Description (optional)
              </label>
              <textarea
                id="skillDescription"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="Enter skill description"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillIcon" className={styles.label}>
                Icon (optional - emoji or URL)
              </label>
              <input
                type="text"
                id="skillIcon"
                name="icon"
                value={formData.icon || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter emoji (e.g. ⚛) or icon URL"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillColor" className={styles.label}>
                Color (optional - hex code)
              </label>
              <input
                type="text"
                id="skillColor"
                name="color"
                value={formData.color || ""}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter hex color (e.g. #3b82f6)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="skillFeatured" className={styles.label}>
                <input
                  type="checkbox"
                  id="skillFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onChange={handleInputChange}
                />
                Featured Skill
              </label>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                {editingSkillId ? "Update Skill" : "Add Skill"}
              </button>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => {
                  setEditingSkillId(null);
                  setFormData({
                    name: "",
                    category: "frontend",
                    proficiency: 0,
                    description: "",
                    icon: "",
                    color: "",
                    isFeatured: false,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.skillsList}>
        <h2 className={styles.sectionTitle}>All Skills ({skills.length})</h2>
        {skills.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No skills found. Add your first skill above!</p>
          </div>
        ) : (
          <div className={styles.skillsGrid}>
            {skills.map(skill => (
              <div key={skill._id} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <h3 className={styles.skillName}>{skill.name}</h3>
                  <div className={styles.skillMeta}>
                    <span className={styles.skillCategory}>
                      {skill.category.toUpperCase()}
                    </span>
                    <span className={styles.skillProficiency}>
                      {["Beginner", "Intermediate", "Advanced", "Expert"][
                        skill.proficiency
                      ]}
                    </span>
                  </div>
                </div>

                {skill.description && (
                  <div className={styles.skillDescription}>
                    <p>{skill.description}</p>
                  </div>
                )}

                <div className={styles.skillActions}>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleEdit(skill)}
                    title="Edit Skill"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.buttonIcon}
                    onClick={() => handleDelete(skill._id)}
                    title="Delete Skill"
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
          <h3>{skills.length}</h3>
          <p>Total Skills</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {skills.filter(s => s.isFeatured).length}
          </h3>
          <p>Featured Skills</p>
        </div>
        <div className={styles.statItem}>
          <h3>
            {skills.filter(s => s.proficiency === 3).length}
          </h3>
          <p>Expert Level</p>
        </div>
      </div>
    </div>
  );
}