"use client";

import { useState, useEffect } from 'react';
import { Search, X, Loader2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DictionaryOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const lookup = async (search: string) => {
        if (!search || search.length < 2) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/dictionary?word=${encodeURIComponent(search.trim())}`);
            const data = await res.json();
            setDefinition(data.definition || "Definition not found in Lisan al-Arab.");
        } catch (err) {
            setDefinition("Error connecting to dictionary.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleLookupEvent = (e: any) => {
            if (e.detail) {
                setTerm(e.detail);
                lookup(e.detail);
                setIsOpen(true);
            }
        };
        window.addEventListener('lookup-word', handleLookupEvent);
        return () => window.removeEventListener('lookup-word', handleLookupEvent);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 w-14 h-14 rounded-2xl shadow-2xl transition-all duration-500 z-50 flex items-center justify-center ${isOpen ? 'bg-slate-900 text-white rotate-90 scale-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110 shadow-emerald-500/30'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-28 right-8 w-[400px] glass rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col max-h-[70vh]"
                    >
                        <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">Lisan al-Arab</h3>
                                    <p className="text-[10px] opacity-80 font-medium uppercase tracking-widest">Classical Lexicon</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="relative mb-8">
                                <input
                                    type="text"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && lookup(term)}
                                    placeholder="Search Arabic root..."
                                    className="w-full pl-5 pr-12 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 font-arabic text-2xl text-right transition-all outline-none"
                                    dir="rtl"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                                    ) : (
                                        <Search className="w-5 h-5 text-slate-400" onClick={() => lookup(term)} />
                                    )}
                                </div>
                            </div>

                            <div className="font-arabic text-right text-slate-800 dark:text-slate-200 leading-[2] text-xl whitespace-pre-line bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-white/20 dark:border-slate-800/20" dir="rtl">
                                {definition ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="text-sm font-sans font-bold text-emerald-600 dark:text-emerald-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                                            <div className="h-px flex-1 bg-emerald-100 dark:bg-emerald-900/30" />
                                            Definition
                                            <div className="h-px flex-1 bg-emerald-100 dark:bg-emerald-900/30" />
                                        </div>
                                        {definition}
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-16 space-y-4">
                                        <p className="text-slate-400 text-sm font-sans">Click on any word in the text to see its classical meaning.</p>
                                        <div className="text-6xl grayscale opacity-20">📜</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Integrated Knowledge Base</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
