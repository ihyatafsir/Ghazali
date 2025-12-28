"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Home, Search, BookOpen, Quote, ChevronRight, Compass } from "lucide-react";
import { motion } from "framer-motion";

// Quarters of Ihya with Arabic Titles
const rub1 = [
    { id: "j1-k01", title: "Book of Knowledge", ar: "كتاب العلم" },
    { id: "j1-k02", title: "Foundations of Belief", ar: "قواعد العقائد" },
    { id: "j1-k03", title: "Mysteries of Purity", ar: "أسرار الطهارة" },
    { id: "j1-k04", title: "Mysteries of Prayer", ar: "أسرار الصلاة" },
    { id: "j1-k05", title: "Mysteries of Zakat", ar: "أسرار الزكاة" },
    { id: "j1-k06", title: "Mysteries of Fasting", ar: "أسرار الصيام" },
    { id: "j1-k07", title: "Secrets of Pilgrimage", ar: "أسرار الحج" },
    { id: "j1-k08", title: "Etiquette of Quran", ar: "آداب تلاوة القرآن" },
    { id: "j1-k09", title: "Invocations & Supplications", ar: "الأذكار والدعوات" },
    { id: "j1-k10", title: "Arrangement of Litanies", ar: "ترتيب الأوراد" }
];

const rub2 = [
    { id: "j2-k02", title: "Etiquette of Marriage", ar: "آداب النكاح" },
    { id: "j2-k04", title: "The Lawful & Prohibited", ar: "الحلال والحرام" },
    { id: "j2-k05", title: "Duties of Brotherhood", ar: "آداب الألفة والأخوة" },
    { id: "j2-k06", title: "Etiquette of Seclusion", ar: "آداب العزلة" },
    { id: "j2-k07", title: "Etiquette of Travel", ar: "آداب السفر" },
    { id: "j2-k08", title: "Audition & Ecstasy", ar: "آداب السماع والوجد" },
    { id: "j2-k09", title: "Commanding Good", ar: "الأمر بالمعروف والنهي عن المنكر" },
];

const rub3 = [
    { id: "j3-k01", title: "Wonders of the Heart", ar: "شرح عجائب القلب" },
    { id: "j3-k02", title: "Disciplining the Soul", ar: "رياضة النفس" },
    { id: "j3-k03", title: "The Two Desires", ar: "كسر الشهوتين" },
    { id: "j3-k04", title: "Vices of Tongue", ar: "آفات اللسان" },
    { id: "j3-k05", title: "Anger & Malice", ar: "ذم الغضب والحقد" },
    { id: "j3-k06", title: "Vices of the World", ar: "ذم الدنيا" },
    { id: "j3-k07", title: "Love of Wealth", ar: "ذم البخل وحب المال" },
    { id: "j3-k08", title: "Audition & Ecstasy", ar: "آداب السماع والوجد" }, // Note: duplicate in some lists, but j3-k08 is usually status
    { id: "j3-k09", title: "Pride & Conceit", ar: "ذم الكبر والعجب" },
    { id: "j3-k10", title: "Condemnation of Delusion", ar: "ذم الغرور" }
];

const rub4 = [
    { id: "j4-k01", title: "Repentance", ar: "كتاب التوبة" },
    { id: "j4-k02", title: "Patience & Gratitude", ar: "الصبر والشكر" },
    { id: "j4-k03", title: "Fear & Hope", ar: "الخوف والرجاء" },
    { id: "j4-k05", title: "Love & Longing", ar: "المحبة والشوق" },
    { id: "j4-k06", title: "Intention & Sincerity", ar: "النية والإخلاص" },
    { id: "j4-k07", title: "Vigilance & Self-Accounting", ar: "المراقبة والمحاسبة" },
    { id: "j4-k09", title: "Remembrance of Death", ar: "ذكر الموت" }
];

export function Sidebar() {
    const pathname = usePathname();

    const NavLink = ({ href, icon: Icon, children, ar }: any) => {
        const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
        return (
            <Link
                href={href}
                className={`group relative flex flex-col p-3 rounded-2xl transition-all duration-500 mb-1 ${isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "group-hover:text-emerald-500"}`} />
                    <span className="font-bold text-[13px] tracking-tight truncate">{children}</span>
                </div>
                {ar && (
                    <span className={`text-[10px] mt-1 font-arabic text-right opacity-80 ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                        {ar}
                    </span>
                )}
                {isActive && (
                    <motion.div
                        layoutId="active-nav-glow"
                        className="absolute inset-0 bg-emerald-600 rounded-2xl -z-10 blur-sm opacity-20"
                    />
                )}
            </Link>
        );
    };

    const SectionHeader = ({ title, ar }: { title: string, ar: string }) => (
        <div className="px-3 mt-10 mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                {title}
            </h3>
            <span className="font-arabic text-[10px] text-emerald-600 opacity-60">{ar}</span>
        </div>
    );

    return (
        <aside className="w-80 h-screen overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col px-4 py-8 custom-scrollbar scroll-smooth">
            <div className="flex items-center gap-4 px-3 mb-12">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <Compass className="text-white w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        Ghazali <span className="text-emerald-600">Explorer</span>
                    </h1>
                    <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest mt-2">The Revivification</p>
                </div>
            </div>

            <nav className="space-y-1">
                <div className="mb-8">
                    <NavLink href="/" icon={Home}>Portal Home</NavLink>
                    <NavLink href="/tafsir" icon={BookOpen}>Ihya as Tafsir</NavLink>
                    <NavLink href="/search" icon={Search}>Library Search</NavLink>
                </div>

                <SectionHeader title="Worship" ar="العبادات" />
                {rub1.map(b => (
                    <NavLink key={b.id} href={`/books/${b.id}`} icon={Quote} ar={b.ar}>{b.title}</NavLink>
                ))}

                <SectionHeader title="Daily Life" ar="العادات" />
                {rub2.map(b => (
                    <NavLink key={b.id} href={`/books/${b.id}`} icon={Quote} ar={b.ar}>{b.title}</NavLink>
                ))}

                <SectionHeader title="Perils" ar="المهلكات" />
                {rub3.map(b => (
                    <NavLink key={b.id} href={`/books/${b.id}`} icon={Quote} ar={b.ar}>{b.title}</NavLink>
                ))}

                <SectionHeader title="Salvation" ar="المنجيات" />
                {rub4.map(b => (
                    <NavLink key={b.id} href={`/books/${b.id}`} icon={Quote} ar={b.ar}>{b.title}</NavLink>
                ))}
            </nav>

            <div className="mt-16 pt-8 pb-4 text-center">
                <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20">
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-[0.2em] mb-2">Spiritual Beacon</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">"Knowledge without action is insanity, and action without knowledge is vanity."</p>
                </div>
            </div>
        </aside>
    );
}
