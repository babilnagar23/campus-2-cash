import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Campus-2-Cash | AI-Powered Project Monetization",
    description:
        "Turn your student project into real-world revenue. AI-powered monetization paths, valuation scoring, and commercial roadmaps.",
    keywords: ["student monetization", "project to income", "AI startup mentor", "hackathon commercialization"],
    openGraph: {
        title: "Campus-2-Cash | AI-Powered Project Monetization",
        description: "Turn your student project into real-world revenue with AI-powered monetization paths.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="font-sans antialiased min-h-screen bg-[#080B09] text-[#F4F7F2]">
                {children}
            </body>
        </html>
    );
}
