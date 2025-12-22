import os
import subprocess
import glob
from tqdm import tqdm

# Resolve paths relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "../data/raw")
PROCESSED_DIR = os.path.join(BASE_DIR, "../data/processed")

def convert_doc_to_text(filepath):
    """
    Converts .doc file to text using antiword.
    """
    try:
        # Antiword writes to stdout
        result = subprocess.run(
            ['antiword', filepath], 
            capture_output=True, 
            text=True, 
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error converting {filepath}: {e}")
        return None

def main():
    if not os.path.exists(PROCESSED_DIR):
        os.makedirs(PROCESSED_DIR)

    # Gather all .doc files
    files = glob.glob(os.path.join(RAW_DIR, "*.doc"))
    print(f"Found {len(files)} .doc files to process.")

    for file_path in tqdm(files):
        filename = os.path.basename(file_path)
        base_name = os.path.splitext(filename)[0]
        output_path = os.path.join(PROCESSED_DIR, f"{base_name}.txt")

        if os.path.exists(output_path):
            continue

        text = convert_doc_to_text(file_path)
        if text:
            # Basic cleanup: remove excessive newlines
            text = "\n".join([line for line in text.splitlines() if line.strip()])
            
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(text)
    
    print("Conversion complete.")

if __name__ == "__main__":
    main()
