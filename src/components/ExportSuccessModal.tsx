import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, ArrowRight, Sparkles, FileText, Share2 } from 'lucide-react';
import { ComicStory } from '../types';

interface ExportSuccessModalProps {
  comic: ComicStory;
  pdfBlobUrl: string | null;
  onNewComic: () => void;
  onBackToPreview: () => void;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  comic,
  pdfBlobUrl,
  onNewComic,
  onBackToPreview,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#ef4444', '#3b82f6', '#10b981', '#a855f7'],
      });
    } catch (e) {
      // Ignored if canvas-confetti is not loaded
    }
  }, []);

  const filename = `ComicCraft_${comic.metadata.character_name.replace(/\s+/g, '_')}.pdf`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_#000] p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Background Comic Halftone */}
        <div className="comic-halftone absolute inset-0 opacity-10 pointer-events-none" />

        {/* Success Icon Badge */}
        <div className="w-20 h-20 bg-emerald-400 border-4 border-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-[4px_4px_0px_#000] transform -rotate-6 mb-6">
          <CheckCircle2 className="w-12 h-12 text-slate-950 stroke-[2.5]" />
        </div>

        {/* Title & Description */}
        <h1 className="font-bangers text-4xl sm:text-5xl text-slate-950 tracking-wider mb-2">
          BOOM! EXPORT SUCCESSFUL!
        </h1>
        <p className="text-slate-600 font-comic text-base sm:text-lg mb-6 leading-relaxed">
          Your personalized 5-panel comic story has been compiled into a high-resolution, multi-page graphic novel ready for printing, reading, and offline sharing!
        </p>

        {/* File Details Pill */}
        <div className="bg-amber-100 border-2 border-dashed border-slate-900 rounded-xl p-4 mb-8 text-left">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-slate-900 truncate">
                {filename}
              </p>
              <p className="text-xs text-slate-600 font-comic">
                5 Illustrated Panels • Cover Issue • Format A4 Print-Ready
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3">
          {pdfBlobUrl && (
            <a
              href={pdfBlobUrl}
              download={filename}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bangers text-2xl tracking-wider border-3 border-slate-900 rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-6 h-6 stroke-[2.5]" />
              <span>SAVE / RE-DOWNLOAD PDF</span>
            </a>
          )}

          <button
            onClick={onNewComic}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bangers text-2xl tracking-wider border-3 border-slate-900 rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
            <span>GO CREATE ANOTHER COMIC!</span>
          </button>

          <button
            onClick={onBackToPreview}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-comic font-bold text-sm border-2 border-slate-900 rounded-xl transition-colors"
          >
            ← Return to Comic Preview Reader
          </button>
        </div>
      </div>
    </div>
  );
};
