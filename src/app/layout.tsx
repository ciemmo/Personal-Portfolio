"use client";

import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import "@/styles/animations.css";


import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata = {
    title: "Emmanuel | Software Engineer Portfolio",
    description:
        "Portfolio of Emmanuel, a software engineer specializing in full-stack development, system design, and scalable applications.",
    keywords: [
        "Software Engineer",
        "Full Stack Developer",
        "React Developer",
        "Next.js Developer",
        "MERN Developer",
        "Portfolio",
        "Emmanuel",
    ],
    authors: [{ name: "Emmanuel" }],
    creator: "Emmanuel",
    metadataBase: new URL("https://emmanuel"),
    openGraph: {
        title: "Emmanuel | Software Engineer Portfolio",
        description:
            "Explore projects, skills, and experience of Emmanuel, a full-stack software engineer.",
        url: "https://your-domain.com",
        siteName: "Emmanuel Portfolio",
    },
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
                <ScrollToTop />
                <Navbar />
                <Footer />
            </body>
        </html>
    );
}
