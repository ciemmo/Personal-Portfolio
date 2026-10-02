import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import "@/styles/animations.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/ui/ScrollToTop";
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
    const segments = pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: `/${segments.slice(0, index + 1).join("/")}`,
        isLast: index === segments.length - 1
      }));

    return (
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          {segments.map((segment, index) => (
            <li key={segment.label} className={segment.isLast ? "active" : ""}>
              {!segment.isLast && (
                <Link href={segment.href}>
                  {segment.label}
                </Link>
              )}
              {segment.isLast && <span>{segment.label}</span>}
            }
          ))}
        </ol>
      </nav>
    );
}