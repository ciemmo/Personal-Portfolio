"use client";

import { useEffect } from "react";

/**
 * Custom hook for animating elements when they enter the viewport
 * @param selector - CSS selector for elements to animate (default: ".fade-up, .stagger-up > *")
 * @param animationClass - CSS class to add when element is visible (default: "animate")
 *
 * @returns void - Sets up observers that automatically animate matching elements
 */
export default function useScrollAnimation(
    selector = ".fade-up, .stagger-up > *",
    animationClass = "animate"
) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        const observedElements = new WeakSet<Element>();
        const observeElements = () => {
            document.querySelectorAll(selector).forEach((element) => {
                if (!observedElements.has(element)) {
                    observedElements.add(element);
                    observer.observe(element);
                }
            });
        };

        observeElements();

        const mutations = new MutationObserver(observeElements);
        mutations.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutations.disconnect();
        };
    }, [selector, animationClass]);
}
