import json
import os

def shard_dictionary():
    dict_path = 'web/public/dictionary_index.json'
    output_dir = 'web/public/dictionary'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print(f"Loading {dict_path}...")
    with open(dict_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    shards = {}
    
    for word, definition in data.items():
        if not word:
            continue
        # Get first character (or 'other' if not Arabic)
        first_char = word[0]
        if not ('\u0600' <= first_char <= '\u06FF'):
            first_char = 'other'
            
        if first_char not in shards:
            shards[first_char] = {}
            
        shards[first_char][word] = definition
        
    print(f"Split into {len(shards)} shards. Saving...")
    
    # Save a manifest as well
    manifest = list(shards.keys())
    with open(os.path.join(output_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False)
        
    for char, content in shards.items():
        shard_filename = f"shard_{ord(char)}.json" if char != 'other' else "shard_other.json"
        with open(os.path.join(output_dir, shard_filename), 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False)
            
    print("Done! Sharded dictionary saved in web/public/dictionary/")

if __name__ == '__main__':
    shard_dictionary()
