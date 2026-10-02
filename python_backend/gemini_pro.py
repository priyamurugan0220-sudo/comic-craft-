"""
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
    """
    Expands each panel outline into dialogue, narration, sound effects, and comic captions.
    Returns the enriched panels with full story content.
    """
    prompt = f"""You are a veteran comic book writer known for impactful narration and punchy character dialogues.
Expand the following 5-panel comic outline for character '{character_name}' with a '{tone}' tone into rich comic scripts.

Outline:
{json.dumps(outline, indent=2)}

For each panel (1 through 5), write:
1. 'caption': A classic comic box caption (e.g., "MEANWHILE IN THE FOREST DEPTHS...", "DEEP INTO THE UNKNOWN...")
2. 'dialogue': Spoken line by {character_name} or an interactive speech bubble.
3. 'narration': 2-3 expressive sentences of storytelling prose detailing character emotions, sensory details, and momentum.
4. 'sound_effect': A comic sound effect (e.g., "SWOOSH!", "CRACKLE!", "BZZZT!", "THUD!")

Return ONLY a valid JSON array of 5 objects containing:
[
  {{
    "panel_number": 1,
    "caption": "...",
    "dialogue": "...",
    "narration": "...",
    "sound_effect": "..."
  }},
  ...
]
"""
    try:
        model = genai.GenerativeModel("models/gemini-1.5-pro" if "1.5" in os.getenv("GEMINI_MODEL", "") else "gemini-1.5-pro")
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        story_parts = json.loads(text)
        
        # Merge story parts into the outline
        enriched = []
        for i, panel in enumerate(outline):
            item = panel.copy()
            if i < len(story_parts):
                sp = story_parts[i]
                item["caption"] = sp.get("caption", "IN THE HEART OF THE REALM...")
                item["dialogue"] = sp.get("dialogue", f"\"{character_name}: 'We must press on!'\"")
                item["narration"] = sp.get("narration", panel.get("scene_description", ""))
                item["sound_effect"] = sp.get("sound_effect", "SWOOSH!")
            else:
                item["caption"] = "IN THE HEAT OF THE MOMENT..."
                item["dialogue"] = f"\"{character_name}: 'No turning back now.'\""
                item["narration"] = panel.get("scene_description", "")
                item["sound_effect"] = "BOOM!"
            enriched.append(item)
        return enriched
    except Exception as e:
        print(f"Error in generate_story: {e}. Applying fallback narration.")

    # Fallback enrichment
    enriched = []
    default_captions = [
        "AT FIRST LIGHT...",
        "DEEPER INTO THE UNKNOWN...",
        "WITHOUT WARNING...",
        "THE MOMENT OF TRUTH...",
        "WHEN THE DUST SETTLED..."
    ]
    default_sfx = ["RUMBLE!", "FLASH!", "CRACKLE!", "KABOOM!", "CHIRP..."]
    for i, panel in enumerate(outline):
        item = panel.copy()
        item["caption"] = default_captions[i % len(default_captions)]
        item["dialogue"] = f"{character_name}: 'Every step brings us closer to the truth.'"
        item["narration"] = panel.get("scene_description", f"{character_name} moves forward with determination.")
        item["sound_effect"] = default_sfx[i % len(default_sfx)]
        enriched.append(item)
    return enriched
