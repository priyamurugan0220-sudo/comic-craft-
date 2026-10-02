import React, { useState } from 'react';
import {
  Download,
  Share2,
  RefreshCw,
  PlusCircle,
  Eye,
  FileText,
  Volume2,
  Grid,
  Columns,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { ComicStory, ComicPanel } from '../types';

interface ComicPreviewProps {
  comic: ComicStory;
  onDownloadPdf: () => void;
  onNewStory: () => void;
  onUpdatePanel?: (panelNumber: number, updated: Partial<ComicPanel>) => void;
  isDownloadingPdf?: boolean;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  comic,
  onDownloadPdf,
  onNewStory,
  onUpdatePanel,
  isDownloadingPdf,
}) => {
  const [layoutMode, setLayoutMode] = useState<'strip' | 'grid'>('strip');
  const [expandedPrompts, setExpandedPrompts] = useState<Record<number, boolean>>({});
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null);
  const [editDialogue, setEditDialogue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const togglePrompt = (panelNum: number) => {
    setExpandedPrompts((prev) => ({
      ...prev,
      [panelNum]: !prev[panelNum],
    }));
  };

  const startEditDialogue = (panel: ComicPanel) => {
    setEditingPanelId(panel.panel_number);
    setEditDialogue(panel.dialogue);
  };

  const saveEditDialogue = (panelNumber: number) => {
    if (onUpdatePanel) {
      onUpdatePanel(panelNumber, { dialogue: editDialogue });
    }
    setEditingPanelId(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header & Metadata Banner */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#000] p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white font-black text-xs uppercase px-2.5 py-0.5 rounded border border-slate-900">
                Official Release
              </span>
              <span className="text-xs font-bold text-slate-500 font-comic">
                5 Complete Panels
              </span>
            </div>
            <h1 className="font-bangers text-3xl sm:text-5xl text-slate-950 tracking-wide">
              {comic.metadata.story_prompt.slice(0, 65)}
              {comic.metadata.story_prompt.length > 65 ? '...' : ''}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3 font-comic text-xs sm:text-sm">
              <span className="bg-amber-100 border-2 border-slate-900 px-2.5 py-1 rounded-md font-bold text-slate-900">
                Hero: {comic.metadata.character_name}
              </span>
              <span className="bg-blue-100 border-2 border-slate-900 px-2.5 py-1 rounded-md font-bold text-slate-900">
                Setting: {comic.metadata.setting}
              </span>
              <span className="bg-purple-100 border-2 border-slate-900 px-2.5 py-1 rounded-md font-bold text-slate-900">
                Tone: {comic.metadata.tone}
              </span>
              <span className="bg-emerald-100 border-2 border-slate-900 px-2.5 py-1 rounded-md font-bold text-slate-900">
                Art Style: {comic.metadata.art_style}
              </span>
            </div>
          </div>

          {/* Action Buttons & Layout Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg border-2 border-slate-900">
              <button
                onClick={() => setLayoutMode('strip')}
                className={`p-1.5 rounded flex items-center gap-1 text-xs font-bold ${
                  layoutMode === 'strip'
                    ? 'bg-amber-400 text-slate-950 shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Single Column Strip"
              >
                <Columns className="w-4 h-4" />
                <span className="hidden sm:inline">Strip</span>
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded flex items-center gap-1 text-xs font-bold ${
                  layoutMode === 'grid'
                    ? 'bg-amber-400 text-slate-950 shadow-[1px_1px_0px_#000]'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                title="Comic Grid View"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            <button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bangers text-lg tracking-wider border-3 border-slate-900 rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2"
            >
              {isDownloadingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>EXPORTING PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>DOWNLOAD AS PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onNewStory}
              className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-slate-900 font-comic font-bold text-sm border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Panels Layout: Strip or Grid */}
      <div
        className={
          layoutMode === 'strip'
            ? 'space-y-10 max-w-4xl mx-auto'
            : 'grid grid-cols-1 md:grid-cols-2 gap-8'
        }
      >
        {comic.layout.map((panel) => {
          const isPromptOpen = expandedPrompts[panel.panel_number] || false;
          const isEditing = editingPanelId === panel.panel_number;

          return (
            <div
              key={panel.panel_number}
              className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#000] overflow-hidden flex flex-col group transition-transform hover:-translate-y-1"
            >
              {/* Panel Header */}
              <div className="bg-amber-300 border-b-3 border-slate-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 text-amber-300 font-bangers text-base px-2.5 py-0.5 rounded border border-slate-900">
                    PANEL {panel.panel_number}
                  </span>
                  <h3 className="font-bangers text-xl sm:text-2xl text-slate-950 tracking-wide">
                    {panel.title}
                  </h3>
                </div>

                {/* Sound Effect Comic Burst */}
                {panel.sound_effect && (
                  <div className="bg-red-600 text-white font-bangers text-lg tracking-wider px-3 py-0.5 rounded border-2 border-slate-900 shadow-[2px_2px_0px_#000] transform -rotate-3 hover:scale-105 transition-transform">
                    *{panel.sound_effect}*
                  </div>
                )}
              </div>

              {/* Panel Illustration Artwork */}
              <div className="relative bg-slate-950 border-b-3 border-slate-900 aspect-[16/10] overflow-hidden">
                <img
                  src={panel.image_url}
                  alt={`Panel ${panel.panel_number}: ${panel.title}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Comic Halftone Overlay Effect */}
                <div className="comic-halftone absolute inset-0 opacity-10 pointer-events-none" />

                {/* Zoom / Full Preview Action */}
                <button
                  onClick={() => setSelectedImage(panel.image_url)}
                  className="absolute bottom-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg border-2 border-white shadow-md transition-colors"
                  title="Expand Artwork"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Story Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Yellow Comic Narrative Caption Box */}
                {panel.caption && (
                  <div className="bg-amber-200 border-2 border-slate-900 p-2.5 rounded-lg shadow-[2px_2px_0px_#000] font-bangers text-sm sm:text-base text-slate-950 tracking-wider">
                    <span className="text-red-700 mr-1.5 font-black">CAPTION:</span>
                    {panel.caption}
                  </div>
                )}

                {/* Scene Description (Italics) */}
                <div className="border-l-4 border-amber-500 pl-3.5 py-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-comic">
                    Scene Setting & Context:
                  </p>
                  <p className="text-sm sm:text-base italic text-slate-700 font-comic leading-relaxed">
                    {panel.scene_description}
                  </p>
                </div>

                {/* Speech Bubble / Dialogue */}
                <div className="relative mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1 font-comic">
                      <MessageSquare className="w-3.5 h-3.5" /> Character Dialogue:
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => startEditDialogue(panel)}
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                        title="Edit dialogue"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editDialogue}
                        onChange={(e) => setEditDialogue(e.target.value)}
                        className="flex-1 p-2 rounded-lg border-2 border-blue-500 text-sm font-comic bg-blue-50"
                      />
                      <button
                        onClick={() => saveEditDialogue(panel.panel_number)}
                        className="p-2 bg-emerald-500 text-white rounded-lg border border-slate-900"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingPanelId(null)}
                        className="p-2 bg-slate-200 text-slate-700 rounded-lg border border-slate-900"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative bg-sky-100 border-2 border-sky-600 rounded-xl p-3 shadow-[2px_2px_0px_#0284c7]">
                      {/* Speech Bubble Arrow Indicator */}
                      <div className="absolute -top-2 left-6 w-3 h-3 bg-sky-100 border-t-2 border-l-2 border-sky-600 transform rotate-45" />
                      <p className="font-comic font-bold text-sm sm:text-base text-sky-950">
                        {panel.dialogue}
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Prompt Reference Accordion */}
                <div className="pt-2 border-t border-slate-200">
                  <button
                    onClick={() => togglePrompt(panel.panel_number)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
                  >
                    <span className="flex items-center gap-1 font-comic">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Image Prompt Reference</span>
                    </span>
                    {isPromptOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isPromptOpen && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-600 font-mono">
                      {panel.image_prompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Floating / Action Section */}
      <div className="mt-12 text-center bg-yellow-200 border-4 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#000] max-w-4xl mx-auto">
        <h3 className="font-bangers text-3xl sm:text-4xl text-slate-950 mb-2">
          READY TO EXPORT YOUR MASTERPIECE?
        </h3>
        <p className="text-slate-700 font-comic text-base mb-6 max-w-xl mx-auto">
          Compile all 5 panels, cover art, narrator captions, and dialogues into a multi-page PDF document formatted for printing or sharing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bangers text-2xl tracking-wider border-4 border-slate-900 rounded-xl shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-3"
          >
            {isDownloadingPdf ? (
              <>
                <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>BUILDING PDF DOCUMENT...</span>
              </>
            ) : (
              <>
                <Download className="w-6 h-6 stroke-[2.5]" />
                <span>DOWNLOAD YOUR COMIC AS PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onNewStory}
            className="py-4 px-6 bg-white hover:bg-slate-100 text-slate-950 font-bangers text-2xl tracking-wider border-4 border-slate-900 rounded-xl shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            CREATE ANOTHER COMIC
          </button>
        </div>
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-white p-3 rounded-2xl border-4 border-slate-900 shadow-[10px_10px_0px_#000]">
            <img
              src={selectedImage}
              alt="Expanded Panel"
              className="w-full h-auto rounded-lg border-2 border-slate-900"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-full border-3 border-slate-900 font-black text-lg flex items-center justify-center shadow-md"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
