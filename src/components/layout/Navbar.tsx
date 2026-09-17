"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [hydrated, setHydrated] = useState(false); // ⭐ prevents hydration mismatch

    useEffect(() => {
        setHydrated(true); // ⭐ ensures theme icon only renders client-side

        const saved = localStorage.getItem("theme");
        const dark = saved === "dark";

        setIsDark(dark);

        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        const newDark = !isDark;

        setIsDark(newDark);

        html.classList.toggle("dark", newDark);
        localStorage.setItem("theme", newDark ? "dark" : "light");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Emmanuel
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/projects" className={styles.link}>Projects</Link>
                    <Link href="/contact" className={styles.link}>Contact</Link>
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
                    {hydrated && (isDark ? "☀️" : "🌙")}
                </button>
            </div>

            {open && (
                <div className={styles.mobileMenu}>
                    <Link href="/" className={styles.mobileLink}>Home</Link>
                    <Link href="/projects" className={styles.mobileLink}>Projects</Link>
                    <Link href="/contact" className={styles.mobileLink}>Contact</Link>
                </div>
            )}
        </nav>
    );
}
