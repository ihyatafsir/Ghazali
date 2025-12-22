import os
import shutil

# Correct source based on my mistake: Documents/data/raw
source_dir = "/home/absolut7/Documents/data/raw"
target_dir = "/home/absolut7/Documents/ghazali/data/raw"

if os.path.exists(source_dir):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    print(f"Moving files from {source_dir} to {target_dir}...")
    for filename in os.listdir(source_dir):
        shutil.move(os.path.join(source_dir, filename), os.path.join(target_dir, filename))
    print("Done.")
    # cleanup old dir if empty
    try:
        os.rmdir(source_dir)
        os.rmdir(os.path.dirname(source_dir))
    except:
        pass
else:
    print(f"Source dir {source_dir} not found. Checking current dir...")
    print(os.listdir("."))
