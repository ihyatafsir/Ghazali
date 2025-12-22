
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let dictionaryCache: any = null;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');

    if (!word) {
        return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    try {
        if (!dictionaryCache) {
            const filePath = path.join(process.cwd(), 'public/dictionary_index.json');
            const data = fs.readFileSync(filePath, 'utf-8');
            dictionaryCache = JSON.parse(data);
        }

        const definition = dictionaryCache[word.trim()] || null;
        return NextResponse.json({ word, definition });
    } catch (error) {
        console.error('Dictionary API error:', error);
        return NextResponse.json({ error: 'Failed to lookup word' }, { status: 500 });
    }
}
