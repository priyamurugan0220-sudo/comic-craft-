import { jsPDF } from 'jspdf';
import { ComicStory } from '../types';

/**
 * Loads an image from a URL and converts it to a base64 Data URL
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 500;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataURL);
      } catch (err) {
        console.warn('Canvas conversion failed:', err);
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = imageUrl;
  });
}

/**
 * Compiles comic panels into a multi-page PDF document
 */
export async function generateComicPdf(comic: ComicStory, onProgress?: (msg: string) => void): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  onProgress?.('Designing comic cover page...');

  // ================= COVER PAGE =================
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Comic Cover Border
  pdf.setDrawColor(245, 158, 11); // amber-500
  pdf.setLineWidth(3);
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.8);
  pdf.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Top header box
  pdf.setFillColor(239, 68, 68); // red-500
  pdf.rect(14, 14, 50, 14, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  pdf.text('SPECIAL ISSUE', 18, 23);

  // Main Logo
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(38);
  pdf.setTextColor(250, 204, 21); // yellow-400
  pdf.text('COMICCRAFT', pageWidth / 2, 70, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.text('AI-POWERED GRAPHIC NOVEL', pageWidth / 2, 80, { align: 'center' });

  // Comic Title Banner
  pdf.setFillColor(254, 240, 138); // yellow-200
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1.5);
  pdf.rect(margin, 105, contentWidth, 36, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(17, 24, 39);
  const titleLines = pdf.splitTextToSize(comic.metadata.story_prompt, contentWidth - 16);
  pdf.text(titleLines.slice(0, 2), pageWidth / 2, 118, { align: 'center' });

  // Story Attributes Block
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(245, 158, 11);
  pdf.text(`HERO: ${comic.metadata.character_name.toUpperCase()}`, pageWidth / 2, 165, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(226, 232, 240);
  pdf.text(`Setting: ${comic.metadata.setting}  •  Tone: ${comic.metadata.tone}`, pageWidth / 2, 175, { align: 'center' });
  pdf.text(`Visual Art Style: ${comic.metadata.art_style}`, pageWidth / 2, 183, { align: 'center' });

  // Cover Page Bottom Badge
  pdf.setFontSize(9);
  pdf.setTextColor(148, 163, 184);
  pdf.text('Powered by Google Gemini 3.8 & ComicCraft Engine', pageWidth / 2, 270, { align: 'center' });

  // ================= 5 PANEL PAGES =================
  for (let i = 0; i < comic.layout.length; i++) {
    const panel = comic.layout[i];
    onProgress?.(`Compiling Panel ${panel.panel_number} of ${comic.layout.length}...`);

    pdf.addPage();

    // Page Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header Bar
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, 16, 'F');
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.5);
    pdf.line(0, 16, pageWidth, 16);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text('COMICCRAFT PRESENTS', margin, 11);
    pdf.text(`PANEL ${panel.panel_number} OF ${comic.layout.length}`, pageWidth - margin, 11, { align: 'right' });

    let currentY = 24;

    // Panel Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(185, 28, 28); // red-700
    pdf.text(`PANEL ${panel.panel_number}: ${panel.title.toUpperCase()}`, margin, currentY);
    currentY += 8;

    // Artwork Illustration
    const imgHeight = 95;
    let imageDrawn = false;

    if (panel.image_url) {
      try {
        const base64 = await getBase64ImageFromUrl(panel.image_url);
        if (base64) {
          pdf.setDrawColor(0, 0, 0);
          pdf.setLineWidth(1.2);
          pdf.rect(margin - 0.5, currentY - 0.5, contentWidth + 1, imgHeight + 1);
          pdf.addImage(base64, 'JPEG', margin, currentY, contentWidth, imgHeight);
          imageDrawn = true;
        }
      } catch (err) {
        console.warn('Image embedding error:', err);
      }
    }

    if (!imageDrawn) {
      // Draw stylized comic placeholder
      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, currentY, contentWidth, imgHeight, 'F');
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1.5);
      pdf.rect(margin, currentY, contentWidth, imgHeight);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(250, 204, 21);
      pdf.text(`ILLUSTRATION: ${panel.title}`, pageWidth / 2, currentY + 45, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(203, 213, 225);
      pdf.text(panel.scene_description.slice(0, 80) + '...', pageWidth / 2, currentY + 55, { align: 'center' });
    }

    currentY += imgHeight + 8;

    // Yellow Comic Narrative Caption Box
    if (panel.caption) {
      pdf.setFillColor(254, 240, 138); // yellow-200
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(1);
      pdf.rect(margin, currentY, contentWidth, 10, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`CAPTION: ${panel.caption}`, margin + 4, currentY + 7);
      currentY += 15;
    }

    // Sound Effect badge
    if (panel.sound_effect) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(220, 38, 38);
      pdf.text(`* ${panel.sound_effect.toUpperCase()} *`, pageWidth / 2, currentY, { align: 'center' });
      currentY += 7;
    }

    // Scene Description / Narration
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10.5);
    pdf.setTextColor(30, 41, 59);
    const narrationLines = pdf.splitTextToSize(panel.narration || panel.scene_description, contentWidth);
    pdf.text(narrationLines, margin, currentY);
    currentY += narrationLines.length * 5.2 + 6;

    // Character Dialogue Bubble
    if (panel.dialogue) {
      pdf.setFillColor(224, 242, 254); // sky-100
      pdf.setDrawColor(2, 132, 199); // sky-600
      pdf.setLineWidth(0.8);
      const dialogueLines = pdf.splitTextToSize(panel.dialogue, contentWidth - 16);
      const bubbleHeight = dialogueLines.length * 5 + 8;
      pdf.roundedRect(margin, currentY, contentWidth, bubbleHeight, 3, 3, 'FD');

      pdf.setFont('helvetica', 'bolditalic');
      pdf.setFontSize(10);
      pdf.setTextColor(12, 74, 110);
      pdf.text(dialogueLines, margin + 8, currentY + 6);
    }

    // Page Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`ComicCraft • Issue #1 • Page ${i + 2}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  return pdf.output('blob');
}
