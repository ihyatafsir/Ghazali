
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Memory-efficient sharded lookup
const shardCache = new Map<string, any>();

function getShard(word: string) {
    if (!word) return null;
    const firstChar = word[0];
    const isArabic = /[\u0600-\u06FF]/.test(firstChar);
    const shardName = isArabic ? `shard_${firstChar.charCodeAt(0)}.json` : 'shard_other.json';

    if (shardCache.has(shardName)) {
        return shardCache.get(shardName);
    }

    try {
        const baseDir = fs.existsSync(path.join(process.cwd(), 'web'))
            ? path.join(process.cwd(), 'web/public/dictionary')
            : path.join(process.cwd(), 'public/dictionary');
        const filePath = path.join(baseDir, shardName);

        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (shardCache.size > 5) {
                const firstKey = shardCache.keys().next().value;
                if (firstKey) shardCache.delete(firstKey);
            }
            shardCache.set(shardName, data);
            return data;
        }
    } catch (err) {
        console.error(`Error loading shard ${shardName}:`, err);
    }
    return null;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');

    if (!word) {
        return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    try {
        const cleanWord = word.trim();
        let shard = getShard(cleanWord);
        let definition = shard ? shard[cleanWord] : null;

        // Smart Arabic lookup: try removing common prefixes
        if (!definition && /[\u0600-\u06FF]/.test(cleanWord)) {
            const prefixes = ['ال', 'و', 'ب', 'ف', 'ك', 'ل'];
            for (const p of prefixes) {
                if (cleanWord.startsWith(p) && cleanWord.length > p.length + 2) {
                    const stripped = cleanWord.substring(p.length);
                    const stripedShard = getShard(stripped);
                    if (stripedShard && stripedShard[stripped]) {
                        definition = stripedShard[stripped];
                        break;
                    }
                }
            }
        }

        return NextResponse.json({ word, definition });
    } catch (error) {
        console.error('Dictionary API error:', error);
        return NextResponse.json({ error: 'Failed to lookup word' }, { status: 500 });
    }
}
