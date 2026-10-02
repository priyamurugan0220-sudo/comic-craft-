import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Smile, Palette, User, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ComicMetadata } from '../types';

interface ComicFormProps {
  onGenerate: (data: ComicMetadata) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

const PRESET_STORIES = [
  {
    title: '🦊 The Brave Fox in Enchanted Forest',
    prompt: 'A brave fox named Rusty explores an ancient enchanted forest where glowing will-o-the-wisps lead him to a long-forgotten celestial temple holding the legendary Starlight Gem.',
    character: 'Rusty the Fox',
    setting: 'Enchanted Forest',
    tone: 'Dramatic',
    art_style: 'Comic Book',
  },
  {
    title: '🤖 Detective Byte in Neon Rain',
    prompt: 'A quirky cyborg detective named Byte investigates a mysterious blackout in Neo-Tokyo, where rogue robotic barista drones have started speaking in ancient poetry.',
    character: 'Detective Byte',
    setting: 'Cyberpunk City',
    tone: 'Light-hearted / Funny',
    art_style: 'Anime',
  },
  {
    title: '⚔️ Chronos and the Clockwork Ruins',
    prompt: 'An armored chronomancer discovers a giant mechanical titan dormant within subterranean desert ruins, accidentally triggering its ancient defense chronometer.',
    character: 'Chronos',
    setting: 'Ancient Ruins',
    tone: 'Action Heroic',
    art_style: 'Realistic',
  },
  {
    title: '🚀 Space Station Star Misfits',
    prompt: 'A reckless pilot and her alien pet accidentally jettison the space station captain\'s prized cosmic pastry into a wormhole during zero-gravity lunch hour.',
    character: 'Captain Nova',
    setting: 'Space Station',
    tone: 'Light-hearted / Funny',
    art_style: 'Pixel Art',
  },
];

const SETTINGS = [
  { id: 'Enchanted Forest', label: '🌲 Enchanted Forest' },
  { id: 'Cyberpunk City', label: '🏙️ Cyberpunk City' },
  { id: 'Ancient Ruins', label: '🏛️ Ancient Ruins' },
  { id: 'Space Station', label: '🚀 Space Station' },
  { id: 'High School', label: '🏫 High School' },
  { id: 'Haunted Manor', label: '🏰 Haunted Manor' },
  { id: 'Underwater City', label: '🌊 Underwater City' },
];

const TONES = [
  { id: 'Dramatic', label: '🎭 Dramatic & Suspenseful' },
  { id: 'Light-hearted / Funny', label: '😄 Light-hearted & Funny' },
  { id: 'Action Heroic', label: '💥 Action & Heroic' },
  { id: 'Poetic & Mysterious', label: '🌌 Poetic & Mysterious' },
  { id: 'Dark Noir', label: '🕵️ Dark Noir & Gritty' },
];

const ART_STYLES = [
  { id: 'Comic Book', label: '💥 Classic Comic Book (Halftone / Marvel DC)' },
  { id: 'Anime', label: '⚡ Japanese Manga / Anime' },
  { id: 'Pixel Art', label: '👾 16-Bit Retro Pixel Art' },
  { id: 'Realistic', label: '🎨 Realistic Graphic Novel' },
  { id: 'Dark Noir', label: '🖤 Film Noir Black & White' },
  { id: 'Watercolor', label: '🖌️ Watercolor Storybook' },
];

export const ComicForm: React.FC<ComicFormProps> = ({
  onGenerate,
  isLoading,
  loadingStep,
}) => {
  const [storyPrompt, setStoryPrompt] = useState(
    'A brave fox named Rusty explores an ancient enchanted forest where glowing will-o-the-wisps lead him to a long-forgotten celestial temple.'
  );
  const [characterName, setCharacterName] = useState('Rusty the Fox');
  const [setting, setSetting] = useState('Enchanted Forest');
  const [tone, setTone] = useState('Dramatic');
  const [artStyle, setArtStyle] = useState('Comic Book');
  const [validationError, setValidationError] = useState('');

  const handleApplyPreset = (preset: typeof PRESET_STORIES[0]) => {
    setStoryPrompt(preset.prompt);
    setCharacterName(preset.character);
    setSetting(preset.setting);
    setTone(preset.tone);
    setArtStyle(preset.art_style);
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyPrompt.trim()) {
      setValidationError('Please enter a story prompt.');
      return;
    }
    if (!characterName.trim()) {
      setValidationError('Please enter a character name.');
      return;
    }
    setValidationError('');
    onGenerate({
      story_prompt: storyPrompt.trim(),
      character_name: characterName.trim(),
      setting,
      tone,
      art_style: artStyle,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-block bg-yellow-300 text-slate-950 font-black px-4 py-1 rounded-full border-3 border-slate-900 shadow-[3px_3px_0px_#000] text-sm uppercase tracking-wider mb-3">
          ⚡ AI-Driven Comic Book Generator
        </div>
        <h1 className="font-bangers text-4xl sm:text-6xl text-slate-950 tracking-wide drop-shadow-[2px_2px_0px_#fde047]">
          CREATE YOUR 5-PANEL COMIC SAGA
        </h1>
        <p className="mt-2 text-lg text-slate-700 font-comic max-w-2xl mx-auto">
          Provide your story premise, hero, and visual style. Gemini Flash & Pro will orchestrate panel outlines, vivid narration, sound effects, dialogues, and illustrations!
        </p>
      </div>

      {/* Preset Story Ideas */}
      <div className="mb-8 bg-white p-4 rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm uppercase tracking-wide">
          <Wand2 className="w-4 h-4 text-amber-500" />
          <span>Quick Inspiration Presets (1-Click Fill):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_STORIES.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-lg border-2 border-slate-800 bg-amber-50 hover:bg-amber-100 hover:border-amber-500 transition-colors text-xs font-semibold text-slate-900 flex items-center justify-between group"
            >
              <span>{preset.title}</span>
              <span className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                Apply →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-yellow-100 rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#000] p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />

        {validationError && (
          <div className="p-3 bg-red-100 border-2 border-red-600 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Story Prompt */}
        <div>
          <label className="block text-slate-950 font-bold text-lg mb-1 flex items-center gap-2 font-comic">
            <BookOpen className="w-5 h-5 text-red-600" />
            <span>Story Prompt & Plot Premise:</span>
          </label>
          <textarea
            rows={3}
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Describe what happens in your story (e.g. A brave fox searching for the celestial temple...)"
            className="w-full p-4 rounded-xl border-3 border-slate-900 bg-white font-comic text-base text-slate-900 shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-slate-600 font-comic">
            💡 Tip: Include what your protagonist wants and the core conflict or discovery!
          </p>
        </div>

        {/* Row 1: Character Name & Setting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-950 font-bold text-base mb-1 flex items-center gap-2 font-comic">
              <User className="w-4 h-4 text-blue-600" />
              <span>Main Character Name:</span>
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Rusty the Fox"
              className="w-full p-3.5 rounded-xl border-3 border-slate-900 bg-white font-comic text-base text-slate-900 shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-950 font-bold text-base mb-1 flex items-center gap-2 font-comic">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Setting / Environment:</span>
            </label>
            <select
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              disabled={isLoading}
              className="w-full p-3.5 rounded-xl border-3 border-slate-900 bg-white font-comic text-base text-slate-900 shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {SETTINGS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Tone & Art Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-slate-950 font-bold text-base mb-1 flex items-center gap-2 font-comic">
              <Smile className="w-4 h-4 text-purple-600" />
              <span>Story Tone:</span>
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isLoading}
              className="w-full p-3.5 rounded-xl border-3 border-slate-900 bg-white font-comic text-base text-slate-900 shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-950 font-bold text-base mb-1 flex items-center gap-2 font-comic">
              <Palette className="w-4 h-4 text-red-600" />
              <span>Visual Art Style:</span>
            </label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              disabled={isLoading}
              className="w-full p-3.5 rounded-xl border-3 border-slate-900 bg-white font-comic text-base text-slate-900 shadow-[3px_3px_0px_#000] focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {ART_STYLES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button & Progress State */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bangers text-2xl sm:text-3xl text-white tracking-wider border-4 border-slate-900 shadow-[6px_6px_0px_#000] transition-all flex items-center justify-center gap-3 ${
              isLoading
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>{loadingStep || 'CRAFTING YOUR COMIC...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-7 h-7 text-amber-300" />
                <span>GENERATE 5-PANEL COMIC SAGA</span>
              </>
            )}
          </button>

          {isLoading && (
            <div className="mt-4 p-4 bg-white rounded-xl border-3 border-slate-900 text-center font-comic">
              <p className="text-sm font-bold text-slate-900">
                ⏳ {loadingStep || 'AI Story Pipeline In Progress...'}
              </p>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2 border border-slate-400">
                <div className="bg-amber-400 h-full w-2/3 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Gemini Flash & Pro are structuring 5 panels, authoring punchy dialogue, and styling illustrations.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
