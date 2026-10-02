import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, AlertCircle, Copy, Check, Play, Image as ImageIcon } from 'lucide-react';

export const ApiTesterModal: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'generate' | 'testImage'>('generate');
  
  // Payloads
  const [generatePayload, setGeneratePayload] = useState(
    JSON.stringify(
      {
        story_prompt: "A courageous young alchemist discovers a whispering crystal in an abandoned underground laboratory.",
        character_name: "Elian the Alchemist",
        setting: "Ancient Ruins",
        tone: "Dramatic",
        art_style: "Comic Book"
      },
      null,
      2
    )
  );

  const [testImagePayload, setTestImagePayload] = useState(
    JSON.stringify(
      {
        prompt: "Rusty the brave fox standing heroically on an emerald mossy boulder in a magical forest, glowing spores",
        art_style: "Anime"
      },
      null,
      2
    )
  );

  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const activePayload = selectedEndpoint === 'generate' ? generatePayload : testImagePayload;
  const endpointUrl = selectedEndpoint === 'generate' ? '/generate-comic/json' : '/test-image';

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseData(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const parsed = JSON.parse(activePayload);
      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      const end = performance.now();
      setResponseTimeMs(Math.round(end - start));
      setResponseStatus(res.status);
      setResponseData(data);
    } catch (err: any) {
      const end = performance.now();
      setResponseTimeMs(Math.round(end - start));
      setResponseStatus(500);
      setResponseData({ error: err.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = `curl -X POST "${window.location.origin}${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${activePayload.replace(/\n/g, '')}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#000] p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl border-3 border-slate-900 flex items-center justify-center text-white shadow-[2px_2px_0px_#000]">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-slate-950 tracking-wide">
              API TESTER & REST PLAYGROUND
            </h1>
            <p className="text-slate-600 font-comic text-sm">
              Live testing console for the ComicCraft backend routes (<code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300">/generate-comic/json</code> & <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300">/test-image</code>).
            </p>
          </div>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b-2 border-slate-200 pb-3">
          <button
            onClick={() => setSelectedEndpoint('generate')}
            className={`px-4 py-2 rounded-lg font-bold text-sm border-2 border-slate-900 transition-all ${
              selectedEndpoint === 'generate'
                ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#000]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="flex items-center gap-2 font-mono">
              <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">POST</span>
              /generate-comic/json
            </span>
          </button>

          <button
            onClick={() => setSelectedEndpoint('testImage')}
            className={`px-4 py-2 rounded-lg font-bold text-sm border-2 border-slate-900 transition-all ${
              selectedEndpoint === 'testImage'
                ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_#000]'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="flex items-center gap-2 font-mono">
              <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">POST</span>
              /test-image
            </span>
          </button>
        </div>
      </div>

      {/* Editor & Response Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Column */}
        <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#000] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-900 text-sm font-comic">
                REQUEST BODY (JSON):
              </span>
              <button
                onClick={copyCurl}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-300"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied cURL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={14}
              value={activePayload}
              onChange={(e) => {
                if (selectedEndpoint === 'generate') {
                  setGeneratePayload(e.target.value);
                } else {
                  setTestImagePayload(e.target.value);
                }
              }}
              className="w-full p-3 font-mono text-xs text-slate-900 bg-slate-900 text-emerald-400 rounded-xl border-3 border-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={handleExecute}
            disabled={isLoading}
            className="mt-4 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bangers text-xl tracking-wider border-3 border-slate-900 rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>EXECUTING CALL...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>SEND API REQUEST</span>
              </>
            )}
          </button>
        </div>

        {/* Response Column */}
        <div className="bg-slate-950 rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#000] p-6 text-white flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
              SERVER RESPONSE
            </span>
            {responseStatus && (
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    responseStatus >= 200 && responseStatus < 300
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-600'
                      : 'bg-red-950 text-red-400 border border-red-600'
                  }`}
                >
                  STATUS: {responseStatus}
                </span>
                {responseTimeMs && (
                  <span className="text-xs font-mono text-slate-400">
                    {responseTimeMs}ms
                  </span>
                )}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-amber-300">
                Contacting server endpoint...
              </p>
            </div>
          ) : responseData ? (
            <div className="flex-1 overflow-auto max-h-[460px] space-y-3">
              {/* If image test endpoint returned an image preview, render it! */}
              {responseData.image_url && (
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-400 font-mono mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generated Test Illustration:</span>
                  </p>
                  <img
                    src={responseData.image_url}
                    alt="Test Illustration"
                    className="w-full h-48 object-cover rounded border border-slate-700"
                  />
                </div>
              )}

              <pre className="font-mono text-xs text-emerald-400 p-3 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-500 font-mono text-xs">
              <Terminal className="w-8 h-8 mb-2 opacity-40" />
              <p>Click "Send API Request" to test endpoint response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
