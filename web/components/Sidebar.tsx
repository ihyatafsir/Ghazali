import Link from "next/link";
import { Book, Home, Search, BookOpen, Quote } from "lucide-react";

// Simplified list for the sidebar based on files found
const rub1 = [
    { id: "j1-k01", title: "Book of Knowledge" },
    { id: "j1-k02", title: "Articles of Faith" },
    { id: "j1-k03", title: "Mysteries of Purity" },
    { id: "j1-k04", title: "Mysteries of Prayer" },
    { id: "j1-k05", title: "Mysteries of Zakat" },
    { id: "j1-k06", title: "Mysteries of Fasting" },
    { id: "j1-k07", title: "Secrets of Pilgrimage" },
    { id: "j1-k08", title: "Etiquette of Quran" },
    { id: "j1-k10", title: "Orisons & Invocations" }
];

const rub3 = [
    { id: "j3-k01", title: "Wonders of the Heart" },
    { id: "j3-k02", title: "Discipline of the Soul" },
    { id: "j3-k04", title: "Lusts of Stomach & Sex" },
    { id: "j3-k05", title: "Vices of the Tongue" },
    { id: "j3-k06", title: "Anger, Rancour & Envy" }
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

                        <div className="mb-4">
                            <h3 className="px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-2 mt-4">
                                Quarter 1: Worship
                            </h3>
                            <ul className="space-y-1 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
                                {rub1.map((book) => (
                                    <li key={book.id}>
                                        <Link href={`/books/${book.id}`} className="block px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                                            {book.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-4">
                            <h3 className="px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-2 mt-4">
                                Quarter 3: Perdition
                            </h3>
                            <ul className="space-y-1 pl-2 border-l border-slate-200 dark:border-slate-800 ml-2">
                                {rub3.map((book) => (
                                    <li key={book.id}>
                                        <Link href={`/books/${book.id}`} className="block px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                                            {book.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
