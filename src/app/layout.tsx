import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import "@/styles/animations.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { Inter } from "next/font/google";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransitionWrapper from "@/components/ui/PageTransition";

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
    return (
        <html lang="en">
            <body>
                <Navbar />
                <PageTransitionWrapper>
                    {children}
                </PageTransitionWrapper>
                <ScrollToTop />
                <Footer />
            </body>
        </html>
    );
}
