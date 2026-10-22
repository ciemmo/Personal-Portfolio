import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransitionWrapper from "@/components/ui/PageTransition";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
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