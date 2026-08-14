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
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <meta property="og:url" content="https://emmanuel-ogungbure.dev"></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content={metadata.title}></meta>
                <meta property="og:description" content={metadata.description}></meta>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}