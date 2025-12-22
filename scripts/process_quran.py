
import os
import sys
import json
import tqdm
import glob

# Resolve paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR) # e.g. /home/.../ghazali
QURAN_DETECTOR_PATH = os.path.join(PROJECT_ROOT, "Quran_Detector")

sys.path.append(QURAN_DETECTOR_PATH)

try:
    # Based on file inspection, the class is qMatcherAnnotater
    from QuranDetectorAnnotater import qMatcherAnnotater
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

TEXT_DIR = os.path.join(PROJECT_ROOT, "data/processed")
OUTPUT_INDEX = os.path.join(PROJECT_ROOT, "web/public/quran_index.json")

def main():
    if not os.path.exists(os.path.dirname(OUTPUT_INDEX)):
        os.makedirs(os.path.dirname(OUTPUT_INDEX))

    print("Initializing Quran Matcher (this loads models)...")
    # Using CWD trick because the library presumably loads files relative to CWD 'dfiles/'
    # The library has lines like loadStops('dfiles/nonTerminals.txt')
    # So we MUST run this with CWD = Quran_Detector directory, OR symlink dfiles to current dir.
    # Easiest: Change CWD effectively.
    
    original_cwd = os.getcwd()
    os.chdir(QURAN_DETECTOR_PATH)
    try:
        matcher = qMatcherAnnotater()
    finally:
        os.chdir(original_cwd)

    files = glob.glob(os.path.join(TEXT_DIR, "*.txt"))
    print(f"Scanning {len(files)} files for Quranic verses...")

    # Index Structure:
    # {
    #   "SurahName:AyahNum": [
    #       { "book": "BookName", "text_snippet": "..." }
    #   ]
    # }
    quran_index = {}

    for filepath in tqdm.tqdm(files):
        filename = os.path.basename(filepath)
        book_name = os.path.splitext(filename)[0]
        
        with open(filepath, "r", encoding="utf-8") as f:
            lines_raw = f.readlines()
            text = "".join(lines_raw)
        
        # Build word-to-line map
        # matcher.matchVersesInText uses .split() which ignores whitespace (including newlines)
        # So we can map each word index to its original line number.
        word_to_line = []
        for line_idx, line_text in enumerate(lines_raw):
            w_count = len(line_text.split())
            word_to_line.extend([line_idx] * w_count)

        # Run detection
        try:
           # Results is dict: SurahName -> [matchRec, matchRec...]
           results, errs = matcher.matchVersesInText(text, matcher.all)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue

        words = text.split()
        # word_to_line and words should have the same length
        
        for sura_name, matches in results.items():
            for match in matches:
                # match is a matchRec object
                # It has .ayaName, .startIdx, .endIdx (if multi-verse), .getStr()
                
                verse_key = f"{match.ayaName}:{match.startIdx}"
                if match.endIdx > match.startIdx:
                    verse_key += f"-{match.endIdx}"

                verse_text = match.getStr()
                
                # Extract context (approx 30 words before and after)
                context_start_idx = max(0, match.startInText - 30)
                context_end_idx = min(len(words), match.endInText + 30)
                context_text = " ".join(words[context_start_idx:context_end_idx]).strip()

                # Get line index from word index
                line_index = -1
                if match.startInText < len(word_to_line):
                    line_index = word_to_line[match.startInText]

                entry = {
                    "book": book_name,
                    "snippet": verse_text,
                    "context": context_text,
                    "location": {
                        "start": match.startIdx,
                        "end": match.endIdx,
                        "word_start": match.startInText,
                        "word_end": match.endInText,
                        "line_index": line_index
                    }
                }

                if verse_key not in quran_index:
                    quran_index[verse_key] = []
                
                quran_index[verse_key].append(entry)

    print(f"Found verses from {len(quran_index)} unique citations.")
    
    print(f"Saving to {OUTPUT_INDEX}...")
    with open(OUTPUT_INDEX, "w", encoding="utf-8") as f:
        json.dump(quran_index, f, ensure_ascii=False)
    print("Done.")

if __name__ == "__main__":
    main()
