"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

interface BilingualReaderProps {
    bookId: string;
    lines: string[];
    translations: { ar: string, en: string }[];
}

interface GroupedSegment {
    english: string;
    arabicLines: string[];
    startIndex: number;
}

export function BilingualReader({ bookId, lines, translations }: BilingualReaderProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Grouping Logic: Single English block -> Multiple Arabic lines
    const segments = useMemo(() => {
        const groups: GroupedSegment[] = [];
        let currentGroup: GroupedSegment | null = null;

        lines.forEach((line, idx) => {
            const trans = translations[idx];
            const hasEnglish = trans && trans.en && trans.en.trim().length > 0;

            if (hasEnglish) {
                // New segment starts here
                if (currentGroup) groups.push(currentGroup);
                currentGroup = {
                    english: trans.en,
                    arabicLines: [line],
                    startIndex: idx
                };
            } else {
                // Continuation of previous segment
                if (currentGroup) {
                    currentGroup.arabicLines.push(line);
                } else {
                    // Orphaned arabic lines at start (rare)
                    currentGroup = {
                        english: "", // Placeholder
                        arabicLines: [line],
                        startIndex: idx
                    };
                }
            }
        });
        if (currentGroup) groups.push(currentGroup);
        return groups;
    }, [lines, translations]);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress((window.scrollY / total) * 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <p className="text-slate-400 font-medium">Gathering Wisdom...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 relative">
            {/* Scroll Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 z-[100] bg-slate-100 dark:bg-slate-800">
                <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${scrollProgress}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>

            {segments.map((segment, groupIdx) => {
                const isLoaded = segment.english.length > 0;

                return (
                    <motion.div
                        key={groupIdx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 px-6 lg:px-10 transition-all duration-500 rounded-[2rem] group relative ${activeIndex === groupIdx ? 'bg-white dark:bg-slate-900 shadow-2xl scale-[1.01] z-10 border border-emerald-100 dark:border-emerald-900/30' : 'hover:bg-white/40 dark:hover:bg-slate-900/20 border border-transparent'}`}
                        onMouseEnter={() => setActiveIndex(groupIdx)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {/* Status Bar */}
                        <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full transition-all duration-300 ${isLoaded ? 'bg-emerald-500/10 group-hover:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />

                        {/* English Side */}
                        <div className="order-2 lg:order-1 text-left relative pt-1">
                            {isLoaded ? (
                                <p className="font-sans text-lg lg:text-xl leading-[1.8] text-slate-600 dark:text-slate-300 antialiased selection:bg-emerald-100 dark:selection:bg-emerald-900/40">
                                    {segment.english.split(' ').map((word, wIdx) => (
                                        <span
                                            key={wIdx}
                                            className="inline-block hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer border-b border-transparent hover:border-emerald-300 mr-1.5"
                                            onClick={() => window.dispatchEvent(new CustomEvent('lookup-word', { detail: word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") }))}
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </p>
                            ) : (
                                <div className="space-y-4 py-2 opacity-50">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full animate-pulse" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 animate-pulse" />
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Languages size={14} /> Text Segment
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Arabic Side (Grouped lines) */}
                        <div className="order-1 lg:order-2 text-right space-y-4" dir="rtl">
                            {segment.arabicLines.map((line, lIdx) => (
                                <p key={lIdx} className="font-amiri text-3xl lg:text-4xl leading-[2.2] text-slate-900 dark:text-white selection:bg-emerald-100 dark:selection:bg-emerald-900/50">
                                    {line.split(' ').map((word, wIdx) => (
                                        <span
                                            key={wIdx}
                                            className="inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer hover:underline underline-offset-8 decoration-2 decoration-emerald-300 dark:decoration-emerald-700 ml-2"
                                            onClick={() => window.dispatchEvent(new CustomEvent('lookup-word', { detail: word }))}
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
