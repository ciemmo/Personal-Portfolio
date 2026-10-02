"use client";

import styles from "./Contact.module.css";

export default function ContactPage() {
    return (
        <section className={styles.contactSection}>
            <div className={styles.container}>
                <h1 className={styles.title}>Contact Me</h1>

                <p className={styles.subtitle}>
                    Feel free to reach out for collaborations, opportunities, or questions.
                </p>

                <div className={styles.linksWrapper}>
                    {/* Email */}
                    <a
                        href="mailto:your-email@example.com"
                        className={styles.contactLink}
                    >
                        📧 Email Me
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/your-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                    >
                        💼 LinkedIn Profile
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/your-username"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                    >
                        🧑‍💻 GitHub Profile
                    </a>
                </div>
            </div>
        </section>
    );
}
