
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TafsirPage() {
    const [quranIndex, setQuranIndex] = useState<any>({});
    const [englishQuran, setEnglishQuran] = useState<{ [key: string]: string }>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSurahs, setExpandedSurahs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/quran_index.json').then(res => res.json()),
            fetch('/quran-en.json').then(res => res.json())
        ]).then(([indexData, enData]) => {
            setQuranIndex(indexData);
            const enIndex: { [key: string]: string } = {};
            if (enData.quran) {
                enData.quran.forEach((v: any) => { enIndex[`${v.chapter}:${v.verse}`] = v.text; });
            }
            setEnglishQuran(enIndex);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const toggleSurah = (surah: string) => {
        setExpandedSurahs(prev =>
            prev.includes(surah) ? prev.filter(s => s !== surah) : [...prev, surah]
        );
    };

    const suras: { [name: string]: any[] } = {};
    Object.entries(quranIndex).forEach(([key, matches]) => {
        const [surahName, verseNum] = key.split(':');
        if (!suras[surahName]) suras[surahName] = [];
        suras[surahName].push({ key, verseNum, matches, surahName });
    });

    const ARABIC_TO_ID: { [key: string]: number } = {
        "الفاتحة": 1, "البقرة": 2, "آل عمران": 3, "النساء": 4, "المائدة": 5,
        "الأنعام": 6, "الأعراف": 7, "الأنفال": 8, "التوبة": 9, "يونس": 10,
        "هود": 11, "يوسف": 12, "الرعد": 13, "إبراهيم": 14, "الحجر": 15,
        "النحل": 16, "الإسراء": 17, "الكهف": 18, "مريم": 19, "طه": 20,
        "الأنبياء": 21, "الحج": 22, "المؤمنون": 23, "النور": 24, "الفرقان": 25,
        "الشعراء": 26, "النمل": 27, "القصص": 28, "العنكبوت": 29, "الروم": 30,
        "لقمان": 31, "السجدة": 32, "الأحزاب": 33, "سبأ": 34, "فاطر": 35,
        "يس": 36, "الصافات": 37, "ص": 38, "الزمر": 39, "غافر": 40,
        "فصلت": 41, "الشورى": 42, "الزخرف": 43, "الدخان": 44, "الجاثية": 45,
        "الأحقاف": 46, "محمد": 47, "الفتح": 48, "الحجرات": 49, "ق": 50,
        "الذاريات": 51, "الطور": 52, "النجم": 53, "القمر": 54, "الرحمن": 55,
        "الواقعة": 56, "الحديد": 57, "المجادلة": 58, "الحشر": 59, "الممتحنة": 60,
        "الصف": 61, "الجمعة": 62, "المنافقون": 63, "التغابن": 64, "الطلاق": 65,
        "التحريم": 66, "الملك": 67, "القلم": 68, "الحاقة": 69, "المعارج": 70,
        "نوح": 71, "الجن": 72, "المزمل": 73, "المدثر": 74, "القيامة": 75,
        "الإنسان": 76, "المرسلات": 77, "النبأ": 78, "النازعات": 79, "عبس": 80,
        "التكوير": 81, "الانفطار": 82, "المطففين": 83, "الانشقاق": 84, "البروج": 85,
        "الطارق": 86, "الأعلى": 87, "الغاشية": 88, "الفجر": 89, "البلد": 90,
        "الشمس": 91, "الليل": 92, "الضحى": 93, "الشرح": 94, "التين": 95,
        "العلق": 96, "القدر": 97, "البينة": 98, "الزلزلة": 99, "العاديات": 100,
        "القارعة": 101, "التكاثر": 102, "العصر": 103, "الهمزة": 104, "الفيل": 105,
        "قريش": 106, "الماعون": 107, "الكوثر": 108, "الكافرون": 109, "النصر": 110,
        "المسد": 111, "الإخلاص": 112, "الفلق": 113, "الناس": 114
    };

    const surahKeys = Object.keys(suras).sort();
    const filteredSurahs = surahKeys.filter(s => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return s.includes(q) || suras[s].some(v => v.matches.some((m: any) => m.snippet.includes(searchQuery)));
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">Indexing Tafsir...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12 animate-fade-in">
            {/* Header */}
            <header className="mb-20 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800 text-xs font-bold uppercase tracking-widest">
                    <BookOpen size={14} />
                    Quranic Cross-Reference
                </div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                    Ihya 'Ulum al-Din <span className="text-emerald-600 dark:text-emerald-500">as Tafsir</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    A unique transformation of Al-Ghazali's work, reorganized by Quranic citation.
                    Instantly find every instance where the Imam explains a specific Ayah.
                </p>

                <div className="relative max-w-xl mx-auto pt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Surah name or Ayah content..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl shadow-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all outline-none text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {filteredSurahs.map((surah) => (
                    <motion.div
                        key={surah}
                        layout
                        className="glass relative rounded-[2rem] overflow-hidden transition-all duration-300 border border-white/40 dark:border-slate-800/40 shadow-xl"
                    >
                        <button
                            onClick={() => toggleSurah(surah)}
                            className={`w-full flex items-center justify-between p-8 transition-all ${expandedSurahs.includes(surah) ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-50/50 dark:hover:bg-slate-800/50'}`}
                        >
                            <div className="flex items-center gap-6">
                                <span className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-lg ${expandedSurahs.includes(surah) ? 'bg-white/20' : 'bg-emerald-600 text-white'}`}>
                                    {suras[surah].length}
                                </span>
                                <span className={`text-4xl font-arabic font-bold ${expandedSurahs.includes(surah) ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {surah}
                                </span>
                            </div>
                            <div className={`p-2 rounded-full ${expandedSurahs.includes(surah) ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                {expandedSurahs.includes(surah) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                            </div>
                        </button>

                        <AnimatePresence>
                            {expandedSurahs.includes(surah) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-white/40 dark:bg-slate-900/40 p-8 pt-4"
                                >
                                    <div className="grid grid-cols-1 gap-12">
                                        {suras[surah].map((verse: any) => {
                                            const surahId = ARABIC_TO_ID[surah];
                                            const enText = surahId ? englishQuran[`${surahId}:${verse.verseNum}`] : null;

                                            return (
                                                <div key={verse.key} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400">
                                                        <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">Ayah {verse.verseNum}</span>
                                                        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
                                                    </div>

                                                    <div className="space-y-6">
                                                        <p className="font-arabic text-4xl text-right text-slate-900 dark:text-white leading-[1.8]" dir="rtl">
                                                            {verse.matches[0].snippet}
                                                        </p>
                                                        {enText && (
                                                            <p className="text-xl text-slate-600 dark:text-slate-300 font-sans italic border-l-4 border-emerald-500 pl-6 py-2">
                                                                "{enText}"
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                                        {verse.matches.map((match: any, i: number) => (
                                                            <Link
                                                                key={i}
                                                                href={`/books/${match.book}#line-${match.location.line_index}`}
                                                                className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                                                            >
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded uppercase tracking-tighter">
                                                                            {match.book}
                                                                        </span>
                                                                        <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                                                    </div>
                                                                    <p className="text-slate-500 dark:text-slate-400 text-sm italic leading-relaxed line-clamp-2 transition-all">
                                                                        "{match.context.slice(0, 100)}..."
                                                                    </p>
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-400">
                                                                    <span>LINE {match.location.line_index + 1}</span>
                                                                    <span className="text-emerald-600 group-hover:underline">CONTINUE READING</span>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
