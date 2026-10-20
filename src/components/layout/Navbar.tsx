"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const navbarRef = useRef<HTMLNavElement>(null);

  // Hydration and theme initialization
  useEffect(() => {
    setHydrated(true);

    const saved = localStorage.getItem("theme");
    if (saved) {
      const dark = saved === "dark";
      setIsDark(dark);
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Scroll handling - hide on scroll down, show on scroll up + progress
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Update scrolled state for navbar styling
      setIsScrolled(currentScrollY > 50);

      // Calculate scroll progress for progress bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? currentScrollY / docHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));

      lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDark = !isDark;

    setIsDark(newDark);
    html.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  // Get active class based on current pathname
  const getActiveClass = (href: string) => {
    if (pathname === href) return styles.activeLink;
    if (href !== "/" && pathname.startsWith(href)) return styles.activeLink;
    return "";
  };

  // Apply scroll progress as CSS custom property
  const navbarStyle = {
    '--scroll-progress': scrollProgress
  } as React.CSSProperties;

  return (
    <nav
      ref={navbarRef}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""} ${isVisible ? "" : styles.hidden}`}
      style={navbarStyle}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Go to homepage">
          Emmanuel
        </Link>

        <div className={styles.links}>
          <Link
            href="/"
            className={`${styles.link} ${getActiveClass("/")}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`${styles.link} ${getActiveClass("/projects")}`}
            aria-current={pathname.startsWith("/projects") && pathname !== "/projects" ? "page" : undefined}
          >
            Projects
          </Link>
          <Link
            href="/workExperience"
            className={`${styles.link} ${getActiveClass("/workExperience")}`}
            aria-current={pathname === "/workExperience" ? "page" : undefined}
          >
            Experience
          </Link>
          <Link
            href="/certifications"
            className={`${styles.link} ${getActiveClass("/certifications")}`}
            aria-current={pathname === "/certifications" ? "page" : undefined}
          >
            Certifications
          </Link>
          <Link
            href="/contact"
            className={`${styles.link} ${getActiveClass("/contact")}`}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </div>

        {/* Search Bar - Desktop only */}
        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        {/* Theme Toggle */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDark}
        >
          <span suppressHydrationWarning aria-hidden="true">
            {hydrated && (isDark ? "☀️" : "🌙")}
          </span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${styles.mobileMenuVisible}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            className={`${styles.mobileLink} ${getActiveClass("/")}`}
            onClick={() => setOpen(false)}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`${styles.mobileLink} ${getActiveClass("/projects")}`}
            onClick={() => setOpen(false)}
            aria-current={pathname.startsWith("/projects") && pathname !== "/projects" ? "page" : undefined}
          >
            Projects
          </Link>
          <Link
            href="/workExperience"
            className={`${styles.mobileLink} ${getActiveClass("/workExperience")}`}
            onClick={() => setOpen(false)}
            aria-current={pathname === "/workExperience" ? "page" : undefined}
          >
            Experience
          </Link>
          <Link
            href="/certifications"
            className={`${styles.mobileLink} ${getActiveClass("/certifications")}`}
            onClick={() => setOpen(false)}
            aria-current={pathname === "/certifications" ? "page" : undefined}
          >
            Certifications
          </Link>
          <Link
            href="/contact"
            className={`${styles.mobileLink} ${getActiveClass("/contact")}`}
            onClick={() => setOpen(false)}
            aria-current={pathname === "/contact" ? "page" : undefined}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}