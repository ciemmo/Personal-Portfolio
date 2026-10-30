"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";

// ========================================
// DEVICON-BASED SKILL ICONS (Runtime Fetch Approach)
// ========================================
// This replaces the massive manual SVG icon file with Devicon's official icons
// Uses runtime fetch from Devicon CDN to avoid build-time memory issues
// Devicon provides 657+ official technology icons as SVGs

export interface SkillIconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
  color?: string; // For color customization
}

/**
 * Mapping from skill names (as stored in database) to Devicon icon folder names
 * Format: "Skill Name" -> "devicon-folder-name"
 * Uses "original" variant for colored icons, "plain" for single-color
 */
const DEVICON_MAPPING: Record<string, { folder: string; variant?: "original" | "plain" | "original-wordmark" | "plain-wordmark" }> = {
  // Programming Languages
  "JavaScript": { folder: "javascript", variant: "original" },
  "TypeScript": { folder: "typescript", variant: "original" },
  "Python": { folder: "python", variant: "original" },
  "Java": { folder: "java", variant: "original" },
  "C#": { folder: "csharp", variant: "original" },
  "C++": { folder: "cplusplus", variant: "original" },
  "HTML": { folder: "html5", variant: "original" },
  "CSS": { folder: "css3", variant: "original" },
  "SQL": { folder: "postgresql", variant: "original" }, // Using PostgreSQL as generic SQL
  "Go": { folder: "go", variant: "original" },
  "Rust": { folder: "rust", variant: "original" },
  "Swift": { folder: "swift", variant: "original" },
  "Kotlin": { folder: "kotlin", variant: "original" },
  "Ruby": { folder: "ruby", variant: "original" },
  "PHP": { folder: "php", variant: "original" },
  "R": { folder: "r", variant: "original" },
  "MATLAB": { folder: "matlab", variant: "original" },
  "Scala": { folder: "scala", variant: "original" },
  "Dart": { folder: "dart", variant: "original" },
  "Lua": { folder: "lua", variant: "original" },
  "Perl": { folder: "perl", variant: "original" },
  "Shell": { folder: "bash", variant: "original" },
  "PowerShell": { folder: "powershell", variant: "original" },
  "GraphQL": { folder: "graphql", variant: "original" },
  "REST API": { folder: "postman", variant: "original" },

  // Frontend Frameworks & Libraries
  "React": { folder: "react", variant: "original" },
  "Next.js": { folder: "nextjs", variant: "original" },
  "Vue.js": { folder: "vuejs", variant: "original" },
  "Nuxt.js": { folder: "nuxtjs", variant: "original" },
  "Angular": { folder: "angular", variant: "original" },
  "Svelte": { folder: "svelte", variant: "original" },
  "SolidJS": { folder: "solidjs", variant: "original" },
  "Astro": { folder: "astro", variant: "original" },
  "Qwik": { folder: "qwik", variant: "original" },
  "Remix": { folder: "remix", variant: "original" },
  "Gatsby": { folder: "gatsby", variant: "original" },
  "Preact": { folder: "preact", variant: "original" },
  "Alpine.js": { folder: "alpinejs", variant: "original" },
  "Lit": { folder: "lit", variant: "original" },
  "Stencil": { folder: "stencil", variant: "original" },
  "jQuery": { folder: "jquery", variant: "original" },
  "HTMX": { folder: "htmx", variant: "original" },
  "Tailwind CSS": { folder: "tailwindcss", variant: "original" },
  "Bootstrap": { folder: "bootstrap", variant: "original" },
  "Material UI": { folder: "mui", variant: "original" },
  "Chakra UI": { folder: "chakraui", variant: "original" },
  "Radix UI": { folder: "radixui", variant: "original" },
  "Shadcn UI": { folder: "shadcnui", variant: "original" },
  "Styled Components": { folder: "styledcomponents", variant: "original" },
  "Emotion": { folder: "emotion", variant: "original" },
  "CSS Modules": { folder: "css3", variant: "original" },
  "Sass": { folder: "sass", variant: "original" },
  "Less": { folder: "less", variant: "original" },
  "PostCSS": { folder: "postcss", variant: "original" },
  "Vite": { folder: "vite", variant: "original" },
  "Webpack": { folder: "webpack", variant: "original" },
  "Turbopack": { folder: "turbopack", variant: "original" },
  "Rollup": { folder: "rollupjs", variant: "original" },
  "esbuild": { folder: "esbuild", variant: "original" },
  "Parcel": { folder: "parcel", variant: "original" },
  "Rome": { folder: "rome", variant: "original" },
  "Biome": { folder: "biome", variant: "original" },
  "ESLint": { folder: "eslint", variant: "original" },
  "Prettier": { folder: "prettier", variant: "original" },
  "TypeScript ESLint": { folder: "eslint", variant: "original" },
  "Jest": { folder: "jest", variant: "original" },
  "Vitest": { folder: "vitest", variant: "original" },
  "Playwright": { folder: "playwright", variant: "original" },
  "Cypress": { folder: "cypressio", variant: "original" },
  "Testing Library": { folder: "testinglibrary", variant: "original" },
  "Storybook": { folder: "storybook", variant: "original" },
  "Chromatic": { folder: "chromatic", variant: "original" },

  // Backend Frameworks & Libraries
  "Node.js": { folder: "nodejs", variant: "original" },
  "Express": { folder: "express", variant: "original" },
  "Fastify": { folder: "fastify", variant: "original" },
  "NestJS": { folder: "nestjs", variant: "original" },
  "Koa": { folder: "koa", variant: "original" },
  "Hono": { folder: "hono", variant: "original" },
  "Bun": { folder: "bun", variant: "original" },
  "Deno": { folder: "deno", variant: "original" },
  "Spring Boot": { folder: "spring", variant: "original" },
  "Quarkus": { folder: "quarkus", variant: "original" },
  "Micronaut": { folder: "micronaut", variant: "original" },
  ".NET": { folder: "dotnet", variant: "original" },
  "ASP.NET Core": { folder: "dotnet", variant: "original" },
  "Django": { folder: "django", variant: "original" },
  "FastAPI": { folder: "fastapi", variant: "original" },
  "Flask": { folder: "flask", variant: "original" },
  "Starlette": { folder: "starlette", variant: "original" },
  "Laravel": { folder: "laravel", variant: "original" },
  "Symfony": { folder: "symfony", variant: "original" },
  "Ruby on Rails": { folder: "rails", variant: "original" },
  "Sinatra": { folder: "sinatra", variant: "original" },
  "Phoenix": { folder: "phoenixframework", variant: "original" },
  "Elixir": { folder: "elixir", variant: "original" },
  "Go Fiber": { folder: "fiber", variant: "original" },
  "Gin": { folder: "gin", variant: "original" },
  "Echo": { folder: "echo", variant: "original" },
  "Actix": { folder: "actix", variant: "original" },
  "Axum": { folder: "axum", variant: "original" },
  "Rocket": { folder: "rocket", variant: "original" },

  // AI and Machine Learning
  "ChatGPT": { folder: "chatgpt", variant: "original" },
  "OpenAI API": { folder: "openai", variant: "original" },
  "LangChain": { folder: "langchain", variant: "original" },
  "LlamaIndex": { folder: "llamaindex", variant: "original" },
  "AutoGPT": { folder: "autogpt", variant: "original" },
  "Hugging Face": { folder: "huggingface", variant: "original" },
  "TensorFlow": { folder: "tensorflow", variant: "original" },
  "PyTorch": { folder: "pytorch", variant: "original" },
  "JAX": { folder: "jax", variant: "original" },
  "Keras": { folder: "keras", variant: "original" },
  "Scikit-learn": { folder: "scikitlearn", variant: "original" },
  "XGBoost": { folder: "xgboost", variant: "original" },
  "LightGBM": { folder: "lightgbm", variant: "original" },
  "CatBoost": { folder: "catboost", variant: "original" },
  "ONNX": { folder: "onnx", variant: "original" },
  "MLflow": { folder: "mlflow", variant: "original" },
  "Weights & Biases": { folder: "wandb", variant: "original" },
  "ClearML": { folder: "clearml", variant: "original" },
  "Ray": { folder: "ray", variant: "original" },
  "DeepSpeed": { folder: "deepspeed", variant: "original" },
  "LoRA": { folder: "lora", variant: "original" },
  "QLoRA": { folder: "qlora", variant: "original" },
  "vLLM": { folder: "vllm", variant: "original" },
  "Ollama": { folder: "ollama", variant: "original" },
  "Llama.cpp": { folder: "llamacpp", variant: "original" },
  "LangGraph": { folder: "langgraph", variant: "original" },
  "LangSmith": { folder: "langsmith", variant: "original" },
  "RAG": { folder: "rag", variant: "original" },
  "Vector Databases": { folder: "vectordb", variant: "original" },
  "Pinecone": { folder: "pinecone", variant: "original" },
  "Weaviate": { folder: "weaviate", variant: "original" },
  "Qdrant": { folder: "qdrant", variant: "original" },
  "Milvus": { folder: "milvus", variant: "original" },
  "Chroma": { folder: "chroma", variant: "original" },
  "LangChain.js": { folder: "langchain", variant: "original" },
  "OpenAI JavaScript": { folder: "openai", variant: "original" },
  "Anthropic": { folder: "anthropic", variant: "original" },
  "Claude": { folder: "claude", variant: "original" },
  "Claude Code": { folder: "claude", variant: "original" },
  "Gemini": { folder: "gemini", variant: "original" },
  "PaLM": { folder: "palm", variant: "original" },
  "Mistral": { folder: "mistral", variant: "original" },
  "Zephyr": { folder: "zephyr", variant: "original" },
  "Phi": { folder: "phi", variant: "original" },

  // Data Science & Analytics
  "Pandas": { folder: "pandas", variant: "original" },
  "NumPy": { folder: "numpy", variant: "original" },
  "Polars": { folder: "polars", variant: "original" },
  "DuckDB": { folder: "duckdb", variant: "original" },
  "Apache Spark": { folder: "apachespark", variant: "original" },
  "Apache Flink": { folder: "apacheflink", variant: "original" },
  "Apache Kafka": { folder: "apachekafka", variant: "original" },
  "Apache Airflow": { folder: "apacheairflow", variant: "original" },
  "dbt": { folder: "dbt", variant: "original" },
  "Snowflake": { folder: "snowflake", variant: "original" },
  "BigQuery": { folder: "bigquery", variant: "original" },
  "Redshift": { folder: "redshift", variant: "original" },
  "Databricks": { folder: "databricks", variant: "original" },
  "Tableau": { folder: "tableau", variant: "original" },
  "Power BI": { folder: "powerbi", variant: "original" },
  "Looker": { folder: "looker", variant: "original" },
  "Metabase": { folder: "metabase", variant: "original" },
  "Superset": { folder: "superset", variant: "original" },
  "Grafana": { folder: "grafana", variant: "original" },
  "Prometheus": { folder: "prometheus", variant: "original" },
  "InfluxDB": { folder: "influxdb", variant: "original" },
  "TimescaleDB": { folder: "timescaledb", variant: "original" },
  "ClickHouse": { folder: "clickhouse", variant: "original" },
  "Apache Druid": { folder: "druid", variant: "original" },
  "Trino": { folder: "trino", variant: "original" },
  "Presto": { folder: "presto", variant: "original" },

  // Databases
  "PostgreSQL": { folder: "postgresql", variant: "original" },
  "MySQL": { folder: "mysql", variant: "original" },
  "MariaDB": { folder: "mariadb", variant: "original" },
  "MongoDB": { folder: "mongodb", variant: "original" },
  "Redis": { folder: "redis", variant: "original" },
  "Valkey": { folder: "valkey", variant: "original" },
  "SQLite": { folder: "sqlite", variant: "original" },
  "DynamoDB": { folder: "dynamodb", variant: "original" },
  "Firestore": { folder: "firebase", variant: "original" },
  "Cassandra": { folder: "cassandra", variant: "original" },
  "Couchbase": { folder: "couchbase", variant: "original" },
  "Neo4j": { folder: "neo4j", variant: "original" },
  "ArangoDB": { folder: "arangodb", variant: "original" },
  "SurrealDB": { folder: "surrealdb", variant: "original" },
  "Fauna": { folder: "faunadb", variant: "original" },
  "PlanetScale": { folder: "planetscale", variant: "original" },
  "Neon": { folder: "neon", variant: "original" },
  "Supabase": { folder: "supabase", variant: "original" },
  "Firebase": { folder: "firebase", variant: "original" },
  "Appwrite": { folder: "appwrite", variant: "original" },
  "PocketBase": { folder: "pocketbase", variant: "original" },
  "Turso": { folder: "turso", variant: "original" },
  "Prisma": { folder: "prisma", variant: "original" },
  "Drizzle ORM": { folder: "drizzle", variant: "original" },
  "TypeORM": { folder: "typeorm", variant: "original" },
  "Sequelize": { folder: "sequelize", variant: "original" },
  "Mongoose": { folder: "mongoose", variant: "original" },
  "SQLAlchemy": { folder: "sqlalchemy", variant: "original" },
  "Prisma Client": { folder: "prisma", variant: "original" },
  "Knex": { folder: "knexjs", variant: "original" },
  "Objection.js": { folder: "objection", variant: "original" },
  "Entity Framework": { folder: "entityframeworkcore", variant: "original" },
  "Hibernate": { folder: "hibernate", variant: "original" },
  "JPA": { folder: "jpa", variant: "original" },
  "MyBatis": { folder: "mybatis", variant: "original" },

  // Cloud Platforms & DevOps
  "AWS": { folder: "amazonwebservices", variant: "original" },
  "Google Cloud": { folder: "googlecloud", variant: "original" },
  "Azure": { folder: "azure", variant: "original" },
  "Vercel": { folder: "vercel", variant: "original" },
  "Netlify": { folder: "netlify", variant: "original" },
  "Cloudflare": { folder: "cloudflare", variant: "original" },
  "Cloudflare Pages": { folder: "cloudflarepages", variant: "original" },
  "Cloudflare Workers": { folder: "cloudflareworkers", variant: "original" },
  "Railway": { folder: "railway", variant: "original" },
  "Render": { folder: "render", variant: "original" },
  "Fly.io": { folder: "flyio", variant: "original" },
  "DigitalOcean": { folder: "digitalocean", variant: "original" },
  "Linode": { folder: "linode", variant: "original" },
  "Hetzner": { folder: "hetzner", variant: "original" },
  "Scaleway": { folder: "scaleway", variant: "original" },
  "Vultr": { folder: "vultr", variant: "original" },
  "Heroku": { folder: "heroku", variant: "original" },
  "Docker": { folder: "docker", variant: "original" },
  "Podman": { folder: "podman", variant: "original" },
  "Kubernetes": { folder: "kubernetes", variant: "original" },
  "K3s": { folder: "k3s", variant: "original" },
  "K9s": { folder: "k9s", variant: "original" },
  "Helm": { folder: "helm", variant: "original" },
  "ArgoCD": { folder: "argocd", variant: "original" },
  "Flux": { folder: "flux", variant: "original" },
  "Terraform": { folder: "terraform", variant: "original" },
  "OpenTofu": { folder: "opentofu", variant: "original" },
  "Pulumi": { folder: "pulumi", variant: "original" },
  "Crossplane": { folder: "crossplane", variant: "original" },
  "Ansible": { folder: "ansible", variant: "original" },
  "Chef": { folder: "chef", variant: "original" },
  "Puppet": { folder: "puppet", variant: "original" },
  "SaltStack": { folder: "saltstack", variant: "original" },
  "Packer": { folder: "packer", variant: "original" },
  "Vagrant": { folder: "vagrant", variant: "original" },
  "GitHub Actions": { folder: "githubactions", variant: "original" },
  "GitLab CI/CD": { folder: "gitlab", variant: "original" },
  "CircleCI": { folder: "circleci", variant: "original" },
  "Jenkins": { folder: "jenkins", variant: "original" },
  "TeamCity": { folder: "teamcity", variant: "original" },
  "Bamboo": { folder: "bamboo", variant: "original" },
  "Drone": { folder: "drone", variant: "original" },
  "Buildkite": { folder: "buildkite", variant: "original" },
  "Codefresh": { folder: "codefresh", variant: "original" },
  "Semaphore": { folder: "semaphore", variant: "original" },
  "Travis CI": { folder: "travis", variant: "original" },
  "Bitbucket Pipelines": { folder: "bitbucket", variant: "original" },
  "Azure DevOps": { folder: "azuredevops", variant: "original" },
  "AWS CodePipeline": { folder: "aws", variant: "original" },
  "Google Cloud Build": { folder: "googlecloud", variant: "original" },
  "Argo Workflows": { folder: "argoworkflows", variant: "original" },
  "Tekton": { folder: "tekton", variant: "original" },
  "Knative": { folder: "knative", variant: "original" },
  "Istio": { folder: "istio", variant: "original" },
  "Linkerd": { folder: "linkerd", variant: "original" },
  "Consul": { folder: "consul", variant: "original" },
  "Vault": { folder: "vault", variant: "original" },
  "Nomad": { folder: "nomad", variant: "original" },
  "Envoy": { folder: "envoy", variant: "original" },
  "NGINX": { folder: "nginx", variant: "original" },
  "Traefik": { folder: "traefikproxy", variant: "original" },
  "Caddy": { folder: "caddy", variant: "original" },
  "HAProxy": { folder: "haproxy", variant: "original" },
  "Apache": { folder: "apache", variant: "original" },

  // Developer Tools
  "Git": { folder: "git", variant: "original" },
  "GitHub": { folder: "github", variant: "original" },
  "GitLab": { folder: "gitlab", variant: "original" },
  "Bitbucket": { folder: "bitbucket", variant: "original" },
  "GitHub Desktop": { folder: "githubdesktop", variant: "original" },
  "GitKraken": { folder: "gitkraken", variant: "original" },
  "SourceTree": { folder: "sourcetree", variant: "original" },
  "LazyGit": { folder: "lazygit", variant: "original" },
  "VS Code": { folder: "vscode", variant: "original" },
  "Visual Studio": { folder: "visualstudio", variant: "original" },
  "JetBrains IDEs": { folder: "jetbrains", variant: "original" },
  "IntelliJ IDEA": { folder: "intellij", variant: "original" },
  "WebStorm": { folder: "webstorm", variant: "original" },
  "PyCharm": { folder: "pycharm", variant: "original" },
  "GoLand": { folder: "goland", variant: "original" },
  "RustRover": { folder: "rustrover", variant: "original" },
  "CLion": { folder: "clion", variant: "original" },
  "Rider": { folder: "rider", variant: "original" },
  "DataGrip": { folder: "datagrip", variant: "original" },
  "Neovim": { folder: "neovim", variant: "original" },
  "Vim": { folder: "vim", variant: "original" },
  "Emacs": { folder: "emacs", variant: "original" },
  "Helix": { folder: "helix", variant: "original" },
  "Zed": { folder: "zed", variant: "original" },
  "Cursor": { folder: "cursor", variant: "original" },
  "Windsurf": { folder: "windsurf", variant: "original" },
  "GitHub Copilot": { folder: "githubcopilot", variant: "original" },
  "Codeium": { folder: "codeium", variant: "original" },
  "Tabnine": { folder: "tabnine", variant: "original" },
  "Continue": { folder: "continue", variant: "original" },
  "Sourcegraph": { folder: "sourcegraph", variant: "original" },
  "Postman": { folder: "postman", variant: "original" },
  "Insomnia": { folder: "insomnia", variant: "original" },
  "Hoppscotch": { folder: "hoppscotch", variant: "original" },
  "Bruno": { folder: "bruno", variant: "original" },
  "Thunder Client": { folder: "thunderclient", variant: "original" },
  "Figma": { folder: "figma", variant: "original" },
  "FigJam": { folder: "figjam", variant: "original" },
  "Sketch": { folder: "sketch", variant: "original" },
  "Adobe XD": { folder: "adobexd", variant: "original" },
  "Penpot": { folder: "penpot", variant: "original" },
  "Zeplin": { folder: "zeplin", variant: "original" },
  "Zeroheight": { folder: "zeroheight", variant: "original" },
  "Notion": { folder: "notion", variant: "original" },
  "Obsidian": { folder: "obsidian", variant: "original" },
  "Logseq": { folder: "logseq", variant: "original" },
  "Roam Research": { folder: "roamresearch", variant: "original" },
  "Linear": { folder: "linear", variant: "original" },
  "Jira": { folder: "jira", variant: "original" },
  "GitHub Projects": { folder: "github", variant: "original" },
  "GitLab Issues": { folder: "gitlab", variant: "original" },
  "ClickUp": { folder: "clickup", variant: "original" },
  "Trello": { folder: "trello", variant: "original" },
  "Asana": { folder: "asana", variant: "original" },
  "Monday.com": { folder: "monday", variant: "original" },
  "Height": { folder: "height", variant: "original" },
  "Shortcut": { folder: "shortcut", variant: "original" },
  "Slack": { folder: "slack", variant: "original" },
  "Discord": { folder: "discordjs", variant: "original" },
  "Microsoft Teams": { folder: "teams", variant: "original" },
  "Zoom": { folder: "zoom", variant: "original" },
  "Loom": { folder: "loom", variant: "original" },
  "Miro": { folder: "miro", variant: "original" },
  "Whimsical": { folder: "whimsical", variant: "original" },
  "Excalidraw": { folder: "excalidraw", variant: "original" },
  "Draw.io": { folder: "drawio", variant: "original" },
  "PlantUML": { folder: "plantuml", variant: "original" },
  "Mermaid": { folder: "mermaid", variant: "original" },
  "Graphviz": { folder: "graphviz", variant: "original" },

  // Mobile Development
  "React Native": { folder: "reactnative", variant: "original" },
  "Expo": { folder: "expo", variant: "original" },
  "Flutter": { folder: "flutter", variant: "original" },
  "SwiftUI": { folder: "swift", variant: "original" },
  "Objective-C": { folder: "objectivec", variant: "original" },
  "Jetpack Compose": { folder: "jetpackcompose", variant: "original" },
  "Android": { folder: "android", variant: "original" },
  "iOS": { folder: "apple", variant: "original" },
  "Xcode": { folder: "xcode", variant: "original" },
  "Android Studio": { folder: "androidstudio", variant: "original" },
  "Fastlane": { folder: "fastlane", variant: "original" },
  "CocoaPods": { folder: "cocoapods", variant: "original" },
  "Swift Package Manager": { folder: "swiftpackagemanager", variant: "original" },
  "Gradle": { folder: "gradle", variant: "original" },
  "Maven": { folder: "maven", variant: "original" },
  "Capacitor": { folder: "capacitor", variant: "original" },
  "Ionic": { folder: "ionic", variant: "original" },
  "Cordova": { folder: "cordova", variant: "original" },
  "Electron": { folder: "electron", variant: "original" },
  "Tauri": { folder: "tauri", variant: "original" },
  "Wails": { folder: "wails", variant: "original" },
  "Neutralino": { folder: "neutralino", variant: "original" },

  // Testing
  "Puppeteer": { folder: "puppeteer", variant: "original" },
  "Selenium": { folder: "selenium", variant: "original" },
  "WebdriverIO": { folder: "webdriverio", variant: "original" },
  "Nightwatch": { folder: "nightwatch", variant: "original" },
  "TestCafe": { folder: "testcafe", variant: "original" },
  "Mocha": { folder: "mocha", variant: "original" },
  "Chai": { folder: "chai", variant: "original" },
  "Jasmine": { folder: "jasmine", variant: "original" },
  "AVA": { folder: "ava", variant: "original" },
  "uvu": { folder: "uvu", variant: "original" },
  "SuperTest": { folder: "supertest", variant: "original" },
  "MSW": { folder: "msw", variant: "original" },
  "Pact": { folder: "pact", variant: "original" },
  "k6": { folder: "k6", variant: "original" },
  "Locust": { folder: "locust", variant: "original" },
  "Gatling": { folder: "gatling", variant: "original" },
  "JMeter": { folder: "jmeter", variant: "original" },
  "Artillery": { folder: "artillery", variant: "original" },
  "Vegeta": { folder: "vegeta", variant: "original" },
  "wrk": { folder: "wrk", variant: "original" },
  "Hey": { folder: "hey", variant: "original" },
  "Bombardier": { folder: "bombardier", variant: "original" },
  "Postman Tests": { folder: "postman", variant: "original" },
  "Newman": { folder: "newman", variant: "original" },
  "Schemathesis": { folder: "schemathesis", variant: "original" },
  "Dredd": { folder: "dredd", variant: "original" },

  // UI/UX Design
  "Framer": { folder: "framer", variant: "original" },
  "Principle": { folder: "principle", variant: "original" },
  "ProtoPie": { folder: "protopie", variant: "original" },
  "After Effects": { folder: "aftereffects", variant: "original" },
  "Lottie": { folder: "lottie", variant: "original" },
  "Rive": { folder: "rive", variant: "original" },
  "Spline": { folder: "spline", variant: "original" },
  "Blender": { folder: "blender", variant: "original" },
  "Cinema 4D": { folder: "cinema4d", variant: "original" },
  "Three.js": { folder: "threejs", variant: "original" },
  "GSAP": { folder: "gsap", variant: "original" },
  "Framer Motion": { folder: "framermotion", variant: "original" },
  "React Spring": { folder: "reactspring", variant: "original" },
  "Motion One": { folder: "motionone", variant: "original" },
  "Anime.js": { folder: "animejs", variant: "original" },
  "Lenis": { folder: "lenis", variant: "original" },
  "ScrollTrigger": { folder: "scrolltrigger", variant: "original" },
  "React Three Fiber": { folder: "reactthreefiber", variant: "original" },
  "React Three Drei": { folder: "reactthreedrei", variant: "original" },

  // Architecture & Patterns
  "Microservices": { folder: "microservices", variant: "original" },
  "Monolith": { folder: "monolith", variant: "original" },
  "Serverless": { folder: "serverless", variant: "original" },
  "Event-Driven": { folder: "eventdriven", variant: "original" },
  "CQRS": { folder: "cqrs", variant: "original" },
  "Event Sourcing": { folder: "eventsourcing", variant: "original" },
  "Domain-Driven Design": { folder: "ddd", variant: "original" },
  "Clean Architecture": { folder: "cleanarchitecture", variant: "original" },
  "Hexagonal Architecture": { folder: "hexagonal", variant: "original" },
  "Onion Architecture": { folder: "onion", variant: "original" },
  "SOLID Principles": { folder: "solid", variant: "original" },
  "Design Patterns": { folder: "designpatterns", variant: "original" },
  "TDD": { folder: "tdd", variant: "original" },
  "BDD": { folder: "bdd", variant: "original" },
  "DDD": { folder: "ddd", variant: "original" },
  "API Design": { folder: "apidesign", variant: "original" },
  "REST": { folder: "rest", variant: "original" },
  "gRPC": { folder: "grpc", variant: "original" },
  "Protocol Buffers": { folder: "protobuf", variant: "original" },
  "MessagePack": { folder: "msgpack", variant: "original" },
  "Apache Thrift": { folder: "thrift", variant: "original" },
  "WebSockets": { folder: "websockets", variant: "original" },
  "Server-Sent Events": { folder: "sse", variant: "original" },
  "WebRTC": { folder: "webrtc", variant: "original" },
  "MQTT": { folder: "mqtt", variant: "original" },
  "AMQP": { folder: "amqp", variant: "original" },
  "RabbitMQ": { folder: "rabbitmq", variant: "original" },
  "Apache Pulsar": { folder: "pulsar", variant: "original" },
  "NATS": { folder: "nats", variant: "original" },
  "Redis Pub/Sub": { folder: "redis", variant: "original" },
  "Kafka": { folder: "apachekafka", variant: "original" },
  "Redpanda": { folder: "redpanda", variant: "original" },
};

