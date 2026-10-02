"use client";

import { useEffect } from "react";

export default function useScrollAnimation() {
    useEffect(() => {
        const elements = document.querySelectorAll(
            ".fade-in, .slide-up, .stagger > *"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate");
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
