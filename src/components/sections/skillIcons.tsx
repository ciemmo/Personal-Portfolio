"use client";

import * as React from "react";

// Inline SVG icons for skills - replaces react-icons/fa, react-icons/si, react-icons/tb
// This significantly reduces bundle size by avoiding 3 separate icon packages

interface SkillIconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

const createIcon = (svgContent: React.ReactNode) => {
  const Icon = React.forwardRef<SVGSVGElement, SkillIconProps>(
    (props, ref) => {
      const { size = 28, className = "", "aria-hidden": ariaHidden = true, ...restProps } = props;
      return (
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
          {svgContent}
        </svg>
      );
    }
  );
  Icon.displayName = "SkillIcon";
  return Icon;
};

// Programming Languages
export const SiJavascript = createIcon(
  <>
    <path d="M18 13v6a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2V8a2 2 0 0 1 2 -2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </>
);
export const SiTypescript = createIcon(
  <>
    <path d="M4 7v10" />
    <path d="M9 7v10" />
    <path d="M14 7h4" />
    <path d="M14 12h4" />
    <path d="M14 17h4" />
    <path d="M4 7h5" />
    <path d="M9 7h5" />
  </>
);
export const SiPython = createIcon(
  <>
    <path d="M14 7h-4v10h4" />
    <path d="M10 17h4" />
    <path d="M10 7v10" />
    <path d="M18 7v10" />
  </>
);
export const SiJava = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiCsharp = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8.5 8h7" />
    <path d="M12 8v8" />
    <path d="M15.5 16h-7" />
  </>
);
export const SiCplusplus = createIcon(
  <>
    <path d="M6 18L18 6M6 6l12 12" />
    <path d="M6 18L18 6M6 6l12 12" />
  </>
);
export const SiHtml5 = createIcon(
  <>
    <path d="M12 2L2 7l0 10 10 5 10 -5V7L12 2z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiCss3 = createIcon(
  <>
    <path d="M12 2L2 7l0 10 10 5 10 -5V7L12 2z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiDatabase = createIcon(
  <>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66 -4 3 -9 3s-9 -1.34 -9 -3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9 -1.34 9 -3V5" />
  </>
);

// Frameworks & Libraries
export const SiReact = createIcon(
  <>
    <ellipse cx="12" cy="12" rx="10" ry="10" />
    <ellipse cx="12" cy="12" rx="4" ry="4" />
    <path d="M12 2a10 10 0 0 0 -10 10" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2a10 10 0 0 1 10 10" />
    <path d="M12 2a10 10 0 0 0 10 10" />
  </>
);
export const SiNextjs = createIcon(
  <>
    <path d="M12 2L22 20L2 20Z" />
    <path d="M12 2v20M2 20h20" />
  </>
);
export const SiNodejs = createIcon(
  <>
    <ellipse cx="12" cy="12" rx="10" ry="10" />
    <path d="M8 14h8M8 10h8M8 18h8" />
  </>
);
export const SiExpress = createIcon(
  <>
    <ellipse cx="12" cy="12" rx="10" ry="10" />
    <path d="M8 14h8M8 10h8M8 18h8" />
  </>
);
export const SiMongodb = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiSpring = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiDotnet = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiRubyonrails = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiLaravel = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiWordpress = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);
export const SiShopify = createIcon(
  <>
    <path d="M12 2L2 7l10 5 10 -5 -10 -5z" />
    <path d="M2 17l10 5 10 -5" />
    <path d="M2 12l10 5 10 -5" />
  </>
);

// Tools & Platforms
export const SiGit = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiDocker = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiKubernetes = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiLinux = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiAndroid = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiFigma = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);
export const SiAws = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
);

// Default fallback icon
export const SiCode = createIcon(
  <>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </>
);

// Additional icons from Certifications.tsx (replacing react-icons/fa)
export const FaAngleDown = createIcon(
  <>
    <polyline points="6 9 12 15 18 9" />
  </>
);

export const FaCheckCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 6-6" />
  </>
);

export const FaExclamationTriangle = createIcon(
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>
);

export const FaTimesCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </>
);

export const FaSearch = createIcon(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const FaFilter = createIcon(
  <>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </>
);

// Skill to icon mapping
export const skillIcons: Record<string, React.ComponentType<SkillIconProps>> = {
  // Programming Languages
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "Python": SiPython,
  "Java": SiJava,
  "C#": SiCsharp,
  "C++": SiCplusplus,
  "HTML": SiHtml5,
  "CSS": SiCss3,
  "SQL": SiDatabase,

  // Frameworks & Libraries
  "React": SiReact,
  "Next.js": SiNextjs,
  "Node.js": SiNodejs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Spring": SiSpring,
  ".NET": SiDotnet,
  "Ruby on Rails": SiRubyonrails,
  "Laravel": SiLaravel,
  "WordPress": SiWordpress,
  "Shopify": SiShopify,

  // Tools & Platforms
  "Git": SiGit,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "Linux": SiLinux,
  "Android": SiAndroid,
  "Figma": SiFigma,
  "AWS": SiAws,
};