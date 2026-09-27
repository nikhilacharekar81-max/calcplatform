import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Table as TableIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit3,
  Link,
  Sparkles,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write detailed content here...',
  minHeight = '180px',
}) => {
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (prefix: string, suffix: string = '', defaultContent: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange((value || '') + `\n${prefix}${defaultContent}${suffix}\n`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultContent;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const insertTable = () => {
    const tableTemplate = `\n<table class="w-full text-left text-sm border-collapse my-4 border border-[#e4e5e7]">\n  <thead class="bg-[#fafafa]">\n    <tr>\n      <th class="p-3 border border-[#e4e5e7] font-bold text-[#222325]">Parameter / Bracket</th>\n      <th class="p-3 border border-[#e4e5e7] font-bold text-[#222325]">Standard Rate</th>\n      <th class="p-3 border border-[#e4e5e7] font-bold text-[#222325]">Applicable Rules</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td class="p-3 border border-[#e4e5e7]">Up to ₹3,00,000</td>\n      <td class="p-3 border border-[#e4e5e7]">Nil (0%)</td>\n      <td class="p-3 border border-[#e4e5e7]">Standard basic exemption limit</td>\n    </tr>\n    <tr>\n      <td class="p-3 border border-[#e4e5e7]">₹3,00,001 to ₹7,00,000</td>\n      <td class="p-3 border border-[#e4e5e7]">5%</td>\n      <td class="p-3 border border-[#e4e5e7]">Subject to Section 87A rebate</td>\n    </tr>\n  </tbody>\n</table>\n`;
    onChange((value || '') + tableTemplate);
  };

  const insertCallout = (type: 'info' | 'warning' | 'success') => {
    let classes = 'p-4 rounded-lg my-4 text-sm leading-relaxed ';
    let title = 'Note:';
    if (type === 'warning') {
      classes += 'bg-amber-50 border border-amber-200 text-amber-900';
      title = 'Important Warning:';
    } else if (type === 'success') {
      classes += 'bg-emerald-50 border border-emerald-200 text-emerald-900';
      title = 'Key Insight:';
    } else {
      classes += 'bg-blue-50 border border-blue-200 text-blue-900';
      title = 'Pro Tip:';
    }

    const template = `\n<div class="${classes}">\n  <strong>${title}</strong> Ensure all statutory limits, tax exemptions, and inflation assumptions are factored in.\n</div>\n`;
    onChange((value || '') + template);
  };

  return (
    <div className="border border-[#e4e5e7] rounded-lg overflow-hidden bg-white shadow-2xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-[#fafafa] border-b border-[#e4e5e7]">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet('<strong>', '</strong>', 'Bold text')}
            title="Bold"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('<em>', '</em>', 'Italic text')}
            title="Italic"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#e4e5e7] mx-1" />

          <button
            type="button"
            onClick={() => insertSnippet('<h3 class="text-lg font-bold text-[#222325] mt-4 mb-2">', '</h3>', 'Section Heading')}
            title="Heading 2 (H2/H3 for SEO)"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('<h4 class="text-sm font-bold text-[#222325] mt-3 mb-1.5">', '</h4>', 'Sub-heading')}
            title="Heading 3 / Sub-heading"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#e4e5e7] mx-1" />

          <button
            type="button"
            onClick={() => insertSnippet('<ul class="list-disc pl-5 space-y-1.5 my-3">\n  <li>', '</li>\n  <li>Second key point</li>\n</ul>', 'First key point')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('<ol class="list-decimal pl-5 space-y-1.5 my-3">\n  <li>', '</li>\n  <li>Step two</li>\n</ol>', 'Step one')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#e4e5e7] mx-1" />

          <button
            type="button"
            onClick={() => insertSnippet('<blockquote class="border-l-4 border-[#1dbf73] pl-4 py-1.5 my-3 italic text-[#62646a] bg-[#fafafa] rounded-r">', '</blockquote>', 'Important quote or highlight')}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('<pre class="p-3 bg-[#f5f5f5] rounded-md font-mono text-xs text-[#222325] overflow-x-auto my-3 border border-[#e4e5e7]"><code>', '</code></pre>', 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]')}
            title="Formula / Code Block"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            title="Insert Structured Table"
            className="p-1.5 rounded hover:bg-white text-[#404145] hover:text-[#222325] border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-[#e4e5e7] mx-1" />

          <button
            type="button"
            onClick={() => insertCallout('info')}
            title="Insert Tip Callout Box"
            className="p-1.5 rounded hover:bg-white text-blue-600 border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tip</span>
          </button>
          <button
            type="button"
            onClick={() => insertCallout('warning')}
            title="Insert Warning Box"
            className="p-1.5 rounded hover:bg-white text-amber-600 border border-transparent hover:border-[#e4e5e7] transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Warning</span>
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#eeeeee] p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-white text-[#222325] shadow-2xs'
                : 'text-[#74767e] hover:text-[#222325]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-[#1dbf73] shadow-2xs'
                : 'text-[#74767e] hover:text-[#222325]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>SEO Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {viewMode === 'editor' ? (
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-3.5 text-xs sm:text-sm font-sans text-[#222325] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1dbf73] bg-white resize-y block font-mono"
        />
      ) : (
        <div
          style={{ minHeight }}
          className="p-4 bg-white text-xs sm:text-sm text-[#404145] leading-relaxed overflow-y-auto prose prose-sm max-w-none border-t border-[#f0f0f0]"
        >
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <span className="italic text-[#95979d]">No content entered yet. Switch back to Editor to write.</span>
          )}
        </div>
      )}
    </div>
  );
};
