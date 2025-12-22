
import os
import sys
import re

QURAN_DETECTOR_PATH = os.path.abspath("Quran_Detector")
sys.path.append(QURAN_DETECTOR_PATH)

from QuranDetectorAnnotater import qMatcherAnnotater

def test():
    original_cwd = os.getcwd()
    os.chdir(QURAN_DETECTOR_PATH)
    try:
        matcher = qMatcherAnnotater()
    finally:
        os.chdir(original_cwd)

    # Transcript segment from Shaykh Murad
    text = "And then Allah says in the Quran, 'Inna rabbakumullahul ladhi khalaqas samawati wal ard', surely your Lord is God."
    
    print("Processing transcript segment...")
    results, errs = matcher.matchVersesInText(text, matcher.all)
    print("Found:", results.keys())

if __name__ == "__main__":
    test()
