"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [open, setOpen] = useState(false);

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
