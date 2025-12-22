"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

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
            const res = await fetch(`/api/dictionary?word=${encodeURIComponent(search)}`);
            const data = await res.json();
            setDefinition(data.definition || "Definition not found.");
        } catch (err) {
            console.error("Failed to lookup word", err);
            setDefinition("Error connecting to dictionary.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();
            if (text && text.length > 1 && text.split(' ').length < 3) {
                // Only trigger if text contains Arabic characters
                if (/[\u0600-\u06FF]/.test(text) && isOpen) {
                    setTerm(text);
                    lookup(text);
                }
            }
        };

        const handleLookupEvent = (e: any) => {
            if (e.detail) {
                setTerm(e.detail);
                lookup(e.detail);
                setIsOpen(true);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        window.addEventListener('lookup-word', handleLookupEvent);
        return () => {
            document.removeEventListener('mouseup', handleSelection);
            window.removeEventListener('lookup-word', handleLookupEvent);
        };
    }, [isOpen]);

    const toggle = () => setIsOpen(!isOpen);

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={toggle}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 ${isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110 shadow-emerald-500/20'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-4 bg-emerald-600 text-white flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            <h3 className="font-bold tracking-tight">Lisan al-Arab</h3>
                        </div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">CLASSIC ARABIC</span>
                    </div>

                    <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && lookup(term)}
                                placeholder="Search term..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 font-arabic text-xl text-right transition-all outline-none"
                                dir="rtl"
                            />
                            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                            {loading && <Loader2 className="w-5 h-5 text-emerald-500 absolute right-3 top-3.5 animate-spin" />}
                        </div>

                        <div className="font-arabic text-right text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line" dir="rtl">
                            {definition ? (
                                <div className="animate-in fade-in duration-500">
                                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-4" />
                                    {definition}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 text-sm font-sans mb-2">Select a word in the text or type above</p>
                                    <div className="text-4xl opacity-20">📖</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
