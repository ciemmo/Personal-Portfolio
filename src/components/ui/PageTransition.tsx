"use client";

import { AnimatePresence, motion, easeInOut } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define transition variants based on page section
    const getVariants = () => {
        if (pathname === '/' || pathname.startsWith('/projects')) {
            // Home and Projects: subtle fade + scale
            return {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.4, ease: easeInOut }
            };
        }
        if (pathname.startsWith('/contact')) {
            // Contact: flip from bottom
            return {
                initial: { opacity: 0, rotateX: -90, originX: '50%', originY: '0%' },
                animate: { opacity: 1, rotateX: 0 },
                exit: { opacity: 0, rotateX: 90, originX: '50%', originY: '0%' },
                transition: { duration: 0.5 }
            };
        }
        if (pathname.startsWith('/api')) {
            // API routes: no transition (they're not visible anyway)
            return {
                initial: { opacity: 1 },
                animate: { opacity: 1 },
                exit: { opacity: 1 },
                transition: { duration: 0 }
            };
        }
        // Default: fade up
        return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.35, ease: easeInOut }
        };
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