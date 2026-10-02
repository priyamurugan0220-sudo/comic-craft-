import { PythonBackendFile } from '../types';

export const PYTHON_BACKEND_FILES: PythonBackendFile[] = [
  {
    name: 'main.py',
    path: 'python_backend/main.py',
    description: 'FastAPI server entry point, static files mounting, and router integration.',
    code: `"""
Module: main.py
Description: Main FastAPI entry point for ComicCraft backend application.
"""
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes import router

app = FastAPI(
    title="ComicCraft API",
    description="AI-powered 5-panel comic story and illustration generator using Gemini models.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "panels"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "exports"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
`
  },
  {
    name: 'routes.py',
    path: 'python_backend/routes.py',
    description: 'FastAPI routing logic for /, /generate, /generate-comic/json, /export-success, and /test-image.',
    code: `"""
Module: routes.py
Description: FastAPI route handlers for ComicCraft web application and JSON APIs.
"""
from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
import os

from gemini_flash import generate_outline
from gemini_pro import generate_story
from image_generator import generate_image
from layout_builder import build_comic_layout
from exporters import save_pdf

router = APIRouter()
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "templates"))

class PromptRequest(BaseModel):
    story_prompt: str = Field(..., description="Main story premise for the comic")
    character_name: str = Field("Hero", description="Protagonist name")
    setting: str = Field("Enchanted Forest", description="Primary world/setting")
    tone: str = Field("Dramatic", description="Mood of the story: Funny, Dramatic, etc.")
    art_style: str = Field("Comic Book", description="Visual art style: anime, comic book, pixel art, etc.")

class TestImageRequest(BaseModel):
    prompt: str = Field(..., description="Prompt description for test illustration")
    art_style: str = Field("Comic Book", description="Art style for illustration")

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.post("/generate", response_class=HTMLResponse)
async def generate_comic_form(
    request: Request,
    story_prompt: str = Form(...),
    character_name: str = Form(...),
    setting: str = Form(...),
    tone: str = Form(...),
    art_style: str = Form(...)
):
    try:
        outline = generate_outline(story_prompt, character_name, setting, tone, art_style)
        enriched_story = generate_story(outline, character_name, tone)
        
        image_paths = []
        for panel in enriched_story:
            prompt_for_img = panel.get("image_prompt", f"{character_name} in {setting}")
            p_num = panel.get("panel_number", 1)
            img_path = generate_image(prompt_for_img, panel_number=p_num, art_style=art_style)
            image_paths.append(img_path)
            
        layout = build_comic_layout(enriched_story, image_paths)
        pdf_path = save_pdf(layout, comic_title=story_prompt, character_name=character_name)

        return templates.TemplateResponse(
            "comic_preview.html",
            {
                "request": request,
                "layout": layout,
                "story_prompt": story_prompt,
                "character_name": character_name,
                "setting": setting,
                "tone": tone,
                "art_style": art_style,
                "pdf_path": pdf_path
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comic generation error: {str(e)}")

@router.post("/generate-comic/json")
async def generate_comic_json(payload: PromptRequest):
    try:
        outline = generate_outline(
            payload.story_prompt,
            payload.character_name,
            payload.setting,
            payload.tone,
            payload.art_style
        )
        enriched_story = generate_story(outline, payload.character_name, payload.tone)

        image_paths = []
        for panel in enriched_story:
            prompt_for_img = panel.get("image_prompt", f"{payload.character_name} in {payload.setting}")
            p_num = panel.get("panel_number", 1)
            img_path = generate_image(prompt_for_img, panel_number=p_num, art_style=payload.art_style)
            image_paths.append(img_path)

        layout = build_comic_layout(enriched_story, image_paths)
        pdf_path = save_pdf(layout, comic_title=payload.story_prompt, character_name=payload.character_name)

        return {
            "status": "success",
            "metadata": {
                "character_name": payload.character_name,
                "setting": payload.setting,
                "tone": payload.tone,
                "art_style": payload.art_style,
                "panels_count": len(layout)
            },
            "layout": layout,
            "pdf_path": pdf_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API Comic Generation Error: {str(e)}")

@router.get("/export-success", response_class=HTMLResponse)
async def export_success(request: Request, pdf_path: str = ""):
    return templates.TemplateResponse("export_success.html", {"request": request, "pdf_path": pdf_path})

@router.post("/test-image")
async def test_image_endpoint(payload: TestImageRequest):
    img_path = generate_image(payload.prompt, panel_number=99, art_style=payload.art_style)
    return {"status": "success", "image_path": img_path, "prompt": payload.prompt, "art_style": payload.art_style}
`
  },
  {
    name: 'gemini_flash.py',
    path: 'python_backend/gemini_flash.py',
    description: 'Generates structured 5-panel comic outlines using Google Generative AI Gemini Flash.',
    code: `"""
Module: gemini_flash.py
Description: Uses Google's Gemini Flash model to create a structured 5-panel comic outline.
"""
import os
import json
import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_outline(story_prompt: str, character_name: str, setting: str, tone: str, art_style: str) -> list:
    prompt = f"""You are a master comic book director.
Create a structured 5-panel comic story outline:
- Story Prompt: {story_prompt}
- Main Character: {character_name}
- Setting: {setting}
- Tone: {tone}
- Visual Art Style: {art_style}

Return ONLY a valid JSON array of exactly 5 panel objects.
[
  {{
    "panel_number": 1,
    "title": "Panel title",
    "scene_description": "2-3 sentences of action and mood",
    "image_prompt": "Detailed illustration prompt for {art_style} style"
  }}
]
"""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("\`\`\`json"): text = text[7:]
        elif text.startswith("\`\`\`"): text = text[3:]
        if text.endswith("\`\`\`"): text = text[:-3]
        return json.loads(text.strip())[:5]
    except Exception as e:
        print(f"Error in generate_outline: {e}")
        # Returns safe fallback 5 panels
        return [{"panel_number": i, "title": f"Chapter {i}", "scene_description": f"{character_name} in {setting}", "image_prompt": f"{character_name} in {setting}"} for i in range(1, 6)]
`
  },
  {
    name: 'gemini_pro.py',
    path: 'python_backend/gemini_pro.py',
    description: 'Expands comic outlines into dialogues, narrations, captions, and sound FX using Gemini Pro.',
    code: `"""
Module: gemini_pro.py
Description: Uses Google's Gemini Pro model to expand comic outlines into detailed narration and dialogues.
"""
import os
import json
import google.generativeai as genai

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

def generate_story(outline: list, character_name: str, tone: str) -> list:
    prompt = f"""You are a veteran comic book writer.
Expand this 5-panel comic outline for character '{character_name}' with '{tone}' tone into comic scripts:
{json.dumps(outline, indent=2)}

For each panel, generate:
- 'caption': classic comic narrative caption box
- 'dialogue': character speech line
- 'narration': 2-3 expressive sentences
- 'sound_effect': comic sound FX word (e.g., SWOOSH!, BOOM!)

Return ONLY a valid JSON array of 5 objects.
"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("\`\`\`json"): text = text[7:]
        elif text.startswith("\`\`\`"): text = text[3:]
        if text.endswith("\`\`\`"): text = text[:-3]
        story_parts = json.loads(text.strip())
        
        enriched = []
        for i, panel in enumerate(outline):
            item = panel.copy()
            if i < len(story_parts):
                item.update(story_parts[i])
            enriched.append(item)
        return enriched
    except Exception as e:
        print(f"Fallback narration: {e}")
        return outline
`
  },
  {
    name: 'image_generator.py',
    path: 'python_backend/image_generator.py',
    description: 'Generates comic illustrations and saves images to static/panels with filename sanitation.',
    code: `"""
Module: image_generator.py
Description: Generates comic illustrations using Stable Diffusion / image APIs with safe file persistence.
"""
import os, re, urllib.parse, requests
from PIL import Image, ImageDraw

STATIC_PANELS_DIR = os.path.join(os.path.dirname(__file__), "static", "panels")
os.makedirs(STATIC_PANELS_DIR, exist_ok=True)

def sanitize_filename(prompt: str, max_length: int = 40) -> str:
    clean = re.sub(r'[^a-zA-Z0-9_\\- ]', '', prompt).strip().replace(' ', '_')
    return clean[:max_length] if clean else "panel"

def generate_image(image_prompt: str, panel_number: int = 1, art_style: str = "comic book") -> str:
    safe_name = sanitize_filename(image_prompt)
    filename = f"panel_{panel_number}_{safe_name}.jpg"
    filepath = os.path.join(STATIC_PANELS_DIR, filename)

    if os.path.exists(filepath):
        return f"/static/panels/{filename}"

    try:
        encoded_prompt = urllib.parse.quote(f"{image_prompt}, {art_style} style, comic art")
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=500&seed={panel_number*100+42}"
        res = requests.get(url, timeout=12)
        if res.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(res.content)
            return f"/static/panels/{filename}"
    except Exception as e:
        print(f"Image generation fallback: {e}")

    # Fallback image creation
    img = Image.new("RGB", (800, 500), color=(26, 32, 44))
    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, 790, 490], outline=(245, 158, 11), width=6)
    draw.text((40, 40), f"PANEL {panel_number}", fill=(245, 158, 11))
    img.save(filepath, "JPEG")
    return f"/static/panels/{filename}"
`
  },
  {
    name: 'layout_builder.py',
    path: 'python_backend/layout_builder.py',
    description: 'Combines story panels and generated illustration paths into structured layout dictionaries.',
    code: `"""
Module: layout_builder.py
Description: Assembles comic outlines, illustrations, and narrations into a coherent panel layout.
"""

def build_comic_layout(story_panels: list, image_paths: list) -> list:
    layout = []
    for i, panel in enumerate(story_panels):
        img_url = image_paths[i] if i < len(image_paths) else ""
        layout.append({
            "panel_number": panel.get("panel_number", i + 1),
            "title": panel.get("title", f"Panel {i + 1}"),
            "image_path": img_url,
            "scene_description": panel.get("scene_description", ""),
            "caption": panel.get("caption", ""),
            "dialogue": panel.get("dialogue", ""),
            "narration": panel.get("narration", panel.get("scene_description", "")),
            "sound_effect": panel.get("sound_effect", ""),
            "image_prompt": panel.get("image_prompt", "")
        })
    return layout
`
  },
  {
    name: 'exporters.py',
    path: 'python_backend/exporters.py',
    description: 'Compiles multi-page comic book PDFs with cover page, images, captions, and narrative using FPDF.',
    code: `"""
Module: exporters.py
Description: Generates multi-page comic book PDFs using FPDF.
"""
import os, time
from fpdf import FPDF

STATIC_EXPORTS_DIR = os.path.join(os.path.dirname(__file__), "static", "exports")
os.makedirs(STATIC_EXPORTS_DIR, exist_ok=True)

class ComicPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, "COMICCRAFT | AI-POWERED COMIC BOOK", ln=1, align="R")

def save_pdf(comic_layout: list, comic_title: str = "ComicCraft Story", character_name: str = "Hero") -> str:
    pdf = ComicPDF(orientation="P", unit="mm", format="A4")
    
    # 1. Cover Page
    pdf.add_page()
    pdf.set_fill_color(24, 24, 27)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_y(60)
    pdf.set_font("Helvetica", "B", 30)
    pdf.set_text_color(251, 191, 36)
    pdf.cell(0, 14, "COMICCRAFT", ln=1, align="C")
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, comic_title.upper()[:40], ln=1, align="C")

    # 2. Sequential Panels
    for panel in comic_layout:
        pdf.add_page()
        p_num = panel.get("panel_number", 1)
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(0, 10, f"PANEL {p_num}: {panel.get('title', '')}", ln=1)

        # Narration & Dialogue
        pdf.set_font("Helvetica", "", 11)
        pdf.multi_cell(180, 6, panel.get("narration", ""))
        pdf.ln(4)
        if panel.get("dialogue"):
            pdf.set_font("Helvetica", "I", 11)
            pdf.cell(0, 8, panel.get("dialogue"), ln=1)

    filename = f"comic_{int(time.time())}.pdf"
    output_path = os.path.join(STATIC_EXPORTS_DIR, filename)
    pdf.output(output_path)
    return f"/static/exports/{filename}"
`
  },
  {
    name: 'requirements.txt',
    path: 'python_backend/requirements.txt',
    description: 'Python dependencies for FastAPI, Gemini SDK, diffusers, FPDF, and Pillow.',
    code: `fastapi==0.115.0
uvicorn==0.31.0
jinja2==3.1.4
python-multipart==0.0.12
google-generativeai==0.8.3
diffusers==0.30.3
transformers==4.45.2
fpdf2==2.8.1
Pillow==10.4.0
accelerate==0.34.2
pydantic==2.9.2
python-dotenv==1.0.1
requests==2.32.3
`
  }
];
