// Re-export from icons.tsx to satisfy Turbopack module resolution
// This file exists because Turbopack incorrectly tries to resolve skillIcons.tsx
// when importing from icons.tsx in InteractiveSkills.tsx

export {
  getSkillIcon,
  SkillIcon,
  preloadSkillIcons,
  getDeviconMappings,
  hasDeviconMapping,
  FallbackIcon,
  FaAngleDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
} from "./icons";

export type { SkillIconProps } from "./icons";