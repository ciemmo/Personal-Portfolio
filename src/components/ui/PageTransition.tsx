"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Track previous pathname to determine navigation direction
    const [prevPathname, setPrevPathname] = useState(pathname);

    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false);
        } else {
            setPrevPathname(pathname);
        }
    }, [pathname, isInitialLoad]);

    // Determine navigation direction and type
    const getNavigationType = () => {
        if (isInitialLoad) return 'initial';

        const prevSegments = prevPathname.split('/').filter(Boolean);
        const currSegments = pathname.split('/').filter(Boolean);

        // Check if navigating to same depth
        if (prevSegments.length === currSegments.length) {
            return 'lateral';
        }

        // Check if going deeper or shallower
        return prevSegments.length < currSegments.length ? 'deeper' : 'shallower';
    };

    // Define enhanced transition variants
    const getVariants = () => {
        const navType = getNavigationType();

        // Base transitions
        const baseTransition = {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0], // Custom easing for more natural motion
        };

        // Entrance variants
        const entranceVariants = {
            initial: {
                opacity: 0,
                y: 20,
                scale: 0.95
            },
            animate: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    ...baseTransition,
                    delay: 0.1
                }
            }
        };

        // Enhanced entrance based on navigation type
        if (navType === 'deeper') {
            // Going deeper: slide in from right with slight 3D rotation
            entranceVariants.initial = {
                opacity: 0,
                x: 50,
                scale: 0.9,
                rotateY: -15
            };
            entranceVariants.animate = {
                opacity: 1,
                x: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                    ...baseTransition,
                    delay: 0.1
                }
            };
        } else if (navType === 'shallower') {
            // Going shallower: slide in from left with slight 3D rotation
            entranceVariants.initial = {
                opacity: 0,
                x: -50,
                scale: 0.9,
                rotateY: 15
            };
            entranceVariants.animate = {
                opacity: 1,
                x: 0,
                scale: 1,
                rotateY: 0,
                transition: {
                    ...baseTransition,
                    delay: 0.1
                }
            };
        } else if (navType === 'lateral') {
            // Lateral movement: subtle fade with scale
            entranceVariants.initial = {
                opacity: 0,
                scale: 0.95
            };
            entranceVariants.animate = {
                opacity: 1,
                scale: 1,
                transition: {
                    ...baseTransition,
                    delay: 0.1
                }
            };
        } else {
            // Initial load: fade up
            entranceVariants.initial = {
                opacity: 0,
                y: 30
            };
            entranceVariants.animate = {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }
            };
        }

        // Exit variants - always fade out and move down
        const exitVariants = {
            initial: {...entranceVariants.animate},
            animate: entranceVariants.initial,
            exit: {
                opacity: 0,
                y: 20,
                transition: {
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1.0]
                }
            }
        };

        return exitVariants;
    };

    const variants = getVariants();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={variants.transition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}