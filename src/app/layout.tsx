import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { Inter } from "next/font/google";

export const metadata = {
    title: "Portfolio Website",
    description: "A personal portfolio website built with Next.js and TypeScript, React.js and styled with CSS."
};

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            {/* Remove <head> — App Router manages it automatically */}
            <body className={inter.className}>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
