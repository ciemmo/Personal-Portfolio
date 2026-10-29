"use client";

import Link from "next/link";
import styles from "@/components/layout/Footer.module.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.brand}>
          <p className={styles.brandName}>Emmanuel</p>
          <p className={styles.brandTagline}>
            Building scalable, accessible, and delightful digital experiences.
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://github.com/ciemmo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/eogungbure/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:eogungbure@gmail.com"
              className={styles.socialLink}
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Navigation - Explore */}
        <nav className={styles.navColumn} aria-label="Explore">
          <h3 className={styles.navTitle}>Explore</h3>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/projects" className={styles.navLink}>Projects</Link>
          <Link href="/workExperience" className={styles.navLink}>Experience</Link>
          <Link href="/education" className={styles.navLink}>Education</Link>
          <Link href="/certifications" className={styles.navLink}>Certifications</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        {/* Navigation - Resources */}
        <nav className={styles.navColumn} aria-label="Resources">
          <h3 className={styles.navTitle}>Resources</h3>
          <Link href="/achievements" className={styles.navLink}>Achievements</Link>
        </nav>

        {/* Contact & Newsletter */}
        <div className={styles.contactColumn}>
          <h3 className={styles.navTitle}>Get in Touch</h3>
          <address className={styles.contactItem}>
            <FaEnvelope className={styles.contactIcon} aria-hidden="true" />
            <a href="mailto:eogungbure@gmail.com" className={styles.contactLink}>
              eogungbure@gmail.com
            </a>
          </address>
          <address className={styles.contactItem}>
            <FaLinkedin className={styles.contactIcon} aria-hidden="true" />
            <a
              href="https://www.linkedin.com/in/eogungbure/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              LinkedIn
            </a>
          </address>

          {/* Newsletter Signup */}
          <div className={styles.newsletter}>
            <h4 className={styles.newsletterTitle}>Stay Updated</h4>
            <p className={styles.newsletterText}>
              Occasional updates on new projects, articles, and learnings.
            </p>
            <form className={styles.newsletterForm} action="#" method="POST">
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                aria-label="Email address for newsletter"
                required
              />
              <button type="submit" className={styles.newsletterButton} aria-label="Subscribe">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Emmanuel. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            <span>Made with Next.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
}