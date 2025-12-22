import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import time

BASE_URL = "https://www.ghazali.org/ihya-arabic/"
OUTPUT_DIR = "../data/raw"

def get_ihya_links():
    print(f"Fetching {BASE_URL}...")
    try:
        response = requests.get(BASE_URL)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching page: {e}")
        return []

    soup = BeautifulSoup(response.content, "html.parser")
    links = []
    
    # Heuristic: Look for links ending in .doc or .zip
    # The page structure needs careful parsing, but let's grab all likely file links first.
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.lower().endswith(('.doc', '.zip')):
            # Handle relative URLs
            full_url = urllib.parse.urljoin(BASE_URL, href)
            links.append(full_url)
            
    return list(set(links)) # Deduplicate

def download_file(url, folder):
    filename = url.split('/')[-1]
    filepath = os.path.join(folder, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping {filename}, already exists.")
        return

    print(f"Downloading {filename}...")
    try:
        r = requests.get(url, stream=True)
        r.raise_for_status()
        with open(filepath, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Done: {filename}")
        time.sleep(0.5) # Be nice to the server
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    links = get_ihya_links()
    print(f"Found {len(links)} potential book files.")
    
    for link in links:
        download_file(link, OUTPUT_DIR)

if __name__ == "__main__":
    main()
