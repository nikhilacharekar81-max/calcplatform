/**
 * Robust HTML sanitizer for blog post and rich text content.
 * Cleans pasted Gemini/ChatGPT/Copilot/Docs web components, rogue inline font sizes,
 * unclosed headings, and internal tracking attributes while preserving standard semantic HTML.
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return '';
  let clean = html;

  // 1. Remove Angular / Gemini / AI web components tags while preserving inner content
  const customComponentTags = [
    'message-content',
    'response-element',
    'table-block',
    'link-block',
    'gem-icon-button',
    'gem-icon',
    'mat-icon',
    'gem-popover',
    'copy-button',
    'source-element',
    'citation-item',
    'citation-marker',
  ];
  customComponentTags.forEach((tag) => {
    clean = clean.replace(new RegExp(`</?${tag}[^>]*>`, 'gi'), '');
  });

  // 2. Remove buttons inside content (like copy buttons or action chips from AI chats)
  clean = clean.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');

  // 3. Remove rogue empty wrapper divs from AI web interfaces
  clean = clean.replace(/<div\s+(?:_[^>]*|class=["'](?:container|markdown[^"']*|ng-star-inserted)["'])[^>]*>/gi, '');
  clean = clean.replace(/<div\s+inline-copy-host[^>]*>/gi, '');

  // 4. Fix fake <h1> or <h2> wrapping an introductory paragraph (e.g. pasted with font-size: 1.25rem or font-weight: 400)
  clean = clean.replace(/<h1[^>]*>\s*<span[^>]*style=["'][^"']*(?:font-size:\s*1\.25rem|font-weight:\s*400)[^"']*["'][^>]*>([\s\S]*?)<\/span>\s*<\/h1>/gi, '<p>$1</p>');
  clean = clean.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '<h2>$1</h2>'); // Articles have one main <h1> (the post title); subheadings should be <h2>

  // 5. Remove false opening or orphan <h2> that precede paragraphs
  clean = clean.replace(/<h2>\s*(?=<p)/gi, '');
  clean = clean.replace(/<h2>\s*<\/h2>/gi, '');

  // 6. Strip internal AI chat tracking attributes
  clean = clean.replace(/\s+(?:data-path-to-node|data-index-in-node|_ngcontent[a-z0-9_-]*|_nghost[a-z0-9_-]*|inline-copy-host|tutor-markdown-rendering|enable-[a-z0-9_-]+|aria-busy|aria-live|dir)=["'][^"']*["']/gi, '');

  // 7. Unwrap <pre> and <code> blocks so users are never trapped in black boxes
  clean = clean.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, code) => {
    const lines = code.trim().split(/\n\s*\n/);
    return lines.map((block: string) => `<p>${block.replace(/\n/g, '<br/>')}</p>`).join('');
  });
  clean = clean.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, text) => {
    const lines = text.trim().split(/\n\s*\n/);
    return lines.map((block: string) => `<p>${block.replace(/\n/g, '<br/>')}</p>`).join('');
  });
  clean = clean.replace(/<\/?code[^>]*>/gi, '');

  // 8. Strip rogue inline dark background-color, background, and dark text colors from ChatGPT/Gemini/Docs dark mode
  clean = clean.replace(/(style=["'][^"']*)background-color:\s*(?:rgb\(\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*,\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*,\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*\)|#[0-3][0-9a-f]{2,5}|black|#000|#111|#1e1e1e|#121212|#202124|#222|#282c34|#2b2b2b);?([^"']*["'])/gi, '$1$2');
  clean = clean.replace(/(style=["'][^"']*)background:\s*(?:rgb\(\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*,\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*,\s*(?:[0-4]?[0-9]|5[0-9]|6[0-9])\s*\)|#[0-3][0-9a-f]{2,5}|black|#000|#111|#1e1e1e|#121212|#202124|#222|#282c34|#2b2b2b);?([^"']*["'])/gi, '$1$2');
  clean = clean.replace(/(style=["'][^"']*)color:\s*(?:rgb\(\s*25[0-5]\s*,\s*25[0-5]\s*,\s*25[0-5]\s*\)|#fff|#ffffff|white);?([^"']*["'])/gi, '$1$2');

  // 9. Strip rogue inline font-size on paragraphs and spans that cause shrinking or sizing anomalies
  clean = clean.replace(/(style=["'][^"']*)font-size:\s*[^;'"]+;?([^"']*["'])/gi, '$1$2');
  clean = clean.replace(/(style=["'][^"']*)font-family:\s*[^;'"]+;?([^"']*["'])/gi, '$1$2');
  clean = clean.replace(/style=["']\s*["']/gi, '');

  // 10. Clean up empty paragraphs or placeholder classes
  clean = clean.replace(/<p\s+class=["']isSelectedEnd["']>/gi, '<p>');
  clean = clean.replace(/<p>\s*<\/p>/gi, '');

  return clean.trim();
}
