"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="scroll-to-top"
      title="Back to top"
      aria-label="Back to top"
    >
      <div className="scroll-to-top-content">
        <span className="scroll-to-top-icon">▲</span>
        <span className="scroll-to-top-label">Top</span>
      </div>
    </Link>
  );
}