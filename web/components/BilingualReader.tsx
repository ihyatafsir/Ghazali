"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Languages, Search, HelpCircle } from 'lucide-react';

interface BilingualReaderProps {
    bookId: string;
    lines: string[];
    translations: { ar: string, en: string }[];
}

export function BilingualReader({ bookId, lines, translations }: BilingualReaderProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-20 text-center text-slate-400">Loading Reader...</div>;
    }

    const hasAnyTranslation = translations.length > 0;

    // Synchronize highlights or state based on scroll can be added here
    // For now, the grid-row natural sync is used.

    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, idx) => {
                const trans = translations[idx];
                const isLoaded = !!trans;

                return (
                    <div
                        key={idx}
                        id={`line-${idx}`}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 py-8 px-6 transition-all duration-500 rounded-2xl group relative ${activeIndex === idx ? 'bg-white dark:bg-slate-900 shadow-xl scale-[1.02] z-10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/40'}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {/* Status/Anchor Indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-full transition-all duration-500 ${isLoaded ? 'bg-emerald-500/30 group-hover:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />

                        {/* English Side (Translation) */}
                        <div className="order-2 lg:order-1 text-left relative">
                            <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold text-slate-400 rotate-90 inline-block tracking-tighter">#{idx + 1}</span>
                            </div>

                            {isLoaded ? (
                                <p className="font-sans text-lg leading-[1.8] text-slate-600 dark:text-slate-300 antialiased">
                                    {trans.en.split(' ').map((word, wIdx) => {
                                        // Clean word for dictionary lookup (remove punctuation)
                                        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                                        return (
                                            <span
                                                key={wIdx}
                                                className="inline-block hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer border-b border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 mr-1.5"
                                                onClick={() => {
                                                    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                                                    window.dispatchEvent(new CustomEvent('lookup-word', { detail: cleanWord }));
                                                }}
                                            >
                                                {word}
                                            </span>
                                        );
                                    })}
                                </p>
                            ) : (
                                <div className="space-y-3 opacity-30">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6 animate-pulse" />
                                    <p className="text-xs text-slate-400 italic">Translation coming soon (Book 1 Completed)</p>
                                </div>
                            )}
                        </div>

                        {/* Arabic Side (Original) */}
                        <div className="order-1 lg:order-2 text-right" dir="rtl">
                            <p className="font-amiri text-3xl leading-[2.2] text-slate-800 dark:text-slate-50 selection:bg-emerald-100 dark:selection:bg-emerald-900/50">
                                {line}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
