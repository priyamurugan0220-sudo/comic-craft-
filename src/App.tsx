/**
 * ComicCraft - AI-Powered Comic Story Creator
 * Main Application Component
 */
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ComicForm } from './components/ComicForm';
import { ComicPreview } from './components/ComicPreview';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import { ApiTesterModal } from './components/ApiTesterModal';
import { VSCodeSetupModal } from './components/VSCodeSetupModal';
import { ComicMetadata, ComicStory, ComicPanel } from './types';
import { generateComicPdf } from './utils/pdfGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'preview' | 'api' | 'vscode' | 'export_success'>('studio');
  const [currentComic, setCurrentComic] = useState<ComicStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Generate Comic Handler
  const handleGenerateComic = async (metadata: ComicMetadata) => {
    setIsLoading(true);
    setLoadingStep('Initializing Gemini 3.8 Story Engine...');

    try {
      // Step simulation indicators
      const timer1 = setTimeout(() => {
        setLoadingStep('Gemini Flash: Structuring 5-panel storyline & outline...');
      }, 700);

      const timer2 = setTimeout(() => {
        setLoadingStep('Gemini Pro: Authoring captions, speech dialogues & sound FX...');
      }, 1900);

      const timer3 = setTimeout(() => {
        setLoadingStep('Rendering comic illustrations & halftone aesthetic...');
      }, 3200);

      const response = await fetch('/generate-comic/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story_prompt: metadata.story_prompt,
          character_name: metadata.character_name,
          setting: metadata.setting,
          tone: metadata.tone,
          art_style: metadata.art_style,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        throw new Error(`Generation failed with HTTP status ${response.status}`);
      }

      const data: ComicStory = await response.json();
      setCurrentComic(data);
      setActiveTab('preview');
    } catch (err: any) {
      console.error('Comic generation error:', err);
      alert(`Comic Generation Note: ${err.message || 'Error communicating with AI engine.'}`);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // PDF Export Handler
  const handleDownloadPdf = async () => {
    if (!currentComic) return;
    setIsDownloadingPdf(true);

    try {
      const blob = await generateComicPdf(currentComic, (step) => {
        // Can be used for logging progress
        console.log(step);
      });

      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);

      // Trigger automatic browser download
      const filename = `ComicCraft_${currentComic.metadata.character_name.replace(/\s+/g, '_')}.pdf`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Transition to Export Success view (as specified in technical documentation)
      setActiveTab('export_success');
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Could not compile PDF document. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Inline Panel Update Handler
  const handleUpdatePanel = (panelNumber: number, updated: Partial<ComicPanel>) => {
    if (!currentComic) return;
    const updatedLayout = currentComic.layout.map((panel) =>
      panel.panel_number === panelNumber ? { ...panel, ...updated } : panel
    );
    setCurrentComic({
      ...currentComic,
      layout: updatedLayout,
    });
  };

  const handleReset = () => {
    setCurrentComic(null);
    setPdfBlobUrl(null);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 flex flex-col font-sans">
      {/* Comic Navigation Bar */}
      <Navbar
        activeTab={activeTab === 'export_success' ? 'preview' : activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        hasComic={Boolean(currentComic)}
        onReset={handleReset}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' && (
          <ComicForm
            onGenerate={handleGenerateComic}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {activeTab === 'preview' && currentComic && (
          <ComicPreview
            comic={currentComic}
            onDownloadPdf={handleDownloadPdf}
            onNewStory={() => setActiveTab('studio')}
            onUpdatePanel={handleUpdatePanel}
            isDownloadingPdf={isDownloadingPdf}
          />
        )}

        {activeTab === 'export_success' && currentComic && (
          <ExportSuccessModal
            comic={currentComic}
            pdfBlobUrl={pdfBlobUrl}
            onNewComic={() => setActiveTab('studio')}
            onBackToPreview={() => setActiveTab('preview')}
          />
        )}

        {activeTab === 'api' && <ApiTesterModal />}

        {activeTab === 'vscode' && <VSCodeSetupModal />}
      </main>

      {/* Comic Book Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t-4 border-slate-900 py-8 px-4 text-center font-comic text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-2xl text-amber-400 tracking-wider">
              COMICCRAFT
            </span>
            <span className="text-slate-600">|</span>
            <span>AI Comic Story Creator & PDF Engine</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-amber-400 transition-colors"
            >
              API Endpoints
            </button>
            <button
              onClick={() => setActiveTab('vscode')}
              className="hover:text-amber-400 transition-colors"
            >
              VS Code Instructions
            </button>
            <span>Powered by Gemini 3.8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
