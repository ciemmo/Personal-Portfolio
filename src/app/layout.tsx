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
import { Analytics } from "@vercel/analytics/react";

// Optimize Inter font with variable font (single file, ~50KB vs multiple weights)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

// Site metadata for SEO and social sharing
const siteUrl = "https://emmanuelo.dev";
const siteName = "Emmanuel — Software Engineer";
const siteDescription = "Building scalable, accessible, and delightful digital experiences. Full-stack developer specializing in React, Next.js, TypeScript, and cloud architecture.";
const ogImage = `${siteUrl}/og-image.png`; // Add this file to public/ later

export const metadata = {
  title: {
    default: siteName,
    template: "%s | Emmanuel",
  },
  description: siteDescription,
  keywords: [
    "software engineer",
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "portfolio",
    "web development",
  ],
  authors: [{ name: "Emmanuel" }],
  creator: "Emmanuel",
  publisher: "Emmanuel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Emmanuel — Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [ogImage],
    creator: "@yourhandle", // Replace with your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// JSON-LD structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      name: "Emmanuel",
      url: siteUrl,
      image: `${siteUrl}/apple-touch-icon.png`,
      sameAs: [
        "https://github.com/ciemmo",
        "https://linkedin.com/in/your-profile", // Update with your LinkedIn
        "https://twitter.com/yourhandle", // Update with your Twitter
      ],
      jobTitle: "Software Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Freelance",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "JavaScript",
        "Python",
        "AWS",
        "Docker",
        "PostgreSQL",
        "MongoDB",
        "GraphQL",
        "REST APIs",
        "CI/CD",
        "Test-Driven Development",
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                {/* Preconnect to external domains for faster resource loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
                {/* JSON-LD Structured Data */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
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
                <Analytics />
            </body>
        </html>
    );
}