// Devicon CDN base URL
const DEVICON_CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// Cache for fetched SVG content
const svgCache = new Map<string, string>();

/**
 * Fetch SVG content from Devicon CDN
 */
async function fetchDeviconSvg(folder: string, variant: string): Promise<string | null> {
  const cacheKey = `${folder}-${variant}`;

  // Check memory cache first
  if (svgCache.has(cacheKey)) {
    return svgCache.get(cacheKey)!;
  }

  // Try the requested variant first, then fallbacks
  const variantsToTry = [variant, "original", "original-wordmark", "plain", "plain-wordmark"];

  for (const v of variantsToTry) {
    const url = `${DEVICON_CDN}/${folder}/${folder}-${v}.svg`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const svgText = await response.text();
        svgCache.set(cacheKey, svgText);
        return svgText;
      }
    } catch (error) {
      // Continue to next variant
    }
  }

  return null;
}

/**
 * Fallback icon component for skills without Devicon equivalents
 */
const FallbackIcon = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 28, className = "", "aria-hidden": ariaHidden = true, color, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
);
FallbackIcon.displayName = "FallbackIcon";

/**
 * SkillIcon component that fetches and renders Devicon SVG at runtime
 */
const SkillIcon = React.memo(({ skillName }: { skillName: string }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mapping = useMemo(() => DEVICON_MAPPING[skillName], [skillName]);

  useEffect(() => {
    if (!mapping) {
      setLoading(false);
      setError(true);
      return;
    }

    let mounted = true;
    const { folder, variant = "original" } = mapping;

    async function loadSvg() {
      try {
        const svg = await fetchDeviconSvg(folder, variant);
        if (mounted) {
          if (svg) {
            setSvgContent(svg);
          } else {
            setError(true);
          }
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSvg();
    return () => { mounted = false; };
  }, [mapping]);

  if (loading) {
    return (
      <svg
        width={28}
        height={28}
        viewBox="0 0 24 24"
        className="animate-pulse"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.1" />
      </svg>
    );
  }

  if (error || !svgContent) {
    return <FallbackIcon size={28} className="skill-icon-fallback" />;
  }

  // Parse and modify SVG to ensure proper sizing and coloring
  let processedSvg = svgContent;

  // Remove existing width/height to allow CSS control
  processedSvg = processedSvg.replace(/\s(width|height)="[^"]*"/g, '');

  // Ensure viewBox exists
  if (!processedSvg.includes('viewBox')) {
    processedSvg = processedSvg.replace('<svg', '<svg viewBox="0 0 24 24"');
  }

  // Create a wrapper component that renders the SVG
  return (
    <div
      className="devicon-wrapper"
      style={{ width: 28, height: 28 }}
      dangerouslySetInnerHTML={{ __html: processedSvg }}
    />
  );
});
SkillIcon.displayName = "SkillIcon";

/**
 * Get the icon component for a skill name
 * Returns the SkillIcon component which will fetch and render the appropriate Devicon SVG
 */
export function getSkillIcon(skillName: string): React.ComponentType<SkillIconProps> {
  // Check if we have a mapping for this skill
  const mapping = DEVICON_MAPPING[skillName];

  // If no mapping, return fallback
  if (!mapping) {
    return FallbackIcon;
  }

  // Return the SkillIcon component with the skillName as a prop
  // We use a wrapper to pass the skillName
  const Wrapper = React.memo(({ size, className, "aria-hidden": ariaHidden, color, ...restProps }: SkillIconProps) => (
    <SkillIcon skillName={skillName} />
  ));
  Wrapper.displayName = `SkillIconWrapper(${skillName})`;

  return Wrapper;
}

/**
 * Preload icons for better performance (call during app initialization)
 */
export async function preloadSkillIcons(skillNames: string[]): Promise<void> {
  await Promise.all(
    skillNames.map(async (name) => {
      const mapping = DEVICON_MAPPING[name];
      if (mapping) {
        await fetchDeviconSvg(mapping.folder, mapping.variant || "original");
      }
    })
  );
}

/**
 * Get all available Devicon mappings (for debugging/admin)
 */
export function getDeviconMappings(): typeof DEVICON_MAPPING {
  return DEVICON_MAPPING;
}

/**
 * Check if a skill has a Devicon mapping
 */
export function hasDeviconMapping(skillName: string): boolean {
  return skillName in DEVICON_MAPPING;
}

// ========================================
// UI ICONS (for compatibility with existing components)
// These are simple inline SVG icons used for UI elements
// ========================================

// Angle Down - for dropdown/expand indicators
export const FaAngleDown = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
);
FaAngleDown.displayName = "FaAngleDown";

// Check Circle - for success/active states
export const FaCheckCircle = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 6-6" />
    </svg>
  )
);
FaCheckCircle.displayName = "FaCheckCircle";

// Exclamation Triangle - for warnings
export const FaExclamationTriangle = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
);
FaExclamationTriangle.displayName = "FaExclamationTriangle";

// Times Circle - for errors/close
export const FaTimesCircle = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
);
FaTimesCircle.displayName = "FaTimesCircle";

// Search - for search inputs
export const FaSearch = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
);
FaSearch.displayName = "FaSearch";

// Filter - for filter buttons
export const FaFilter = React.forwardRef<SVGSVGElement, SkillIconProps>(
  ({ size = 20, className = "", "aria-hidden": ariaHidden = true, ...restProps }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
      {...restProps}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
);
FaFilter.displayName = "FaFilter";

// Re-export the FallbackIcon for direct use if needed
export { FallbackIcon };