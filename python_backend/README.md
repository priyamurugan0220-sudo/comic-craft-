# ComicCraft - AI-Powered Comic Story Creator

ComicCraft is a generative AI web application that automatically transforms story premises into complete 5-panel comic strips with illustrations, dialogues, scene narration, sound effects, and exportable PDFs.

---

## 🚀 VS Code Setup & Local Execution Guide

### Prerequisites
- Python 3.9, 3.10, or 3.11
- Visual Studio Code (VS Code) with Python extension installed
- A Google Gemini API Key (from Google AI Studio)

---

### Step 1: Open Project in VS Code
1. Open VS Code.
2. Click **File > Open Folder...** and select the `python_backend` folder (or project root).
3. Open the integrated terminal (`Ctrl + ~` or `Cmd + ~`).

---

### Step 2: Create and Activate Virtual Environment
**On Windows (PowerShell/CMD):**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Required Dependencies
Run:
```bash
pip install -r requirements.txt
```

---

### Step 4: Configure Environment Variables
Create a file named `.env` in the `python_backend` directory:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=8000
```

---

### Step 5: Start the FastAPI Server
Run with Uvicorn auto-reload:
```bash
uvicorn main:app --reload --port 8000
```

Once started, access:
- **Web App**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Testing the APIs

### 1. Test JSON Comic Generation (`POST /generate-comic/json`)
```bash
curl -X POST "http://127.0.0.1:8000/generate-comic/json" \
  -H "Content-Type: application/json" \
  -d '{
    "story_prompt": "A courageous young alchemist discovers a whispering crystal in an abandoned underground laboratory.",
    "character_name": "Elian",
    "setting": "Ancient Ruins",
    "tone": "Dramatic",
    "art_style": "Comic Book"
  }'
```

### 2. Test Single Illustration Generation (`POST /test-image`)
```bash
curl -X POST "http://127.0.0.1:8000/test-image" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Rusty the brave fox standing heroically on an emerald mossy boulder in a magical forest",
    "art_style": "Anime"
  }'
```

---

## 📁 Technical Architecture
- `main.py`: Application bootstrap, static directory mounting, CORS configuration.
- `routes.py`: Endpoints for `/`, `/generate`, `/generate-comic/json`, `/test-image`, and `/export-success`.
- `gemini_flash.py`: Fast structured 5-panel storyline outline via Gemini Flash.
- `gemini_pro.py`: Rich dialogue, caption, sound effects, and narration expansion.
- `image_generator.py`: Generates comic art panels using AI models with safe filename hashing.
- `layout_builder.py`: Maps story narration and image panels into a unified comic layout.
- `exporters.py`: Compiles multi-page PDF comic books using FPDF.
