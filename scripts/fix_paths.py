import os
import re
import glob

DATA_DIR = "data/processed"

def normalize_name(filename):
    # Target format: jX-kYY.txt
    
    # Already correct?
    if re.match(r'^j\d-k\d{2}\.txt$', filename):
        return None

    # Handle VolX-book-Y patterns
    # Vol1-book-2.txt -> j1-k02.txt
    m = re.match(r'^Vol(\d)-book-?(\d+)[a-z]?\.txt$', filename, re.IGNORECASE)
    if m:
        vol = int(m.group(1))
        book = int(m.group(2))
        return f"j{vol}-k{book:02d}.txt"
        
    # Handle jX-kY (single digit K) -> jX-k0Y
    m = re.match(r'^j(\d)-k(\d)\.txt$', filename, re.IGNORECASE)
    if m:
        vol = int(m.group(1))
        book = int(m.group(2))
        return f"j{vol}-k{book:02d}.txt"

    return None

def main():
    files = sorted(os.listdir(DATA_DIR))
    
    for filename in files:
        if not filename.endswith(".txt"): continue
        
        new_name = normalize_name(filename)
        if new_name:
            old_path = os.path.join(DATA_DIR, filename)
            new_path = os.path.join(DATA_DIR, new_name)
            
            # Avoid overwriting if possible, or handle duplicates
            if os.path.exists(new_path):
                print(f"Skipping {filename} -> {new_name} (Target exists)")
                # If target exists and source is different, maybe compare sizes?
                # For now, let's assume if target exists, it's fine, but we might want to consolidate.
                continue
                
            print(f"Renaming {filename} -> {new_name}")
            os.rename(old_path, new_path)
            
    # Clean up any badawi-ihya or weird files if they aren't part of the 40 books?
    # badawi-ihya.txt seems to be an intro or full text. Leave it for now.

if __name__ == "__main__":
    main()
