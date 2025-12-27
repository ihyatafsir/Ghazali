import os
import requests
import time
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://www.ghazali.org/ihya/english/ihya-vol{}-{}.htm"
OUTPUT_DIR = "data/raw/english"

# Headers to mimic a browser to avoid 403/503
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def download_book(vol, book_num):
    # Construct filename pattern
    # Pattern seems to be: ihya-vol1-C1.htm
    # But let's check variances.
    # Vol 1: C1 to C10
    # Vol 2: C1 to C10 (likely resets or continues?)
    # Browser agent said: "Vol 2: Chapters 1 through 11"
    # Typically Ihya is 40 books.
    
    # URL construction:
    # Most likely: "ihya-vol1-C1.htm"
    chapter_str = f"C{book_num}"
    filename = f"ihya-vol{vol}-{chapter_str}.htm"
    url = f"https://www.ghazali.org/ihya/english/{filename}"
    
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    if os.path.exists(output_path):
        print(f"Skipping {filename} (already exists)")
        return
        
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            with open(output_path, 'w', encoding='utf-8', errors='ignore') as f:
                f.write(response.text)
            print(f"Saved {filename}")
        else:
            print(f"Failed {filename}: Status {response.status_code}")
    except Exception as e:
        print(f"Error fetching {filename}: {e}")
    
    # Polite delay
    time.sleep(1)

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    # Volumes layout based on browser inspection
    # Vol 1: Books 1-10
    # Vol 2: Books 1-10 (re-numbered?) or 11-20?
    # Usually files are named C1..C10 regardless of volume in some archives, 
    # OR they might be C1..C40?
    # Browser agent example: "ihya-vol4-C10.htm"
    # This suggests each volume resets the C count to 1..10.
    
    tasks = []
    
    # Vol 1
    for i in range(1, 11): tasks.append((1, i))
    
    # Vol 2 (Browser said 11 chapters? Let's try 1-12 to be safe)
    # The list said "Vol 2: Chapters 1 through 11"
    for i in range(1, 12): tasks.append((2, i))
    
    # Vol 3 (1-10)
    for i in range(1, 11): tasks.append((3, i))
    
    # Vol 4 (1-10)
    for i in range(1, 11): tasks.append((4, i))

    print(f"Queueing {len(tasks)} downloads...")
    
    # Sequential download to be polite and avoid blocks
    for vol, book in tasks:
        download_book(vol, book)

if __name__ == "__main__":
    main()
