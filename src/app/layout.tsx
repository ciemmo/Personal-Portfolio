"use client";

import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import "@/styles/animations.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransitionWrapper from "@/components/ui/PageTransition";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Only show breadcrumbs for nested routes (not home, not api routes)
    const pathSegments = pathname.split("/").filter(Boolean);
    const showBreadcrumbs =
      pathname !== "/" &&
      !pathname.startsWith("/api") &&
      pathSegments.length > 0;

    return (
        <html lang="en">
            <body>
                <Navbar />
                {showBreadcrumbs && <Breadcrumb pathname={pathname} />}
                <PageTransitionWrapper>
                    {children}
                </PageTransitionWrapper>
                <ScrollToTop />
                <Footer />
            </body>
        </html>
    );
}

// Breadcrumb component
function Breadcrumb({ pathname }: { pathname: string }) {
    const pathParts = pathname.split("/").filter(Boolean);
    const items = [];
    let currentPath = "";

    for (let i = 0; i < pathParts.length; i++) {
      const segment = pathParts[i];
      currentPath += `/${segment}`;

      items.push(
        <li
          key={segment}
          className={i === pathParts.length - 1 ? "active" : ""}
        >
          {i === pathParts.length - 1 ? (
            <span>{segment}</span>
          ) : (
            <Link href={currentPath}>
              {segment}
            </Link>
          )}
        </li>
      );
    }

    return (
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          {items}
        </ol>
      </nav>
    );
}