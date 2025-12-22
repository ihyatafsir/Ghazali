
import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google"; // Using Amiri for Arabic
import "./globals.css";
import { DictionaryOverlay } from "@/components/DictionaryOverlay";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const amiri = Amiri({
    weight: ["400", "700"],
    subsets: ["arabic"],
    variable: "--font-amiri",
});

export const metadata: Metadata = {
    title: "Ghazali Explorer | Ihya 'Ulum al-Din",
    description: "Explore the 40 books of Imam Ghazali's Ihya 'Ulum al-Din with Quranic Tafsir and Dictionary.",
};

import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
            <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="flex-1 md:ml-64 relative">
                        {children}
                    </main>
                </div>
                <DictionaryOverlay />
            </body>
        </html>
    );
}
