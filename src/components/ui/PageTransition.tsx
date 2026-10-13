"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const variants: Variants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
