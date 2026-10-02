"""
Module: image_generator.py
Description: Generates comic illustrations using Stable Diffusion or image API with safe file persistence.
"""
import os
import re
import urllib.parse
import requests
from PIL import Image, ImageDraw, ImageFont

STATIC_PANELS_DIR = os.path.join(os.path.dirname(__file__), "static", "panels")
os.makedirs(STATIC_PANELS_DIR, exist_ok=True)


def sanitize_filename(prompt: str, max_length: int = 40) -> str:
    """Sanitizes prompt text to create safe file names."""
    clean = re.sub(r'[^a-zA-Z0-9_\- ]', '', prompt).strip().replace(' ', '_')
    return clean[:max_length] if clean else "panel"


def generate_image(image_prompt: str, panel_number: int = 1, art_style: str = "comic book") -> str:
    """
    Generates a comic illustration for the given prompt.
    Saves image into static/panels and returns the relative URL/path.
    """
    safe_name = sanitize_filename(image_prompt)
    filename = f"panel_{panel_number}_{safe_name}.jpg"
    filepath = os.path.join(STATIC_PANELS_DIR, filename)

    # If already generated, return existing path
    if os.path.exists(filepath):
        return f"/static/panels/{filename}"

    # Style enhancers
    style_keywords = {
        "comic book": "classic vintage comic book, bold line art, halftone dots, vibrant colors, Marvel DC aesthetic",
        "anime": "Japanese manga anime style, high contrast, cel shaded, dynamic angle, Makoto Shinkai lighting",
        "pixel art": "16-bit pixel art, detailed retro game sprite aesthetic, isometric comic composition",
        "realistic": "cinematic graphic novel illustration, realistic lighting, octane render, dramatic shadows",
        "dark noir": "film noir graphic novel, Frank Miller style, heavy black inks, stark contrast, rain"
    }
    enhanced_prompt = f"{image_prompt}, {style_keywords.get(art_style.lower(), 'comic book illustration')}, 8k resolution, masterpiece"

    # Attempt fetching from Pollinations AI (free, no-key Stable Diffusion endpoint)
    try:
        encoded_prompt = urllib.parse.quote(enhanced_prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=500&nologo=true&seed={panel_number * 100 + 42}"
        response = requests.get(url, timeout=12)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return f"/static/panels/{filename}"
    except Exception as e:
        print(f"Online image generation failed for panel {panel_number}: {e}. Creating local fallback graphic.")

    # Local fallback using Pillow
    img = Image.new("RGB", (800, 500), color=(26, 32, 44))
    draw = ImageDraw.Draw(img)
    
    # Draw comic border and background accents
    draw.rectangle([10, 10, 790, 490], outline=(245, 158, 11), width=6)
    draw.rectangle([20, 20, 780, 480], outline=(255, 255, 255), width=2)
    
    # Text placeholder
    draw.text((40, 40), f"PANEL {panel_number}", fill=(245, 158, 11))
    draw.text((40, 80), f"Style: {art_style.title()}", fill=(203, 213, 225))
    draw.text((40, 120), f"Prompt: {image_prompt[:120]}...", fill=(255, 255, 255))
    
    img.save(filepath, "JPEG")
    return f"/static/panels/{filename}"
