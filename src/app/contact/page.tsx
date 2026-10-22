"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaCheck } from "react-icons/fa";
import styles from "./Contact.module.css";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  description?: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: <FaEnvelope aria-hidden="true" />,
    title: "Email",
    value: "eogungbure@gmail.com",
    href: "mailto:eogungbure@gmail.com",
    description: "Best for project inquiries"
  },
  {
    icon: <FaLinkedin aria-hidden="true" />,
    title: "LinkedIn",
    value: "/in/eogungbure",
    href: "https://www.linkedin.com/in/eogungbure/",
    description: "Professional networking"
  },
  {
    icon: <FaGithub aria-hidden="true" />,
    title: "GitHub",
    value: "/ciemmo",
    href: "https://github.com/ciemmo",
    description: "Open source projects"
  },
  {
    icon: <FaMapMarkerAlt aria-hidden="true" />,
    title: "Location",
    value: "Richmond, Texas, USA",
    description: "Available for remote work"
  }
];

const MAX_MESSAGE_LENGTH = 1000;

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<HTMLSpanElement[]>([]);

  // Real-time validation on blur
  const handleBlur = useCallback((name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  }, [formData]);

  // Validate individual field
  const validateField = useCallback((name: keyof FormData, value: string): boolean => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        } else if (value.length > MAX_MESSAGE_LENGTH) {
          error = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
        }
        break;
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });

    return !error;
  }, []);

  // Handle input change with real-time validation for touched fields
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation for touched fields
    if (touched[name as keyof FormData]) {
      validateField(name as keyof FormData, value);
    }
  }, [touched, validateField]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(name => {
      const fieldValid = validateField(name, formData[name]);
      if (!fieldValid) isValid = false;
    });

    setTouched({
      name: true,
      email: true,
      message: true
    });

    return isValid;
  }, [formData, validateField]);

  // Create floating particles for success animation
  const createParticles = useCallback(() => {
    const container = successRef.current;
    if (!container) return;

    const colors = [
      "var(--color-primary)",
      "var(--color-secondary)",
      "var(--color-accent)",
      "var(--color-success)",
      "var(--color-warning)"
    ];

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("span");
      particle.className = styles.particle;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty("--particle-color", color);
      particle.style.setProperty("--particle-angle", `${Math.random() * 360}deg`);
      particle.style.setProperty("--particle-distance", `${50 + Math.random() * 100}px`);
      particle.style.setProperty("--particle-delay", `${Math.random() * 0.5}s`);
      particle.style.setProperty("--particle-duration", `${0.8 + Math.random() * 0.6}s`);
      container.appendChild(particle);
      particleRefs.current.push(particle);
    }
  }, []);

  // Clean up particles
  const cleanupParticles = useCallback(() => {
    particleRefs.current.forEach(p => p.remove());
    particleRefs.current = [];
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setShowSuccessAnimation(true);
        createParticles();

        // Reset form after brief delay
        setTimeout(() => {
          setFormData({ name: "", email: "", message: "" });
          setTouched({});
        }, 500);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const handleReset = useCallback(() => {
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    setTouched({});
    setSubmitStatus("idle");
    setErrorMessage("");
    setShowSuccessAnimation(false);
    cleanupParticles();
  }, [cleanupParticles]);

  // Handle success animation end
  const handleAnimationEnd = useCallback(() => {
    cleanupParticles();
  }, [cleanupParticles]);

  // Focus first invalid field on submit error
  useEffect(() => {
    if (submitStatus === "error") {
      const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstInvalid?.focus();
    }
  }, [submitStatus]);

  // Auto-clear success state after delay
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
        cleanupParticles();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, cleanupParticles]);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section className={`${styles.contactPage} fade-up`} aria-labelledby="contact-title">
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 id="contact-title" className={styles.title}>Get In Touch</h1>
          <p className={styles.subtitle}>
            Have a project in mind? Questions about my work? I'd love to hear from you.
          </p>
        </header>

        <div className={styles.mainLayout}>
          {/* Contact Info Sidebar */}
          <aside className={styles.infoSidebar} aria-label="Contact information">
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Let's Connect</h2>
              <p className={styles.infoDescription}>
                I'm always open to discussing new opportunities, interesting projects,
                or just saying hello. Feel free to reach out through any of these channels.
              </p>

              <ul className={styles.infoList} role="list">
                {CONTACT_INFO.map((item, index) => (
                  <li key={item.title} className={styles.infoItem}>
                    <a
                      href={item.href || "#"}
                      className={styles.infoLink}
                      target={item.href?.startsWith("http") ? "_blank" : undefined}
                      rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={item.title}
                    >
                      <span className={styles.infoIcon}>{item.icon}</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>{item.title}</span>
                        <span className={styles.infoValue}>{item.value}</span>
                        {item.description && (
                          <span className={styles.infoDesc}>{item.description}</span>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              <div className={styles.infoNote}>
                <p>Prefer a direct conversation? Schedule a call via email.</p>
              </div>
            </div>
          </aside>

          {/* Form Section */}
          <div className={styles.formSection}>
            {submitStatus === "success" && showSuccessAnimation ? (
              <div
                ref={successRef}
                className={`${styles.successCard} ${prefersReducedMotion ? "reducedMotion" : ""}`}
                role="status"
                aria-live="polite"
                onAnimationEnd={handleAnimationEnd}
              >
                <div className={styles.successIconWrapper}>
                  <svg
                    className={styles.successCheckmark}
                    viewBox="0 0 52 52"
                    aria-hidden="true"
                  >
                    <circle
                      className={styles.checkmarkCircle}
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      className={styles.checkmarkPath}
                      d="M14 27l8 8 16-16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Message Sent!</h2>
                <p className={styles.successMessage}>
                  Thank you for reaching out. I'll get back to you within 24–48 hours.
                </p>
                <button
                  className={styles.resetButton}
                  onClick={handleReset}
                  aria-label="Send another message"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={styles.form}
                noValidate
                aria-label="Contact form"
              >
                {/* Name Field */}
                <div className={styles.fieldWrapper}>
                  <label htmlFor="name" className={`${styles.label} ${formData.name ? "hasValue" : ""} ${errors.name && touched.name ? "hasError" : ""}`}>
                    <span className={styles.labelText}>Your Name</span>
                    {errors.name && touched.name && (
                      <span className={styles.labelError} aria-live="polite">{errors.name}</span>
                    )}
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={`${styles.input} ${errors.name && touched.name ? "error" : ""}`}
                      placeholder=" "
                      autoComplete="name"
                      aria-invalid={errors.name && touched.name ? "true" : "false"}
                      aria-describedby={errors.name && touched.name ? "name-error" : undefined}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.name && touched.name && (
                      <span id="name-error" className={styles.fieldError} role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className={styles.fieldWrapper}>
                  <label htmlFor="email" className={`${styles.label} ${formData.email ? "hasValue" : ""} ${errors.email && touched.email ? "hasError" : ""}`}>
                    <span className={styles.labelText}>Email Address</span>
                    {errors.email && touched.email && (
                      <span className={styles.labelError} aria-live="polite">{errors.email}</span>
                    )}
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={`${styles.input} ${errors.email && touched.email ? "error" : ""}`}
                      placeholder=" "
                      autoComplete="email"
                      aria-invalid={errors.email && touched.email ? "true" : "false"}
                      aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.email && touched.email && (
                      <span id="email-error" className={styles.fieldError} role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className={styles.fieldWrapper}>
                  <label htmlFor="message" className={`${styles.label} ${formData.message ? "hasValue" : ""} ${errors.message && touched.message ? "hasError" : ""}`}>
                    <span className={styles.labelText}>Message</span>
                    <span className={styles.charCount}>
                      {formData.message.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={() => handleBlur("message")}
                      className={`${styles.textarea} ${errors.message && touched.message ? "error" : ""}`}
                      placeholder=" "
                      rows={5}
                      aria-invalid={errors.message && touched.message ? "true" : "false"}
                      aria-describedby={errors.message && touched.message ? "message-error" : "message-hint"}
                      required
                      disabled={isSubmitting}
                      maxLength={MAX_MESSAGE_LENGTH}
                    />
                    {errors.message && touched.message ? (
                      <span id="message-error" className={styles.fieldError} role="alert">
                        {errors.message}
                      </span>
                    ) : (
                      <span id="message-hint" className={styles.fieldHint}>
                        Minimum 10 characters
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`${styles.submitButton} ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaEnvelope className={styles.buttonIcon} aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Global Error Message */}
                {submitStatus === "error" && (
                  <div className={styles.globalError} role="alert">
                    <FaEnvelope className={styles.errorIcon} aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <p className={styles.formNote}>
                  By submitting this form, you agree to my{' '}
                  <a href="/privacy" className={styles.link}>Privacy Policy</a>{' '}
                  and{' '}
                  <a href="/terms" className={styles.link}>Terms of Service</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}