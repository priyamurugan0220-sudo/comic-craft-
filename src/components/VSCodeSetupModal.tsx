import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Download,
  FolderTree,
  FileCode,
  ExternalLink,
  Cpu,
  BookOpen,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { PYTHON_BACKEND_FILES } from '../data/pythonCodeSnippets';

export const VSCodeSetupModal: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const activeFile = PYTHON_BACKEND_FILES[activeFileIndex];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#000] p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl border-3 border-slate-900 flex items-center justify-center text-white shadow-[2px_2px_0px_#000]">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bangers text-3xl sm:text-4xl text-slate-950 tracking-wide">
                VS CODE SETUP, INSTALLATION & FULL SOURCE CODE
              </h1>
              <p className="text-slate-600 font-comic text-sm">
                Complete guide to run ComicCraft locally in VS Code with Python FastAPI and Gemini AI models.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400">
              8 Full Python Modules
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Execution Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Step 1 */}
        <div className="bg-white rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bangers text-xl text-red-600">STEP 1</span>
              <FolderTree className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 font-comic">
              Open in VS Code
            </h3>
            <p className="text-xs text-slate-600 font-comic">
              Create a project folder (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">comiccraft</code>) and open it inside VS Code.
            </p>
          </div>
          <div className="mt-3 bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono flex items-center justify-between">
            <span>code comiccraft</span>
            <button
              onClick={() => handleCopySnippet('code comiccraft', 's1')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 's1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bangers text-xl text-blue-600">STEP 2</span>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 font-comic">
              Virtual Environment
            </h3>
            <p className="text-xs text-slate-600 font-comic">
              Open the integrated terminal in VS Code and activate an isolated Python environment.
            </p>
          </div>
          <div className="mt-3 bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono flex items-center justify-between">
            <span>python -m venv venv</span>
            <button
              onClick={() => handleCopySnippet('python -m venv venv\nsource venv/bin/activate  # or .\\venv\\Scripts\\activate', 's2')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 's2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bangers text-xl text-purple-600">STEP 3</span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 font-comic">
              Install Packages
            </h3>
            <p className="text-xs text-slate-600 font-comic">
              Install FastAPI, Uvicorn, Google GenAI SDK, FPDF, and Pillow dependencies.
            </p>
          </div>
          <div className="mt-3 bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono flex items-center justify-between">
            <span>pip install -r reqs.txt</span>
            <button
              onClick={() => handleCopySnippet('pip install -r requirements.txt', 's3')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 's3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bangers text-xl text-emerald-600">STEP 4</span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 font-comic">
              Launch Server
            </h3>
            <p className="text-xs text-slate-600 font-comic">
              Start Uvicorn with auto-reload and visit <code className="bg-slate-100 px-1 rounded">http://127.0.0.1:8000</code>.
            </p>
          </div>
          <div className="mt-3 bg-slate-900 text-slate-200 p-2 rounded text-[11px] font-mono flex items-center justify-between">
            <span>uvicorn main:app --reload</span>
            <button
              onClick={() => handleCopySnippet('uvicorn main:app --reload --port 8000', 's4')}
              className="text-slate-400 hover:text-white"
            >
              {copiedSnippet === 's4' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#000] overflow-hidden">
        {/* Top File Tab Bar */}
        <div className="bg-slate-900 p-3 flex items-center gap-2 overflow-x-auto border-b-2 border-slate-800">
          {PYTHON_BACKEND_FILES.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeFileIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#000]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* File Information & Actions Header */}
        <div className="p-4 bg-amber-50 border-b-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900">
                {activeFile.path}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-comic mt-0.5">
              {activeFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(activeFile.code, activeFileIndex)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all"
            >
              {copiedIndex === activeFileIndex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>COPIED CODE</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(activeFile.name, activeFile.code)}
              className="px-3 py-1.5 bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold text-xs border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[550px]">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            <code>{activeFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
