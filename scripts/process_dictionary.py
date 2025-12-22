
import json
import os
import tqdm

# Resolve paths relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(BASE_DIR, "../data/raw/lisanclean.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "../web/public/dictionary_index.json") 

def clean_text(text):
    if not text: return ""
    return text.strip()

def main():
    if not os.path.exists(os.path.dirname(OUTPUT_FILE)):
        os.makedirs(os.path.dirname(OUTPUT_FILE))

    print("Loading Lisan al-Arab...")
    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"File not found: {INPUT_FILE}")
        return

    optimized_dict = {}
    print("Optimization: Mapping word -> explanation...")
    for entry in tqdm.tqdm(data):
        word = clean_text(entry.get('word', ''))
        explanation = clean_text(entry.get('explanation', ''))
        
        if word:
            if word in optimized_dict:
                optimized_dict[word] += "\n---\n" + explanation
            else:
                optimized_dict[word] = explanation

    print(f"Index size: {len(optimized_dict)} unique terms.")
    
    print(f"Saving to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(optimized_dict, f, ensure_ascii=False)
    print("Done.")

if __name__ == "__main__":
    main()
