/**
 * Formats raw text/HTML strings to preserve line breaks, paragraph spacing, and whitespace.
 * If the string contains HTML block tags (<p>, <div>, <h2>, etc.), it returns it as-is.
 * If it's plain text or plain text with newlines, it converts double newlines into <p> paragraphs
 * and single newlines into <br /> line breaks.
 */
export function formatContentHtml(html: string | undefined | null): string {
  if (!html) return '';
  const trimmed = html.trim();
  if (!trimmed) return '';

  // If the content already contains HTML block tags, return it as-is
  if (/<(p|div|h[1-6]|ul|ol|table|blockquote|article|header|section|pre)/i.test(trimmed)) {
    return trimmed;
  }

  // Convert double newlines into paragraph blocks and single newlines into <br /> line breaks
  return trimmed
    .split(/\n\s*\n/)
    .map((para) => `<p class="mb-3 leading-relaxed">${para.replace(/\n/g, '<br />')}</p>`)
    .join('');
}
