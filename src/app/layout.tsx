import "@/styles/globals.css";
import "@/styles/variables.css";
import "@/styles/layout.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
    title: "Portfolio Website",
    description: "A personal portfolio website built with Next.js and TypeScript, React.js and styled with CSS."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={metadata.description} />
                <link rel="icon" href="/favicon.ico" />
                <title>{metadata.title}</title>
            </head>
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
