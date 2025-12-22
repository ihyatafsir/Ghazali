
import os
import sys

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

    # Some text that might cause duplicates or overlap
    # Al-A'raf 7:54 and Yunus 10:3 share some words? 
    # "ثم استوى على العرش" is in 7:54 and 10:3 (and others)
    text = "إن ربكم الله الذي خلق السماوات والأرض في ستة أيام ثم استوى على العرش يغشي الليل النهار يطلبه حثيثا"
    
    print("Processing text...")
    results, errs = matcher.matchVersesInText(text, matcher.all)
    print("Results:", results.keys())

if __name__ == "__main__":
    test()
