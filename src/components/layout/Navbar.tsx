"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [hydrated, setHydrated] = useState(false); // ⭐ prevents hydration mismatch
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const pathname = usePathname();

    useEffect(() => {
        setHydrated(true); // ⭐ ensures theme icon only renders client-side

        // Check localStorage first
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

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        if (prefersDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up or at top
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY <= 0 ? 0 : currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
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
        // Handle exact matches and prefix matches for nested routes
        if (pathname === href) return styles.activeLink;
        if (href !== "/" && pathname.startsWith(href)) return styles.activeLink;
        return "";
    };

    return (
        <nav
            className={`${styles.navbar} ${isVisible ? "" : styles.hidden}`}
        >
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Emmanuel
                </Link>

                <div className={styles.links}>
                    <Link
                        href="/"
                        className={`${styles.link} ${getActiveClass("/")}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/projects"
                        className={`${styles.link} ${getActiveClass("/projects")}`}
                    >
                        Projects
                    </Link>
                    <Link
                        href="/contact"
                        className={`${styles.link} ${getActiveClass("/contact")}`}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/blog"
                        className={`${styles.link} ${getActiveClass("/blog")}`}
                    >
                        Blog
                    </Link>
                    {/* Upload Resume link - for development/admin use */}
                    <Link
                        href="/upload-resume"
                        className={`${styles.link} ${getActiveClass("/upload-resume")} ${styles.adminLink}`}
                    >
                        Upload Resume
                    </Link>
                </div>

                {/* Search Bar - Desktop only */}
                <div className={styles.searchContainer}>
                    <SearchBar />
                </div>

                <div
                    className={styles.mobileToggle}
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </div>

                <button
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                >
                    {/* ⭐ Only render icon after hydration */}
                    <span suppressHydrationWarning>
                        {hydrated && (isDark ? "☀️" : "🌙")}
                    </span>
                </button>
            </div>

            {open && (
                <div
                    className={`${styles.mobileMenu} ${styles.mobileMenuVisible}`}
                    onClick={() => setOpen(false)} // Close when clicking a link
                >
                    <Link
                        href="/"
                        className={`${styles.mobileLink} ${getActiveClass("/")}`}
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/projects"
                        className={`${styles.mobileLink} ${getActiveClass("/projects")}`}
                        onClick={() => setOpen(false)}
                    >
                        Projects
                    </Link>
                    <Link
                        href="/contact"
                        className={`${styles.mobileLink} ${getActiveClass("/contact")}`}
                        onClick={() => setOpen(false)}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/blog"
                        className={`${styles.mobileLink} ${getActiveClass("/blog")}`}
                        onClick={() => setOpen(false)}
                    >
                        Blog
                    </Link>
                    {/* Upload Resume link in mobile menu */}
                    <Link
                        href="/upload-resume"
                        className={`${styles.mobileLink} ${getActiveClass("/upload-resume")} ${styles.adminLink}`}
                        onClick={() => setOpen(false)}
                    >
                        Upload Resume
                    </Link>
                </div>
            )}
        </nav>
    );
}