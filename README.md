# Ihya 'Ulum al-Din - Tafsir Explorer

A modern web application for exploring Al-Ghazali's *Ihya 'Ulum al-Din* (Revival of Religious Sciences) with integrated Quranic commentary and dictionary features.

## 🌟 Features

- **Bilingual Reader**: Side-by-side Arabic-English text with translations
- **Ihya as Tafsir**: Browse Al-Ghazali's commentary organized by Quranic verses
- **Smart Dictionary**: Lisan al-Arab integration with Arabic word lookup
- **Quran Index**: 2,816+ automatically detected Quranic citations with context
- **Deep Linking**: Navigate directly to specific lines and verses
- **English Translations**: Abdel Haleem Quran translation integrated

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for web app)
- Python 3.12+ (for data processing)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ihyatafsir/Ghazali.git
   cd Ghazali
   ```

2. **Install web dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Python Setup (for data processing)

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r Quran_Detector/requirements.txt
pip install webvtt-py
```

## 📁 Project Structure

```
.
├── data/
│   ├── processed/          # Cleaned Arabic text files
│   ├── translations/       # English translation JSONs
│   ├── lectures/          # Lecture transcripts (VTT)
│   └── lectures_index.json
├── scripts/
│   ├── process_quran.py   # Generate Quran index
│   ├── process_transcripts.py  # Align transcripts
│   └── ai_translate.py    # Translation helper (placeholder)
├── web/
│   ├── app/               # Next.js app router
│   ├── components/        # React components
│   └── public/            # Static assets
├── Quran_Detector/        # Quranic citation detection library
└── README.md
```

## 🛠️ Development

### Processing Data

**Generate Quran Index:**
```bash
python3 scripts/process_quran.py
```

**Process Lecture Transcripts:**
```bash
python3 scripts/process_transcripts.py
```

### Building for Production

```bash
cd web
npm run build
npm start
```

## 📊 Data Sources

- **Arabic Text**: Scraped from Ghazali.org
- **Quranic Detection**: [Quran Detector](https://github.com/qcri/Quran-Detector) library
- **Dictionary**: Lisan al-Arab (preprocessed JSON)
- **Quran Translation**: Abdel Haleem (fawazahmed0/quran-api)

## 🔧 Key Technologies

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Processing**: Python 3.12, webvtt-py
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📝 Current Status

### Completed
- ✅ Full Ihya text digitization (40 books)
- ✅ Quran index with 2,816 citations
- ✅ Bilingual reader for Book of Knowledge
- ✅ Dictionary overlay with Lisan al-Arab
- ✅ Tafsir navigator with English verse translations
- ✅ Global search and cross-referencing

### In Progress
- 🔄 Lecture transcript alignment for Books 2-5
- 🔄 AI-assisted translation pipeline
- 🔄 Synchronized scrolling
- 🔄 Audio lecture integration

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Adding more lecture transcripts
- Improving Arabic-English alignment
- Enhancing UI/UX
- Adding more books' translations

## 📄 License

This project contains multiple components with different licenses:
- Quran Detector: Apache 2.0 (see `Quran_Detector/LICENSE`)
- Web Application: [Your chosen license]

## 🙏 Acknowledgments

- Imam Al-Ghazali for the timeless *Ihya 'Ulum al-Din*
- Shaykh Abdal Hakim Murad for lecture translations
- QCRI for the Quran Detector library
- Fawaz Ahmed for the Quran API

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Note**: This is a community project for educational purposes. Please verify all religious content with qualified scholars.
