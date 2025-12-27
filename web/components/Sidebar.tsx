import Link from "next/link";
import { Book, Home, Search, BookOpen, Quote } from "lucide-react";

// Quarter 1: Acts of Worship (Rub' al-Ibadat)
const rub1 = [
    { id: "j1-k01", title: "1. Book of Knowledge" },
    { id: "j1-k02", title: "2. Foundations of Belief" },
    { id: "j1-k03", title: "3. Mysteries of Purity" },
    { id: "j1-k04", title: "4. Mysteries of Prayer" },
    { id: "j1-k05", title: "5. Mysteries of Zakat" },
    { id: "j1-k06", title: "6. Mysteries of Fasting" },
    { id: "j1-k07", title: "7. Secrets of Pilgrimage" },
    { id: "j1-k08", title: "8. Etiquette of Quran" },
    { id: "j1-k09", title: "9. Invocations & Supplications" },
    { id: "j1-k10", title: "10. Arrangement of Litanies" }
];

// Quarter 2: Norms of Daily Life (Rub' al-Adat)
const rub2 = [
    // Book 11 (Eating) Missing
    { id: "j2-k02", title: "12. Etiquette of Marriage" },
    // Book 13 (Earning) Missing
    { id: "j2-k04", title: "14. The Lawful & Prohibited" },
    { id: "j2-k05", title: "15. Duties of Brotherhood" },
    { id: "j2-k06", title: "16. Etiquette of Seclusion" },
    { id: "j2-k07", title: "17. Etiquette of Travel" },
    { id: "j2-k08", title: "18. Audition & Ecstasy" },
    { id: "j2-k09", title: "19. Commanding Good" },
    // Book 20 (Prophetic Ethics) Missing
];

// Quarter 3: Ways to Perdition (Rub' al-Muhlikat)
const rub3 = [
    { id: "j3-k01", title: "21. Wonders of the Heart" },
    { id: "j3-k02", title: "22. Discipline of the Soul" },
    { id: "j3-k03", title: "23. Breaking the Two Desires" },
    { id: "j3-k04", title: "24. Vices of the Tongue" },
    { id: "j3-k05", title: "25. Condemnation of Anger" },
    { id: "j3-k06", title: "26. Condemnation of the World" },
    { id: "j3-k07", title: "27. Condemnation of Wealth" },
    { id: "j3-k08", title: "28. Condemnation of Status" },
    { id: "j3-k09", title: "29. Condemnation of Pride" },
    { id: "j3-k10", title: "30. Condemnation of Delusion" }
];

// Quarter 4: Ways to Salvation (Rub' al-Munjiyat)
const rub4 = [
    // Book 31 (Repentance) Missing
    { id: "j4-k02", title: "32. Patience & Gratitude" },
    { id: "j4-k03", title: "33. Fear & Hope" },
    // Book 34 (Poverty) Missing
    { id: "j4-k05", title: "35. Faith & Trust (Tawhid)" },
    { id: "j4-k06", title: "36. Love & Longing" },
    { id: "j4-k07", title: "37. Intention & Sincerity" },
    // Book 38 (Vigilance) Missing
    { id: "j4-k09", title: "39. Meditation" },
    // Book 40 (Death) Missing
];

const quarters = [
    { title: "Quarter 1: Worship", books: rub1 },
    { title: "Quarter 2: Daily Life", books: rub2 },
    { title: "Quarter 3: Perdition", books: rub3 },
    { title: "Quarter 4: Salvation", books: rub4 },
];

export function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 overflow-y-auto z-50 hidden md:block">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        Ghazali Explorer
                    </h1>
                </div>

                <nav className="space-y-6">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Menu
                        </p>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors">
                                    <Home className="w-4 h-4" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/tafsir" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors group">
                                    <Quote className="w-4 h-4 text-emerald-500" />
                                    <span>Ihya as Tafsir</span>
                                    <span className="ml-auto text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        Explore
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Ihya 'Ulum al-Din
                        </p>

                        {quarters.map((q, idx) => (
                            <div key={idx} className="mb-6">
                                <h3 className="px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-2 mt-2">
                                    {q.title}
                                </h3>
                                <ul className="space-y-1 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
                                    {q.books.map((book) => (
                                        <li key={book.id}>
                                            <Link href={`/books/${book.id}`} className="block px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate" title={book.title}>
                                                {book.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
}
