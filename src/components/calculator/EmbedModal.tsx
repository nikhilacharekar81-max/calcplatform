import React, { useState } from 'react';
import { X, Copy, Check, Download, Code, Eye, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { Calculator } from '../../types/schema.ts';

interface EmbedModalProps {
  calculator: Calculator;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  calculator,
  isOpen,
  onClose,
}) => {
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('750');
  const [theme, setTheme] = useState<'light' | 'dark' | 'minimal'>('light');
  const [showBorder, setShowBorder] = useState(true);
  const [showShadow, setShowShadow] = useState(true);
  const [borderRadius, setBorderRadius] = useState('12');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  if (!isOpen) return null;

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://calcplatform.org';
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/${calculator.slug}`;
  const embedUrl = `${getBaseUrl()}${currentPath}?embed=true&theme=${theme}`;

  const borderCss = showBorder ? '1px solid #e4e5e7' : 'none';
  const shadowCss = showShadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.08)' : 'none';

  const embedCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}px"
  style="border: ${borderCss}; border-radius: ${borderRadius}px; box-shadow: ${shadowCss}; overflow: hidden;"
  frameborder="0"
  scrolling="no"
  title="${calculator.name}"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    const fullHtmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calculator.name} - Embed Widget</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            display: flex;
            justify-content: center;
        }
        .calculator-container {
            width: 100%;
            max-width: 900px;
        }
    </style>
</head>
<body>
    <div class="calculator-container">
        ${embedCode}
    </div>
</body>
</html>`;

    const blob = new Blob([fullHtmlPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculator.slug || 'calculator'}-embed.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222325]/60 backdrop-blur-xs select-none">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#dadbdd] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#e4e5e7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#222325]">
                Embed {calculator.name}
              </h3>
              <p className="text-xs text-[#74767e]">
                Copy iframe HTML snippet or download standalone HTML file
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#74767e] hover:text-[#222325] rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#fafafa] p-4 rounded-xl border border-[#e4e5e7]">
            {/* Width */}
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Iframe Width</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="100% or 800px"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden font-mono"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Iframe Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="750"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden font-mono"
              />
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">Theme Style</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden cursor-pointer"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="minimal">Minimal / Clean</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#404145]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                className="w-4 h-4 rounded text-[#1dbf73] focus:ring-[#1dbf73]"
              />
              <span>Outer Border</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showShadow}
                onChange={(e) => setShowShadow(e.target.checked)}
                className="w-4 h-4 rounded text-[#1dbf73] focus:ring-[#1dbf73]"
              />
              <span>Drop Shadow</span>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[#74767e]">Border Radius:</span>
              <select
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                className="px-2 py-1 text-xs bg-[#fafafa] border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden cursor-pointer font-mono"
              >
                <option value="0">0px (Square)</option>
                <option value="8">8px (Medium)</option>
                <option value="12">12px (Rounded)</option>
                <option value="20">20px (Large)</option>
              </select>
            </div>
          </div>

          {/* Tabs: HTML Snippet vs Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#e4e5e7] pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'bg-[#1dbf73] text-white shadow-2xs'
                      : 'text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>HTML Embed Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-[#1dbf73] text-white shadow-2xs'
                      : 'text-[#74767e] hover:text-[#222325]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Sandbox Preview</span>
                </button>
              </div>

              <span className="text-[11px] font-mono text-[#74767e]">
                Compatible with WordPress, Webflow, Squarespace, Wix, React & HTML
              </span>
            </div>

            {activeTab === 'code' ? (
              <div className="relative">
                <pre className="p-4 bg-[#1e1e1e] text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-[#333]">
                  <code>{embedCode}</code>
                </pre>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs cursor-pointer border border-white/20"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1dbf73]" />
                      <span className="text-[#1dbf73]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex justify-center overflow-x-auto">
                <div style={{ width, maxWidth: '100%' }}>
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height={`${height}px`}
                    style={{
                      border: borderCss,
                      borderRadius: `${borderRadius}px`,
                      boxShadow: shadowCss,
                      overflow: 'hidden',
                    }}
                    frameBorder="0"
                    title="Live Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#fafafa] border-t border-[#e4e5e7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="/admin/embed-studio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1dbf73] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Advanced Rich-Text & HTML Studio &rarr;</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-4 py-2 bg-white hover:bg-[#f0f0f0] border border-[#dadbdd] text-[#222325] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#74767e]" />
              <span>Download .HTML File</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Embed Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
