import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { BilingualReader } from '@/components/BilingualReader';
import { BookOpen, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';

interface ReaderProps {
    params: Promise<{
        bookId: string;
    }>;
}

export default async function BookPage({ params }: ReaderProps) {
    const { bookId } = await params;

    if (!/^[a-zA-Z0-9-]+$/.test(bookId)) {
        return <div className="p-10 text-red-500">Invalid Book ID</div>;
    }

    const DATA_DIR = "/home/absolut7/Documents/ghazali/data/processed";
    const TRANS_DIR = "/home/absolut7/Documents/ghazali/data/translations";
    const filePath = path.join(DATA_DIR, `${bookId}.txt`);
    const transPath = path.join(TRANS_DIR, `${bookId}.json`);
    const LECTURES_INDEX = "/home/absolut7/Documents/ghazali/data/lectures_index.json";

    let content = '';
    let translations: { ar: string, en: string }[] = [];
    let lectureData = null;

    try {
        content = fs.readFileSync(filePath, 'utf-8');
        if (fs.existsSync(transPath)) {
            translations = JSON.parse(fs.readFileSync(transPath, 'utf-8'));
        }
        if (fs.existsSync(LECTURES_INDEX)) {
            const allLectures = JSON.parse(fs.readFileSync(LECTURES_INDEX, 'utf-8'));
            lectureData = allLectures[bookId] || null;
        }
    } catch (e) {
        return (
            <div className="p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Book Not Found</h2>
                <p className="text-slate-500 mt-2">Could not load content for {bookId}</p>
                <Link href="/" className="mt-8 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg">Back Home</Link>
            </div>
        );
    }

    const lines = content.split('\n').filter(line => line.trim().length > 0);

    // Navigation logic
    const m = bookId.match(/j(\d+)-k(\d+)/);
    let prevId = null;
    let nextId = null;
    if (m) {
        const j = parseInt(m[1]);
        const k = parseInt(m[2]);
        if (k > 1) prevId = `j${j}-k${(k - 1).toString().padStart(2, '0')}`;
        if (k < 10) nextId = `j${j}-k${(k + 1).toString().padStart(2, '0')}`;
        else if (j < 4) nextId = `j${j + 1}-k01`;
    }

    return (
        <div className="max-w-7xl mx-auto py-16 px-6 lg:px-12 animate-fade-in">
            <header className="mb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-slate-200 dark:border-slate-800/60">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                                BOOK {m ? m[2] : '??'}
                            </span>
                            <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                            <span className="text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                Ihya 'Ulum al-Din
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-amiri font-bold text-slate-900 dark:text-white leading-tight">
                            {bookId.split('-').length > 1 ? bookId.split('-').slice(1).join(' ').replace('k', 'Book ') : bookId}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {lectureData && (
                            <a
                                href={lectureData.lectures[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all text-emerald-700 dark:text-emerald-400 font-bold group"
                            >
                                <PlayCircle className="w-5 h-5 group-hover:animate-pulse" />
                                <span className="text-sm">Listen to Lecture</span>
                            </a>
                        )}
                        <div className="glass flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wider">SYNCED SESSION</span>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <BilingualReader bookId={bookId} lines={lines} translations={translations} />
            </main>

            <footer className="mt-32 pt-16 border-t border-slate-200 dark:border-slate-800/60 flex flex-col items-center gap-10">
                <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-800">
                    End of Wisdom
                </div>

                <div className="flex justify-between w-full max-w-2xl">
                    {prevId ? (
                        <Link href={`/books/${prevId}`} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all font-bold group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Previous Book
                        </Link>
                    ) : <div />}

                    {nextId ? (
                        <Link href={`/books/${nextId}`} className="flex items-center gap-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-8 py-3 rounded-2xl shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 border border-transparent transition-all font-bold group">
                            Next Book
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : <div />}
                </div>
            </footer>
        </div>
    );
}
