"""
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
    """Loads the homepage form where users submit comic details."""
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
    """
    Handles form submission:
    1. Generates 5-panel outline via Gemini Flash
    2. Expands narration/dialogue via Gemini Pro
    3. Generates illustrations
    4. Assembles layout and exports initial PDF
    5. Renders comic_preview.html
    """
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
    """
    API endpoint for JSON clients:
    Accepts PromptRequest, generates comic, and returns JSON structure + PDF path.
    """
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
    """Displays export confirmation after comic download."""
    return templates.TemplateResponse("export_success.html", {"request": request, "pdf_path": pdf_path})


@router.post("/test-image")
async def test_image_endpoint(payload: TestImageRequest):
    """Developer test endpoint to test single image generation."""
    try:
        img_path = generate_image(payload.prompt, panel_number=99, art_style=payload.art_style)
        return {"status": "success", "image_path": img_path, "prompt": payload.prompt, "art_style": payload.art_style}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image test error: {str(e)}")
