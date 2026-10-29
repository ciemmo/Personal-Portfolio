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

export default function AdminSkillsContent() {
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
                <option value="C" />
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
                <option value="R" />
                <option value="MATLAB" />
                <option value="Dart" />
                <option value="Lua" />
                <option value="Perl" />
                <option value="Shell" />
                <option value="Bash" />
                <option value="PowerShell" />
                <option value="GraphQL" />
                <option value="Elixir" />
                <option value="Clojure" />
                <option value="F#" />
                <option value="Haskell" />
                <option value="OCaml" />
                <option value="Zig" />
                <option value="V" />
                <option value="Nim" />

                {/* Frontend Frameworks & Libraries */}
                <option value="React" />
                <option value="Next.js" />
                <option value="Vue.js" />
                <option value="Nuxt.js" />
                <option value="Angular" />
                <option value="Svelte" />
                <option value="SvelteKit" />
                <option value="SolidJS" />
                <option value="Astro" />
                <option value="Qwik" />
                <option value="Remix" />
                <option value="Gatsby" />
                <option value="Preact" />
                <option value="Alpine.js" />
                <option value="Lit" />
                <option value="Stencil" />
                <option value="jQuery" />
                <option value="HTMX" />
                <option value="Bootstrap" />
                <option value="Tailwind CSS" />
                <option value="Material UI" />
                <option value="MUI" />
                <option value="Ant Design" />
                <option value="Chakra UI" />
                <option value="Radix UI" />
                <option value="Shadcn UI" />
                <option value="Styled Components" />
                <option value="Emotion" />
                <option value="CSS Modules" />
                <option value="SASS" />
                <option value="SCSS" />
                <option value="LESS" />
                <option value="PostCSS" />
                <option value="Vite" />
                <option value="Webpack" />
                <option value="Turbopack" />
                <option value="Rollup" />
                <option value="esbuild" />
                <option value="Parcel" />
                <option value="Rome" />
                <option value="Biome" />
                <option value="ESLint" />
                <option value="Prettier" />
                <option value="TypeScript ESLint" />
                <option value="Jest" />
                <option value="Vitest" />
                <option value="Playwright" />
                <option value="Cypress" />
                <option value="Testing Library" />
                <option value="Storybook" />
                <option value="Chromatic" />

                {/* Backend Frameworks & Libraries */}
                <option value="Node.js" />
                <option value="Express" />
                <option value="Express.js" />
                <option value="Fastify" />
                <option value="NestJS" />
                <option value="Koa" />
                <option value="Hono" />
                <option value="Bun" />
                <option value="Deno" />
                <option value="Spring Boot" />
                <option value="Quarkus" />
                <option value="Micronaut" />
                <option value=".NET" />
                <option value="ASP.NET Core" />
                <option value="Django" />
                <option value="FastAPI" />
                <option value="Flask" />
                <option value="Starlette" />
                <option value="Laravel" />
                <option value="Symfony" />
                <option value="Ruby on Rails" />
                <option value="Sinatra" />
                <option value="Phoenix" />
                <option value="Elixir" />
                <option value="Go Fiber" />
                <option value="Gin" />
                <option value="Echo" />
                <option value="Actix" />
                <option value="Axum" />
                <option value="Rocket" />
                <option value="tRPC" />
                <option value="GraphQL" />
                <option value="Apollo Server" />
                <option value="gRPC" />
                <option value="Protocol Buffers" />

                {/* Databases */}
                <option value="PostgreSQL" />
                <option value="MySQL" />
                <option value="MariaDB" />
                <option value="MongoDB" />
                <option value="Redis" />
                <option value="Valkey" />
                <option value="SQLite" />
                <option value="DynamoDB" />
                <option value="Firestore" />
                <option value="Cassandra" />
                <option value="Couchbase" />
                <option value="Neo4j" />
                <option value="ArangoDB" />
                <option value="SurrealDB" />
                <option value="Fauna" />
                <option value="PlanetScale" />
                <option value="Neon" />
                <option value="Supabase" />
                <option value="Firebase" />
                <option value="Appwrite" />
                <option value="PocketBase" />
                <option value="Turso" />
                <option value="Prisma" />
                <option value="Drizzle ORM" />
                <option value="TypeORM" />
                <option value="Sequelize" />
                <option value="Mongoose" />
                <option value="SQLAlchemy" />
                <option value="Prisma Client" />
                <option value="Knex" />
                <option value="Objection.js" />
                <option value="Entity Framework" />
                <option value="Hibernate" />
                <option value="JPA" />
                <option value="MyBatis" />

                {/* Cloud Platforms & DevOps */}
                <option value="AWS" />
                <option value="Amazon Web Services" />
                <option value="Google Cloud" />
                <option value="GCP" />
                <option value="Azure" />
                <option value="Microsoft Azure" />
                <option value="Vercel" />
                <option value="Netlify" />
                <option value="Cloudflare" />
                <option value="Cloudflare Pages" />
                <option value="Cloudflare Workers" />
                <option value="Railway" />
                <option value="Render" />
                <option value="Fly.io" />
                <option value="DigitalOcean" />
                <option value="Linode" />
                <option value="Hetzner" />
                <option value="Scaleway" />
                <option value="Vultr" />
                <option value="Heroku" />
                <option value="Docker" />
                <option value="Podman" />
                <option value="Kubernetes" />
                <option value="K3s" />
                <option value="K9s" />
                <option value="Helm" />
                <option value="ArgoCD" />
                <option value="Flux" />
                <option value="Terraform" />
                <option value="OpenTofu" />
                <option value="Pulumi" />
                <option value="Crossplane" />
                <option value="Ansible" />
                <option value="Chef" />
                <option value="Puppet" />
                <option value="SaltStack" />
                <option value="Packer" />
                <option value="Vagrant" />
                <option value="GitHub Actions" />
                <option value="GitLab CI/CD" />
                <option value="CircleCI" />
                <option value="Jenkins" />
                <option value="TeamCity" />
                <option value="Bamboo" />
                <option value="Drone" />
                <option value="Buildkite" />
                <option value="Codefresh" />
                <option value="Semaphore" />
                <option value="Travis CI" />
                <option value="Bitbucket Pipelines" />
                <option value="Azure DevOps" />
                <option value="AWS CodePipeline" />
                <option value="Google Cloud Build" />
                <option value="Argo Workflows" />
                <option value="Tekton" />
                <option value="Knative" />
                <option value="Istio" />
                <option value="Linkerd" />
                <option value="Consul" />
                <option value="Vault" />
                <option value="Nomad" />
                <option value="Envoy" />
                <option value="NGINX" />
                <option value="Traefik" />
                <option value="Caddy" />
                <option value="HAProxy" />
                <option value="Apache" />

                {/* Developer Tools */}
                <option value="Git" />
                <option value="GitHub" />
                <option value="GitLab" />
                <option value="Bitbucket" />
                <option value="GitHub Desktop" />
                <option value="GitKraken" />
                <option value="SourceTree" />
                <option value="LazyGit" />
                <option value="VS Code" />
                <option value="vscode" />
                <option value="Visual Studio" />
                <option value="JetBrains IDEs" />
                <option value="IntelliJ IDEA" />
                <option value="WebStorm" />
                <option value="PyCharm" />
                <option value="GoLand" />
                <option value="RustRover" />
                <option value="CLion" />
                <option value="Rider" />
                <option value="DataGrip" />
                <option value="Neovim" />
                <option value="Vim" />
                <option value="Emacs" />
                <option value="Helix" />
                <option value="Zed" />
                <option value="Cursor" />
                <option value="Windsurf" />
                <option value="GitHub Copilot" />
                <option value="Codeium" />
                <option value="Tabnine" />
                <option value="Continue" />
                <option value="Sourcegraph" />
                <option value="Postman" />
                <option value="Insomnia" />
                <option value="Hoppscotch" />
                <option value="Bruno" />
                <option value="Thunder Client" />
                <option value="Figma" />
                <option value="FigJam" />
                <option value="Sketch" />
                <option value="Adobe XD" />
                <option value="Penpot" />
                <option value="Zeplin" />
                <option value="Zeroheight" />
                <option value="Notion" />
                <option value="Obsidian" />
                <option value="Logseq" />
                <option value="Roam Research" />
                <option value="Linear" />
                <option value="Jira" />
                <option value="GitHub Projects" />
                <option value="GitLab Issues" />
                <option value="ClickUp" />
                <option value="Trello" />
                <option value="Asana" />
                <option value="Monday.com" />
                <option value="Height" />
                <option value="Shortcut" />
                <option value="Slack" />
                <option value="Discord" />
                <option value="Microsoft Teams" />
                <option value="Zoom" />
                <option value="Loom" />
                <option value="Miro" />
                <option value="Whimsical" />
                <option value="Excalidraw" />
                <option value="Draw.io" />
                <option value="PlantUML" />
                <option value="Mermaid" />
                <option value="Graphviz" />

                {/* AI and Machine Learning */}
                <option value="ChatGPT" />
                <option value="OpenAI API" />
                <option value="LangChain" />
                <option value="LlamaIndex" />
                <option value="AutoGPT" />
                <option value="Hugging Face" />
                <option value="TensorFlow" />
                <option value="PyTorch" />
                <option value="JAX" />
                <option value="Keras" />
                <option value="Scikit-learn" />
                <option value="XGBoost" />
                <option value="LightGBM" />
                <option value="CatBoost" />
                <option value="ONNX" />
                <option value="MLflow" />
                <option value="Weights & Biases" />
                <option value="ClearML" />
                <option value="Ray" />
                <option value="DeepSpeed" />
                <option value="LoRA" />
                <option value="QLoRA" />
                <option value="vLLM" />
                <option value="Ollama" />
                <option value="Llama.cpp" />
                <option value="LangGraph" />
                <option value="LangSmith" />
                <option value="RAG" />
                <option value="Vector Databases" />
                <option value="Pinecone" />
                <option value="Weaviate" />
                <option value="Qdrant" />
                <option value="Milvus" />
                <option value="Chroma" />
                <option value="LangChain.js" />
                <option value="OpenAI JavaScript" />
                <option value="Anthropic" />
                <option value="Claude" />
                <option value="Claude Code" />
                <option value="Gemini" />
                <option value="PaLM" />
                <option value="Mistral" />
                <option value="Zephyr" />
                <option value="Phi" />

                {/* Data Science & Analytics */}
                <option value="Pandas" />
                <option value="NumPy" />
                <option value="Polars" />
                <option value="DuckDB" />
                <option value="Apache Spark" />
                <option value="Apache Flink" />
                <option value="Apache Kafka" />
                <option value="Apache Airflow" />
                <option value="dbt" />
                <option value="Snowflake" />
                <option value="BigQuery" />
                <option value="Redshift" />
                <option value="Databricks" />
                <option value="Tableau" />
                <option value="Power BI" />
                <option value="Looker" />
                <option value="Metabase" />
                <option value="Superset" />
                <option value="Grafana" />
                <option value="Prometheus" />
                <option value="InfluxDB" />
                <option value="TimescaleDB" />
                <option value="ClickHouse" />
                <option value="Apache Druid" />
                <option value="Trino" />
                <option value="Presto" />

                {/* Mobile Development */}
                <option value="React Native" />
                <option value="Expo" />
                <option value="Flutter" />
                <option value="SwiftUI" />
                <option value="Objective-C" />
                <option value="Jetpack Compose" />
                <option value="Android" />
                <option value="iOS" />
                <option value="Xcode" />
                <option value="Android Studio" />
                <option value="Fastlane" />
                <option value="CocoaPods" />
                <option value="Swift Package Manager" />
                <option value="Gradle" />
                <option value="Maven" />
                <option value="Capacitor" />
                <option value="Ionic" />
                <option value="Cordova" />
                <option value="Electron" />
                <option value="Tauri" />
                <option value="Wails" />
                <option value="Neutralino" />

                {/* Testing */}
                <option value="Puppeteer" />
                <option value="Selenium" />
                <option value="WebdriverIO" />
                <option value="Nightwatch" />
                <option value="TestCafe" />
                <option value="Mocha" />
                <option value="Chai" />
                <option value="Jasmine" />
                <option value="AVA" />
                <option value="uvu" />
                <option value="SuperTest" />
                <option value="MSW" />
                <option value="Pact" />
                <option value="k6" />
                <option value="Locust" />
                <option value="Gatling" />
                <option value="JMeter" />
                <option value="Artillery" />
                <option value="Vegeta" />
                <option value="wrk" />
                <option value="Hey" />
                <option value="Bombardier" />
                <option value="Postman Tests" />
                <option value="Newman" />
                <option value="Schemathesis" />
                <option value="Dredd" />

                {/* UI/UX Design */}
                <option value="Framer" />
                <option value="Principle" />
                <option value="ProtoPie" />
                <option value="After Effects" />
                <option value="Lottie" />
                <option value="Rive" />
                <option value="Spline" />
                <option value="Blender" />
                <option value="Cinema 4D" />
                <option value="Three.js" />
                <option value="GSAP" />
                <option value="Framer Motion" />
                <option value="React Spring" />
                <option value="Motion One" />
                <option value="Anime.js" />
                <option value="Lenis" />
                <option value="ScrollTrigger" />
                <option value="React Three Fiber" />
                <option value="React Three Drei" />

                {/* Architecture & Patterns */}
                <option value="Microservices" />
                <option value="Monolith" />
                <option value="Serverless" />
                <option value="Event-Driven" />
                <option value="CQRS" />
                <option value="Event Sourcing" />
                <option value="Domain-Driven Design" />
                <option value="DDD" />
                <option value="Clean Architecture" />
                <option value="Hexagonal Architecture" />
                <option value="Onion Architecture" />
                <option value="SOLID Principles" />
                <option value="Design Patterns" />
                <option value="TDD" />
                <option value="BDD" />
                <option value="API Design" />
                <option value="REST" />
                <option value="gRPC" />
                <option value="Protocol Buffers" />
                <option value="MessagePack" />
                <option value="Apache Thrift" />
                <option value="WebSockets" />
                <option value="Server-Sent Events" />
                <option value="SSE" />
                <option value="WebRTC" />
                <option value="MQTT" />
                <option value="AMQP" />
                <option value="RabbitMQ" />
                <option value="Apache Pulsar" />
                <option value="NATS" />
                <option value="Redis Pub/Sub" />
                <option value="Kafka" />
                <option value="Redpanda" />

                {/* Other / Miscellaneous */}
                <option value="Agile" />
                <option value="Scrum" />
                <option value="Kanban" />
                <option value="CI/CD" />
                <option value="GitOps" />
                <option value="Observability" />
                <option value="SRE" />
                <option value="DevSecOps" />
                <option value="WebAssembly" />
                <option value="WASM" />
                <option value="Electron" />
                <option value="Tauri" />
                <option value="WebGL" />
                <option value="WebGPU" />
                <option value="OpenGL" />
                <option value="Vulkan" />
                <option value="DirectX" />
                <option value="Unity" />
                <option value="Unreal Engine" />
                <option value="Godot" />
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
                <option value="AI and Machine Learning">AI and Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Databases">Databases</option>
                <option value="Mobile">Mobile</option>
                <option value="Testing">Testing</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Architecture">Architecture</option>
                <option value="Other">Other</option>
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
                    category: "Languages",
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