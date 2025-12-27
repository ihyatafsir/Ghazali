import os
import re

DATA_DIR = "data/processed"
REQUIRED_BOOKS = 40

def main():
    files = os.listdir(DATA_DIR)
    
    # Try to map filenames to books (1-40)
    # Filename patterns observed: 
    # - Vol1-book-X.txt
    # - jX-kY.txt (Juz X, Kitab Y? or Book Y?)
    # - badawi-ihya.txt ?
    
    # Let's normalize everything to a "Book number" (1-40)
    # Vol 1 = Books 1-10
    # Vol 2 = Books 11-20
    # Vol 3 = Books 21-30
    # Vol 4 = Books 31-40
    
    found_books = set()
    
    for f in files:
        if not f.endswith(".txt"): continue
        
        # Pattern: VolX-book-Y
        m = re.search(r'Vol(\d)-book-?(\d+)', f, re.IGNORECASE)
        if m:
            vol = int(m.group(1))
            book_in_vol = int(m.group(2))
            # Calculate absolute book number
            # Vol 1: 1-10, Vol 2: 11-20...
            # But the extracted Book num (book_in_vol) might be 1-10 or absolute?
            # Assuming relative:
            abs_book = (vol - 1) * 10 + book_in_vol
            found_books.add(abs_book)
            continue
            
        # Pattern: jX-kY
        m = re.search(r'j(\d)-k(\d+)', f, re.IGNORECASE)
        if m:
            vol = int(m.group(1))
            k_num = int(m.group(2)) # This k_num might be relative or absolute?
            # Usually K is "Kitab". In Ihya numbering, Kitab 1..40.
            # But in file naming like j1-k01, it matches Vol 1 Book 1.
            # j3-k04 -> Vol 3 Book 4? = Book 24?
            
            # Let's assume K is relative to J unless K > 10
            if k_num <= 10:
                abs_book = (vol - 1) * 10 + k_num
                found_books.add(abs_book)
            else:
                # If K is > 10, maybe it's absolute?
                found_books.add(k_num)
            continue

    print(f"Found {len(found_books)} unique books out of 40.")
    missing = [b for b in range(1, 41) if b not in found_books]
    
    if missing:
        print(f"Missing Books: {sorted(missing)}")
    else:
        print("All 40 books are present!")

if __name__ == "__main__":
    main()
