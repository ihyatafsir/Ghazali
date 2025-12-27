import os
import re
import json
import glob
from bs4 import BeautifulSoup

RAW_ENGLISH_DIR = "data/raw/english"
PROCESSED_ARABIC_DIR = "data/processed"
OUTPUT_DIR = "data/translations"

# Volume Layout (Approximation based on file count)
# Vol 1: Books 1-10
# Vol 2: Books 11-20
# Vol 3: Books 21-30
# Vol 4: Books 31-40

def clean_english_text(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remove navigation / header / footer junk if identifiable
    # Common patterns in old HTML: <center>, <hr>, links at top/bottom
    for tag in soup(['script', 'style', 'head', 'title', 'meta', 'iframe']):
        tag.decompose()
        
    text_blocks = []
    
    # Strategy: Extract paragraphs <p>
    # If no <p> tags, fallback to text nodes or <br> splitting
    paragraphs = soup.find_all('p')
    
    if len(paragraphs) > 5:
        for p in paragraphs:
            text = p.get_text(separator=' ', strip=True)
            if len(text) > 20: # Filter short junk
                text_blocks.append(text)
    else:
        # Fallback for pages without <p> tags (old HTML often uses <br> or just text)
        full_text = soup.get_text(separator='\n', strip=True)
        blocks = full_text.split('\n')
        text_blocks = [b.strip() for b in blocks if len(b.strip()) > 20]
        
    return text_blocks

def find_arabic_file(book_num):
    # Logic to find the corresponding Arabic file for absolute book number 1-40
    # Files are messy: Vol1-book-X.txt, jX-kY.txt, etc.
    # We need a robust mapper or search.
    
    # Check coverage script logic again.
    # Vol 1 = 1-10, Vol 2 = 11-20, Vol 3 = 21-30, Vol 4 = 31-40
    
    vol = (book_num - 1) // 10 + 1
    rel_book = (book_num - 1) % 10 + 1
    
    # Patterns to try
    patterns = [
        f"Vol{vol}-book-{rel_book}.txt",
        f"Vol{vol}-book{rel_book}.txt", # missed hyphen?
        f"j{vol}-k{rel_book:02d}.txt",
        f"j{vol}-k{rel_book}.txt",
        f"Vol{vol}-book-{rel_book}a.txt", # sometimes 'a' suffix
    ]
    
    for p in patterns:
        path = os.path.join(PROCESSED_ARABIC_DIR, p)
        if os.path.exists(path):
            return path
            
    # Fudge factor / specific fixes
    # Check fuzzy matching
    files = os.listdir(PROCESSED_ARABIC_DIR)
    for f in files:
        # Check jX-kYY
        m = re.search(f"j{vol}-k{rel_book:02d}", f)
        if m: return os.path.join(PROCESSED_ARABIC_DIR, f)
        
        m2 = re.search(f"Vol{vol}.*book.*{rel_book}", f, re.IGNORECASE)
        if m2: return os.path.join(PROCESSED_ARABIC_DIR, f)
        
    return None

def align_and_save(book_num, english_blocks, arabic_path):
    # Load Arabic lines
    with open(arabic_path, 'r', encoding='utf-8') as f:
        arabic_lines = [l.strip() for l in f.readlines() if l.strip()]
        
    # Heuristic Alignment
    # We have N Arabic lines and M English blocks.
    # N is usually >> M (Arabic lines are short, English paragraphs are long)
    # We want to map English blocks to Arabic lines.
    # One to Many: One English block covers Multiple Arabic lines.
    
    # Ratio approach
    n_ar = len(arabic_lines)
    n_en = len(english_blocks)
    
    if n_en == 0:
        print(f"Warning: No English text found for Book {book_num}")
        return

    ratio = n_ar / n_en
    
    combined = []
    
    current_ar_idx = 0
    
    for i, en_text in enumerate(english_blocks):
        # Calculate how many Arabic lines this English block should cover
        target_ar_idx = int((i + 1) * ratio)
        target_ar_idx = min(target_ar_idx, n_ar)
        
        # Grab the slice of Arabic lines
        ar_slice = arabic_lines[current_ar_idx:target_ar_idx]
        # Iterate through the Arabic lines for this English block
        for j in range(current_ar_idx, target_ar_idx):
            ar_line = arabic_lines[j]
            if j == current_ar_idx: # This is the first Arabic line in the segment
                combined.append({
                    "ar": ar_line,
                    "en": en_text
                })
            else: # Subsequent Arabic lines in the segment
                combined.append({
                    "ar": ar_line,
                    "en": "" # Empty English for subsequent lines
                })
            
        current_ar_idx = target_ar_idx
        
    # Handle remaining Arabic (if any English blocks were too few to cover all Arabic)
    while current_ar_idx < n_ar:
        combined.append({
            "ar": arabic_lines[current_ar_idx],
            "en": ""
        })
        current_ar_idx += 1
        
    # Save
    # Use the same basename as the arabic text file but with .json extension
    # This ensures the frontend (which loads by bookId matching partial text filename) finds it.
    
    arabic_filename = os.path.basename(arabic_path)
    base_name = os.path.splitext(arabic_filename)[0]
    out_name = f"{base_name}.json"
    out_path = os.path.join(OUTPUT_DIR, out_name)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
    print(f"Generated {out_path} ({len(combined)} lines)")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    raw_files = sorted(glob.glob(os.path.join(RAW_ENGLISH_DIR, "*.htm")))
    
    for html_file in raw_files:
        filename = os.path.basename(html_file)
        # Parse filename: ihya-volX-CY.htm
        m = re.search(r'vol(\d)-C(\d+)', filename)
        if not m:
            continue
            
        vol = int(m.group(1))
        chap = int(m.group(2))
        
        # Calculate absolute book num
        # Vol 1: 1-10
        # Vol 2: 11-20 (assuming C1=11, C2=12...)
        # Vol 3: 21-30
        # Vol 4: 31-40
        abs_book = (vol - 1) * 10 + chap
        
        print(f"Processing Vol {vol} Chap {chap} (Book {abs_book})...")
        
        # 1. Clean English
        with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        final_en_blocks = clean_english_text(content)
        
        # 2. Find Arabic
        arabic_path = find_arabic_file(abs_book)
        if not arabic_path:
            print(f"Skipping Book {abs_book}: Arabic file not found.")
            continue
            
        # 3. Align
        align_and_save(abs_book, final_en_blocks, arabic_path)

if __name__ == "__main__":
    main()
