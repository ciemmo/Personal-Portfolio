import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import { Inter } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransitionWrapper from "@/components/ui/PageTransition";
import Breadcrumb from "@/components/layout/Breadcrumb";
import DisableScrollRestoration from "@/components/ui/DisableScrollRestoration";

// Optimize Inter font with variable font (single file, ~50KB vs multiple weights)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                {/* Preconnect to external domains for faster resource loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
            </head>
            <body className={`${inter.className} antialiased`} suppressHydrationWarning>
                <DisableScrollRestoration />
                <a href="#main-content" className="skip-to-content">Skip to main content</a>
                <Navbar />
                <Breadcrumb />
                <main id="main-content">
                    <PageTransitionWrapper>
                        {children}
                    </PageTransitionWrapper>
                </main>
                <ScrollToTop />
                <Footer />
            </body>
        </html>
    );
}