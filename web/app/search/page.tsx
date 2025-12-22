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
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-12">
                <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                    Library Search
                </h1>
                <div className="relative max-w-xl">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="search"
                        defaultValue={query}
                        placeholder="Search for verses or keywords..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                window.location.href = `/search?q=${(e.target as HTMLInputElement).value}`;
                            }
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                        Results for "{query}"
                    </h2>
                    {results.map((res, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    {res.book}
                                </span>
                                <Link
                                    href={`/books/${res.book}#line-${res.location.line_index}`}
                                    className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 hover:underline"
                                >
                                    Open Reader <ChevronRight size={16} />
                                </Link>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 italic">
                                "... {res.context} ..."
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                <BookOpen size={12} />
                                <span>Line {res.location.line_index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : query ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500">No cross-references found for "{query}".</p>
                    <p className="text-xs text-slate-400 mt-2">Try searching for a different verse or Surah name.</p>
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-slate-400">Enter a query to search the library.</p>
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
