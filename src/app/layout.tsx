import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import "@/styles/animations.css";


import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const metadata = {
    title: "Portfolio Website",
    description:
        "A personal portfolio website built with Next.js and TypeScript, React.js and styled with CSS.",
};

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <html lang="en">
            <body>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </body>
        </html>
    );
}
