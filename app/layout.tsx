import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Campus-2-Cash | AI-Powered Student Project Monetization",
    description:
        "Transform academic and hackathon software projects into viable commercial startups. AI-powered 10-dimension evaluation, tailored monetization paths, pricing tiers, and launch roadmaps.",
    keywords: [
        "student startup",
        "project monetization",
        "hackathon commercialization",
        "AI venture mentor",
        "collegiate entrepreneurship",
        "campus to cash",
    ],
    openGraph: {
        title: "Campus-2-Cash | Turn Student Projects into Real Businesses",
        description:
            "Discover your software project's commercial potential with AI-powered 10-dimension evaluation, revenue forecasts, and pricing tiers.",
        type: "website",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#12201B",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans antialiased min-h-screen bg-[#12201B] text-[#F4F6F0] selection:bg-[#C9A24B]/30 selection:text-[#FAF0DA]">
                {children}
            </body>
        </html>
    );
}
