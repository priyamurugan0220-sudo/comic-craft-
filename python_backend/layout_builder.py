"""
Module: layout_builder.py
Description: Assembles comic outlines, illustrations, and narrations into a coherent panel layout.
"""


def build_comic_layout(story_panels: list, image_paths: list) -> list:
    """
    Combines story panels with their generated illustration paths.
    Returns structured layout objects ready for rendering or PDF export.
    """
    layout = []
    for i, panel in enumerate(story_panels):
        img_url = image_paths[i] if i < len(image_paths) else ""
        layout_item = {
            "panel_number": panel.get("panel_number", i + 1),
            "title": panel.get("title", f"Panel {i + 1}"),
            "image_path": img_url,
            "scene_description": panel.get("scene_description", ""),
            "caption": panel.get("caption", ""),
            "dialogue": panel.get("dialogue", ""),
            "narration": panel.get("narration", panel.get("scene_description", "")),
            "sound_effect": panel.get("sound_effect", ""),
            "image_prompt": panel.get("image_prompt", "")
        }
        layout.append(layout_item)
    return layout
