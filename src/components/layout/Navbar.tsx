"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            {/* Desktop Links */}
            <div className={styles.links}>
                <Link href="/">Home</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </div>

            {/* Mobile Links */}
            {isOpen && (
                <div className={styles.mobileLinks}>
                    <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/projects" onClick={() => setIsOpen(false)}>Projects</Link>
                    <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                </div>
            )}
        </nav>
    );
}
