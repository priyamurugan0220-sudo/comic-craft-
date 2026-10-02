import React from 'react';
import { BookOpen, Sparkles, Code2, Terminal, RefreshCw, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'preview' | 'api' | 'vscode';
  setActiveTab: (tab: 'studio' | 'preview' | 'api' | 'vscode') => void;
  hasComic: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasComic,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-400 border-b-4 border-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
            <div className="w-12 h-12 bg-red-600 rounded-lg border-3 border-slate-900 flex items-center justify-center shadow-[3px_3px_0px_#0f172a] transform -rotate-3 hover:rotate-0 transition-transform">
              <Sparkles className="w-7 h-7 text-amber-300 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bangers text-3xl sm:text-4xl text-slate-950 tracking-wider">
                  COMIC<span className="text-red-600">CRAFT</span>
                </span>
                <span className="hidden sm:inline-block bg-slate-900 text-yellow-300 text-xs font-black uppercase px-2 py-0.5 rounded border border-slate-900 tracking-wider">
                  Issue #1
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 tracking-wide font-comic hidden sm:block">
                Gemini 3.8 AI Comic Studio & PDF Engine
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base border-3 border-slate-900 transition-all ${
                activeTab === 'studio'
                  ? 'bg-slate-900 text-amber-300 shadow-[3px_3px_0px_#000]'
                  : 'bg-amber-100 text-slate-900 hover:bg-white shadow-[2px_2px_0px_#0f172a]'
              }`}
            >
              <span className="flex items-center gap-1.5 font-comic">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Create</span> Studio
              </span>
            </button>

            {hasComic && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base border-3 border-slate-900 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-slate-900 text-amber-300 shadow-[3px_3px_0px_#000]'
                    : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-[2px_2px_0px_#0f172a]'
                }`}
              >
                <span className="flex items-center gap-1.5 font-comic">
                  <BookOpen className="w-4 h-4" />
                  Comic <span className="hidden md:inline">Preview</span>
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base border-3 border-slate-900 transition-all ${
                activeTab === 'api'
                  ? 'bg-slate-900 text-amber-300 shadow-[3px_3px_0px_#000]'
                  : 'bg-blue-300 text-slate-900 hover:bg-blue-200 shadow-[2px_2px_0px_#0f172a]'
              }`}
              title="Test JSON APIs (/generate-comic/json)"
            >
              <span className="flex items-center gap-1.5 font-comic">
                <Terminal className="w-4 h-4" />
                <span className="hidden lg:inline">API</span> Tester
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vscode')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base border-3 border-slate-900 transition-all ${
                activeTab === 'vscode'
                  ? 'bg-slate-900 text-amber-300 shadow-[3px_3px_0px_#000]'
                  : 'bg-purple-300 text-slate-900 hover:bg-purple-200 shadow-[2px_2px_0px_#0f172a]'
              }`}
              title="VS Code Setup and Python Code"
            >
              <span className="flex items-center gap-1.5 font-comic">
                <Code2 className="w-4 h-4" />
                VS Code <span className="hidden lg:inline">& Python</span>
              </span>
            </button>

            {hasComic && (
              <button
                onClick={onReset}
                title="New Story"
                className="p-2 bg-slate-100 hover:bg-white text-slate-900 border-3 border-slate-900 rounded-lg shadow-[2px_2px_0px_#0f172a] hover:rotate-12 transition-transform"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
