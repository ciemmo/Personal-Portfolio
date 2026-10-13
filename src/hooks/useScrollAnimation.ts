"use client";

import { useEffect } from "react";

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
