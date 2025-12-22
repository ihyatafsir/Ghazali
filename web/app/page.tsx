import Link from "next/link";
import { BookOpen, Search, Sparkles } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-full">
            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 opacity-80" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                        <Sparkles className="w-4 h-4" />
                        <span>Rediscover the Revival of Religious Sciences</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Ihya <span className="text-emerald-600 dark:text-emerald-500">'Ulum al-Din</span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Navigate Imam Al-Ghazali's masterpiece with a modern, intelligent interface.
                        Featuring instant <span className="text-emerald-600 font-semibold">Quranic Tafsir</span> and integrated <span className="text-teal-600 font-semibold">Dictionary</span> support.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/books/j1-k01" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all font-semibold flex items-center gap-3">
                            <BookOpen className="w-5 h-5" />
                            Start Reading
                        </Link>
                        <Link href="/search" className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-semibold flex items-center gap-3">
                            <Search className="w-5 h-5" />
                            Search Library
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="px-6 py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm -mt-12 rounded-t-3xl border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">40 Books Digitized</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Complete access to all four quarters of the Ihya, from Worship to Salvation.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center text-teal-600 mb-4">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Smart Tafsir Index</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Automatically identified Quranic verses linked to their context within the Ihya.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                            <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Lisan al-Arab Lookup</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Instant definitions for classical Arabic terms powered by the comprehensive Lisan al-Arab.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
