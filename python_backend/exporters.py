"""
Module: exporters.py
Description: Generates multi-page comic book PDFs using FPDF.
"""
import os
import time
from fpdf import FPDF

STATIC_EXPORTS_DIR = os.path.join(os.path.dirname(__file__), "static", "exports")
os.makedirs(STATIC_EXPORTS_DIR, exist_ok=True)


class ComicPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, "COMICCRAFT | AI-POWERED COMIC BOOK", ln=1, align="R")
        self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")


def save_pdf(comic_layout: list, comic_title: str = "ComicCraft Story", character_name: str = "Hero") -> str:
    """
    Compiles comic panels, illustrations, and narration into a PDF document.
    Returns the file path to the generated PDF.
    """
    pdf = ComicPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)

    # 1. Cover Page
    pdf.add_page()
    pdf.set_fill_color(24, 24, 27)
    pdf.rect(0, 0, 210, 297, "F")

    pdf.set_y(60)
    pdf.set_font("Helvetica", "B", 30)
    pdf.set_text_color(251, 191, 36) # Amber gold
    pdf.cell(0, 14, "COMICCRAFT", ln=1, align="C")

    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, comic_title.upper()[:40], ln=1, align="C")

    pdf.set_font("Helvetica", "I", 12)
    pdf.set_text_color(203, 213, 225)
    pdf.ln(10)
    pdf.cell(0, 8, f"Starring: {character_name}", ln=1, align="C")
    pdf.cell(0, 8, f"Generated with Gemini AI & ComicCraft Engine", ln=1, align="C")

    # 2. Sequential Panels
    for panel in comic_layout:
        pdf.add_page()
        panel_num = panel.get("panel_number", 1)
        title = panel.get("title", f"Panel {panel_num}")
        caption = panel.get("caption", "")
        narration = panel.get("narration", "")
        dialogue = panel.get("dialogue", "")
        sound_effect = panel.get("sound_effect", "")
        img_path = panel.get("image_path", "")

        # Panel Title Header
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(0, 10, f"PANEL {panel_num}: {title}", ln=1, align="L")
        pdf.ln(2)

        # Image if exists
        # In python_backend, img_path might be relative like /static/panels/xyz
        actual_img_path = img_path
        if img_path.startswith("/"):
            actual_img_path = os.path.join(os.path.dirname(__file__), img_path.lstrip("/"))
        
        if os.path.exists(actual_img_path):
            try:
                pdf.image(actual_img_path, x=15, y=pdf.get_y(), w=180, h=105)
                pdf.ln(110)
            except Exception as e:
                print(f"Failed to embed image {actual_img_path}: {e}")
                pdf.ln(10)
        else:
            pdf.ln(10)

        # Caption Box (Yellow comic style)
        if caption:
            pdf.set_fill_color(254, 240, 138)
            pdf.set_text_color(15, 23, 42)
            pdf.set_font("Helvetica", "B", 11)
            pdf.cell(180, 8, f"  CAPTION: {caption}", ln=1, fill=True)
            pdf.ln(3)

        # Sound Effect if present
        if sound_effect:
            pdf.set_font("Helvetica", "B", 14)
            pdf.set_text_color(220, 38, 38)
            pdf.cell(0, 8, f"** {sound_effect} **", ln=1, align="C")
            pdf.ln(2)

        # Narration
        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(180, 6, narration)
        pdf.ln(4)

        # Dialogue
        if dialogue:
            pdf.set_fill_color(241, 245, 249)
            pdf.set_text_color(15, 23, 42)
            pdf.set_font("Helvetica", "I", 11)
            pdf.multi_cell(180, 7, f"Dialogue: {dialogue}", fill=True)

    timestamp = int(time.time())
    filename = f"comic_{timestamp}.pdf"
    output_path = os.path.join(STATIC_EXPORTS_DIR, filename)
    pdf.output(output_path)
    return f"/static/exports/{filename}"
