"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Navigation */}
                <div className={styles.nav}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/projects" className={styles.navLink}>Projects</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </div>

                {/* Social Icons */}
                <div className={styles.social}>
                    <a
                        href="https://github.com/yourusername"
                        target="_blank"
                        className={styles.icon}
                    >
                        <FaGithub />
                    </a>

                    <a
                        href="https://linkedin.com/in/yourusername"
                        target="_blank"
                        className={styles.icon}
                    >
                        <FaLinkedin />
                    </a>

                    <a
                        href="mailto:your@email.com"
                        className={styles.icon}
                    >
                        <FaEnvelope />
                    </a>
                </div>

                {/* Copyright */}
                <p className={styles.copy}>
                    © {new Date().getFullYear()} Emmanuel. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
