import { useEffect, useState } from "react";

export type Skill = {
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
};

export type SkillCategory = 'Languages' | 'Frameworks' | 'DevOps and Cloud' | 'Developer Tools';

/**
 * Fetch all skills from the API
 */
export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch("/api/skills");
  if (!response.ok) {
    throw new Error(`Failed to fetch skills: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch a single skill by ID
 */
export async function fetchSkillById(id: string): Promise<Skill> {
  const response = await fetch(`/api/skills/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch skill: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Create a new skill
 */
export async function createSkill(skill: Omit<Skill, "_id" | "createdAt" | "updatedAt">): Promise<Skill> {
  const response = await fetch("/api/skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    throw new Error(`Failed to create skill: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Update an existing skill
 */
export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
  const response = await fetch(`/api/skills/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skill),
  });

  if (!response.ok) {
    throw new Error(`Failed to update skill: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Delete a skill
 */
export async function deleteSkill(id: string): Promise<void> {
  const response = await fetch(`/api/skills/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete skill: ${response.statusText}`);
  }
}

/**
 * React hook to fetch and manage skills state
 */
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSkills();
        if (isMounted) {
          setSkills(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load skills");
          setLoading(false);
          console.error("Error fetching skills:", err);
        }
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return { skills, loading, error };
}

/**
 * Get skills grouped by category
 */
export function groupSkillsByCategory(skills: Skill[]): Record<SkillCategory, Skill[]> {
  const grouped: Record<SkillCategory, Skill[]> = {
    Languages: [],
    Frameworks: [],
    'DevOps and Cloud': [],
    'Developer Tools': [],
  };

  skills.forEach(skill => {
    const category = skill.category as SkillCategory;
    if (grouped[category]) {
      grouped[category].push(skill);
    }
  });

  // Sort each category by name
  Object.keys(grouped).forEach(category => {
    (grouped[category as SkillCategory] as Skill[]).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  return grouped;
}