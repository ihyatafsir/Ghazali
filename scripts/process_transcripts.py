import os
import re
import json
import webvtt

def clean_text(text):
    # Remove word-level timestamps like <00:00:30.000>
    text = re.sub(r'<\d{2}:\d{2}:\d{2}\.\d{3}>', '', text)
    # Remove HTML-like tags like <c> or </c>
    text = re.sub(r'</?[a-z]>', '', text)
    # Remove standard VTT timestamps and metadata
    text = re.sub(r'\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}.*?\n', '\n', text)
    # Remove Kind/Language headers if present
    text = re.sub(r'(Kind:|Language:|WEBVTT).*?\n', '', text, flags=re.IGNORECASE)
    
    # Normalize whitespace
    text = ' '.join(text.split())
    return text

def parse_vtt(filepath):
    vtt = webvtt.read(filepath)
    full_text = []
    last_line = ""
    
    for caption in vtt:
        cleaned = clean_text(caption.text)
        if not cleaned:
            continue
            
        # YouTube VTT often has additive lines like:
        # 1: "Hello"
        # 2: "Hello world"
        # 3: "Hello world how"
        if cleaned.startswith(last_line):
            # It's an extension of the previous line
            new_part = cleaned[len(last_line):].strip()
            if new_part:
                full_text.append(new_part)
                last_line = cleaned
        else:
            # It's a new segment
            full_text.append(cleaned)
            last_line = cleaned
            
    return " ".join(full_text)

def align_transcript(transcript_text, arabic_file, output_json):
    with open(arabic_file, 'r', encoding='utf-8') as f:
        arabic_lines = [line.strip() for line in f.readlines() if line.strip()]

    # Simple heuristic: Divide transcript into equal-sized chunks based on Arabic lines
    # In a real app, we'd use Quranic citations as anchor points.
    
    num_lines = len(arabic_lines)
    words = transcript_text.split()
    words_per_line = max(1, len(words) // num_lines)
    
    translations = []
    for i in range(num_lines):
        start_idx = i * words_per_line
        end_idx = (i + 1) * words_per_line if i < num_lines - 1 else len(words)
        english_chunk = ' '.join(words[start_idx:end_idx])
        
        translations.append({
            "arabic": arabic_lines[i],
            "english": english_chunk
        })
    
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    # Example for one file
    vtt_path = "data/lectures/session1.en.vtt"
    arabic_path = "data/processed/j1-k01.txt"
    output_path = "data/translations/j1-k01.json"
    
    if os.path.exists(vtt_path) and os.path.exists(arabic_path):
        print(f"Aligning {vtt_path} with {arabic_path}...")
        text = parse_vtt(vtt_path)
        align_transcript(text, arabic_path, output_path)
        print(f"Saved to {output_path}")
    else:
        print("Files not found for alignment.")
