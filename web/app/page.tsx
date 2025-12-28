"use client";

import Link from "next/link";
import { BookOpen, Search, Sparkles, Feather, Compass, Heart, ShieldCheck, Sun, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <section className="relative px-6 py-32 md:py-48 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center space-y-12"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white dark:bg-slate-900 shadow-xl shadow-emerald-500/5 border border-emerald-100 dark:border-emerald-800/50">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">The Spiritual Frontier</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                            Ihya <span className="text-emerald-600 italic">'Ulum al-Din</span>
                        </h1>
                        <p className="text-2xl md:text-3xl font-arabic text-emerald-600/60 dark:text-emerald-500/40">إحياء علوم الدين</p>
                    </div>

                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        Enter the digital sanctuary of Imam Al-Ghazali.
                        A complete reimagining of the <span className="text-slate-900 dark:text-white underline decoration-emerald-500/30">Revivification of Religious Sciences</span> for the modern soul.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Link href="/books/j1-k01" className="group relative px-10 py-5 bg-emerald-600 text-white rounded-[2rem] shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="relative flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                                <BookOpen className="w-5 h-5" />
                                Begin Journey
                            </div>
                        </Link>
                        <Link href="/tafsir" className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 font-black uppercase tracking-widest text-sm flex items-center gap-3">
                            <Sun className="w-5 h-5 text-emerald-500" />
                            Explore Tafsir
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Feature Section */}
            <section className="px-6 py-24 relative">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    {[
                        {
                            icon: Feather,
                            title: "Sacred Text",
                            desc: "Bilingual side-by-side reading of the original 40 books.",
                            color: "emerald"
                        },
                        {
                            icon: Compass,
                            title: "Smart Navigation",
                            desc: "Fluid cross-referencing between Quranic verses and Ghazali's wisdom.",
                            color: "teal"
                        },
                        {
                            icon: Heart,
                            title: "Spiritual Lexicon",
                            desc: "Instant classical Arabic lookup via Lisan al-Arab integration.",
                            color: "cyan"
                        },
                        {
                            icon: ShieldCheck,
                            title: "Verified Sources",
                            desc: "Standardized metadata and citation mapping for modern research.",
                            color: "indigo"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="group p-10 glass rounded-[3rem] border border-white/40 dark:border-slate-800/40 hover:border-emerald-500/50 shadow-sm hover:shadow-2xl transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-8`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Quote of the Moment */}
            <section className="px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto p-16 glass rounded-[4rem] text-center space-y-8 border-2 border-emerald-500/10 shadow-2xl"
                >
                    <Quote className="w-12 h-12 text-emerald-500/20 mx-auto" />
                    <p className="text-3xl md:text-4xl font-serif italic text-slate-800 dark:text-slate-200 leading-tight">
                        "Whoever thinks that he can attain without effort, his hope is but a dream."
                    </p>
                    <div className="pt-4">
                        <div className="h-px w-20 bg-emerald-500/30 mx-auto mb-4" />
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600">Imam Al-Ghazali</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Book of Knowledge • Chapter 1</p>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <footer className="px-6 py-24 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-4 cursor-default transition-all hover:tracking-[0.8em]">Designed for Modern Enlightenment</p>
                <div className="flex justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
                    <span className="font-serif italic text-sm">Al-Ghazali Explorer</span>
                    <span className="font-serif italic text-sm">Lisan al-Arab</span>
                    <span className="font-serif italic text-sm">Ihya Tafsir</span>
                </div>
            </footer>
        </div>
    );
}
