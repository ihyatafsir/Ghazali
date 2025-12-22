
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

            // Index existing English data
            const enIndex: { [key: string]: string } = {};
            if (enData.quran) {
                enData.quran.forEach((v: any) => {
                    enIndex[`${v.chapter}:${v.verse}`] = v.text;
                });
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

    // Group by Surah
    const suras: { [name: string]: any[] } = {};
    Object.entries(quranIndex).forEach(([key, matches]) => {
        const [surahName, verseNum] = key.split(':');
        if (!suras[surahName]) suras[surahName] = [];
        suras[surahName].push({ key, verseNum, matches, surahName });
    });

    const SURAH_MAP: { [key: string]: string } = {
        "fatiha": "الفاتحة", "baqarah": "البقرة", "imran": "آل عمران", "nisa": "النساء",
        "maidah": "المائدة", "anam": "الأنعام", "araf": "الأعراف", "anfal": "الأنفال",
        "taubah": "التوبة", "yunus": "يونس", "hud": "هود", "yusuf": "يوسف",
        "rad": "الرعد", "ibrahim": "إبراهيم", "hijr": "الحجر", "nahl": "النحل",
        "isra": "الإسراء", "kahf": "الكهف", "maryam": "مريم", "taha": "طه",
        "anbiya": "الأنبياء", "hajj": "الحج", "muminun": "المؤمنون", "nur": "النور",
        "furqan": "الفرقان", "shuara": "الشعراء", "naml": "النمل", "qasas": "القصص",
        "ankabut": "العنكبوت", "rum": "الروم", "luqman": "لقمان", "sajdah": "السجدة",
        "ahzab": "الأحزاب", "saba": "سبأ", "fatir": "فاطر", "yasin": "يس",
        "saffat": "الصافات", "sad": "ص", "zumar": "الزمر", "ghafir": "غافر",
        "fussilat": "فصلت", "shura": "الشورى", "zukhruf": "الزخرف", "dukhan": "الدخان",
        "jathiyah": "الجاثية", "ahqaf": "الأحقاف", "muhammad": "محمد", "fath": "الفتح",
        "hujurat": "الحجرات", "qaf": "ق", "dhariyat": "الذاريات", "tur": "الطور",
        "najm": "النجم", "qamar": "القمر", "rahman": "الرحمن", "waqiah": "الواقعة",
        "hadid": "الحديد", "mujadilah": "المجادلة", "hashr": "الحشر", "mumtahanah": "الممتحنة",
        "saff": "الصف", "jumuah": "الجمعة", "munafiqun": "المنافقون", "taghabun": "التغابن",
        "talaq": "الطلاق", "tahrim": "التحريم", "mulk": "الملك", "qalam": "القلم",
        "haqqah": "الحاقة", "maarij": "المعارج", "nuh": "نوح", "jinn": "الجن",
        "muzammil": "المزمل", "muddathir": "المدثر", "qiyamah": "القيامة", "insan": "الإنسان",
        "mursalat": "المرسلات", "naba": "النبأ", "naziat": "النازعات", "abasa": "عبس",
        "takwir": "التكوير", "infitar": "الانفطار", "mutaffifin": "المطففين", "inshiqaq": "الانشقاق",
        "buruj": "البروج", "tariq": "الطارق", "ala": "الأعلى", "ghashiyah": "الغاشية",
        "fajr": "الفجر", "balad": "البلد", "shams": "الشمس", "layl": "الليل",
        "duha": "الضحى", "sharh": "الشرح", "tin": "التين", "alaq": "العلق",
        "qadr": "القدر", "bayyinah": "البينة", "zalzalah": "الزلزلة", "adiyat": "العاديات",
        "qariah": "القارعة", "takathur": "التكاثر", "asr": "العصر", "humazah": "الهمزة",
        "fil": "الفيل", "quraish": "قريش", "maun": "الماعون", "kawthar": "الكوثر",
        "kafirun": "الكافرون", "nasr": "النصر", "masad": "المسد", "ikhlas": "الإخلاص",
        "falaq": "الفلق", "nas": "الناس"
    };

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

        // English match
        const enMatch = Object.entries(SURAH_MAP).some(([en, ar]) =>
            en.includes(q) && s.includes(ar)
        );

        return s.includes(q) || enMatch ||
            suras[s].some(v => v.matches.some((m: any) => m.snippet.includes(searchQuery)));
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                    Ihya 'Ulum al-Din as Tafsir
                </h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Explore Al-Ghazali's commentary on the Quran, organized by Surah and Ayah.
                    This interface transforms the Ihya into a thematic Tafsir.
                </p>
            </div>

            <div className="relative mb-10 max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search Surah or Verse text..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filteredSurahs.map((surah) => (
                    <div key={surah} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                        <button
                            onClick={() => toggleSurah(surah)}
                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                                    {suras[surah].length}
                                </div>
                                <span className="text-xl font-arabic font-bold text-slate-800 dark:text-slate-200">
                                    {surah}
                                </span>
                            </div>
                            {expandedSurahs.includes(surah) ? <ChevronDown /> : <ChevronRight />}
                        </button>

                        <AnimatePresence>
                            {expandedSurahs.includes(surah) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 dark:border-slate-700"
                                >
                                    <div className="p-5 grid grid-cols-1 gap-6">
                                        {suras[surah].map((verse: any) => {
                                            const surahId = ARABIC_TO_ID[surah];
                                            const enText = surahId ? englishQuran[`${surahId}:${verse.verseNum}`] : null;

                                            return (
                                                <div key={verse.key} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                            Ayah {verse.verseNum}
                                                        </span>
                                                        <Link
                                                            href={`/search?q=${verse.key}`}
                                                            className="text-xs flex items-center gap-1 text-slate-400 hover:text-emerald-500 transition-colors"
                                                        >
                                                            Cross-reference <ExternalLink size={12} />
                                                        </Link>
                                                    </div>

                                                    <p className="font-arabic text-2xl text-right text-slate-800 dark:text-slate-200 mb-4 leading-relaxed" dir="rtl">
                                                        {verse.matches[0].snippet}
                                                    </p>

                                                    {enText && (
                                                        <p className="text-slate-600 dark:text-slate-400 mb-6 italic leading-relaxed border-l-2 border-emerald-500 pl-4">
                                                            "{enText}"
                                                        </p>
                                                    )}

                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ghazali's Commentary (Ihya Context)</h4>
                                                        {verse.matches.map((match: any, i: number) => (
                                                            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                                                <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-3 line-clamp-3 leading-relaxed">
                                                                    "... {match.context} ..."
                                                                </p>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded uppercase">
                                                                        {match.book}
                                                                    </span>
                                                                    <Link
                                                                        href={`/books/${match.book}#line-${match.location.line_index}`}
                                                                        className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 hover:underline"
                                                                    >
                                                                        Read Section <BookOpen size={12} />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
