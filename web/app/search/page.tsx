"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, BookOpen, ChevronRight } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [quranIndex, setQuranIndex] = useState<any>({});
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/quran_index.json')
            .then(res => res.json())
            .then(data => {
                setQuranIndex(data);
                if (query && data[query]) {
                    setResults(data[query]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [query]);

    return (
        <div className="max-w-5xl mx-auto py-20 px-6 animate-fade-in">
            <header className="mb-16 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                    <SearchIcon size={12} />
                    Knowledge Search
                </div>
                <h1 className="text-5xl font-serif font-bold text-slate-900 dark:text-white">
                    Library <span className="text-emerald-600 dark:text-emerald-500">Explorer</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto italic">
                    Search for Quranic verses or cross-references across the entire Ihya collection.
                </p>

                <div className="relative max-w-2xl mx-auto pt-4 flex gap-3">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="search"
                            defaultValue={query}
                            placeholder="Type a Verse (e.g. البقرة:1)..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none text-lg"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`;
                                }
                            }}
                        />
                    </div>
                    <button className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
                        Search
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Searching Archives...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-8 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Found {results.length} Matches
                        </h2>
                    </div>
                    {results.map((res, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass group p-8 rounded-3xl border border-white/40 dark:border-slate-800/40 shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                    {res.book}
                                </span>
                                <Link
                                    href={`/books/${res.book}#line-${res.location.line_index}`}
                                    className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    Open Reader <ChevronRight size={16} />
                                </Link>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium italic">
                                "{res.context}"
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800 pt-6 uppercase tracking-widest">
                                <BookOpen size={14} className="text-emerald-500" />
                                <span>Ihya Section • Line {res.location.line_index + 1}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : query ? (
                <div className="text-center py-24 glass rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 max-w-2xl mx-auto">
                    <div className="text-5xl mb-6 opacity-20 grayscale">🔍</div>
                    <p className="text-slate-500 font-medium">No direct cross-references for "{query}".</p>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">Try searching for a different verse or checking the Tafsir index.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="p-8 glass rounded-3xl border border-emerald-100/50 dark:border-emerald-900/30">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Search by Verse</h3>
                        <p className="text-sm text-slate-500 mb-4">You can search for specific citations using the format "Surah:Ayah".</p>
                        <code className="bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded text-emerald-600">البقرة:1</code>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
