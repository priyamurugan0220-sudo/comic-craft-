"""
Module: gemini_flash.py
Description: Uses Google's Gemini Flash model to create a structured 5-panel comic outline.
"""
import os
import json
import re
import google.generativeai as genai

# Configure Google Generative AI
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)


def generate_outline(story_prompt: str, character_name: str, setting: str, tone: str, art_style: str) -> list:
    """
    Generates a structured 5-panel comic outline based on user inputs.
    Returns a list of 5 dictionaries containing panel_number, title, scene_description, and image_prompt.
    """
    prompt = f"""You are a master comic book director and scriptwriter.
Create a structured 5-panel comic story outline based on the following details:
- Story Prompt: {story_prompt}
- Main Character: {character_name}
- Setting: {setting}
- Tone: {tone}
- Visual Art Style: {art_style}

Return ONLY a valid JSON array of exactly 5 panel objects.
No markdown codeblocks, no explanations before or after.
Each object in the array must strictly match this format:
[
  {{
    "panel_number": 1,
    "title": "Short punchy panel title",
    "scene_description": "2-3 sentences describing the character action, environment, and mood.",
    "image_prompt": "High-detail prompt for comic illustration in {art_style} style, featuring {character_name} in {setting}, {tone} atmosphere."
  }},
  ...
]
"""
    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash" if "1.5" in os.getenv("GEMINI_MODEL", "") else "gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean potential markdown wrapping
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        panels = json.loads(text)
        if isinstance(panels, list) and len(panels) >= 5:
            return panels[:5]
        elif isinstance(panels, dict) and "panels" in panels:
            return panels["panels"][:5]
    except Exception as e:
        print(f"Error in generate_outline: {e}. Using fallback generator.")

    # Robust fallback in case of API failure or missing keys
    return [
        {
            "panel_number": 1,
            "title": f"The Journey Begins: {character_name} in {setting}",
            "scene_description": f"{character_name} stands amidst the vast landscape of {setting}, bracing for the unforeseen adventure ahead with a {tone} spirit.",
            "image_prompt": f"Comic book panel illustration, {art_style} art style. {character_name} standing resolutely in {setting}, dramatic lighting, {tone} tone, high quality."
        },
        {
            "panel_number": 2,
            "title": "A Mysterious Discovery",
            "scene_description": f"While traversing {setting}, {character_name} spots an ancient artifact pulsating with enigmatic energy.",
            "image_prompt": f"Comic book panel illustration, {art_style} art style. Close-up on {character_name} discovering a glowing artifact in {setting}, vibrant colors, dynamic angle."
        },
        {
            "panel_number": 3,
            "title": "The Rising Conflict",
            "scene_description": f"Suddenly, shadows lengthen and a sudden obstacle challenges {character_name}'s resolve, testing their courage.",
            "image_prompt": f"Comic book panel illustration, {art_style} art style. Intense action scene featuring {character_name} confronting a shadowy challenge in {setting}."
        },
        {
            "panel_number": 4,
            "title": "The Turning Point",
            "scene_description": f"Summoning all their inner strength, {character_name} executes a bold maneuver to overcome the climax.",
            "image_prompt": f"Comic book panel illustration, {art_style} art style. Heroic climax of {character_name} unleashing power in {setting}, {tone} atmosphere, comic action burst."
        },
        {
            "panel_number": 5,
            "title": "A New Dawn",
            "scene_description": f"With peace restored, {character_name} looks outward toward the horizon, wiser and ready for what comes next.",
            "image_prompt": f"Comic book panel illustration, {art_style} art style. {character_name} looking peacefully into a glorious sunrise in {setting}, cinematic comic outro."
        }
    ]
