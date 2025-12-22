
import fs from 'fs';
import path from 'path';
import { BilingualReader } from '@/components/BilingualReader';
import { BookOpen } from 'lucide-react';

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
        console.error(e);
        return (
            <div className="p-12 text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Book Not Found</h2>
                <p className="text-slate-500 mt-2">Could not load content for {bookId}</p>
            </div>
        );
    }

    const lines = content.split('\n').filter(line => line.trim().length > 0);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-12">
            <div className="mb-16 border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Book {bookId.split('-')[1]}</span>
                        <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ihya 'Ulum al-Din</span>
                    </div>
                    <h1 className="text-5xl font-amiri font-bold text-slate-900 dark:text-white capitalize">
                        {bookId.replace(/j\d+-k/, '').replace(/-/g, ' ')}
                    </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    {lectureData && (
                        <a
                            href={lectureData.lectures[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-sm text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Listen to Lecture</span>
                        </a>
                    )}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">BILINGUAL SYNC SESSIONS</span>
                    </div>
                </div>
            </div>

            <BilingualReader bookId={bookId} lines={lines} translations={translations} />

            <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 text-center">
                <p className="text-slate-400 text-sm">End of Selected Section</p>
                <div className="flex justify-center gap-4 mt-6">
                    <button className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm font-bold">Previous Book</button>
                    <button className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-sm font-bold">Next Book</button>
                </div>
            </div>
        </div>
    );
}
