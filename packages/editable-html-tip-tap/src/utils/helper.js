const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const normalizeInitialMarkup = (markup) => {
  const trimmed = String(markup ?? '').trim();
  if (!trimmed) return '<div></div>';

  const looksLikeHtml = /<[^>]+>/.test(trimmed);
  if (looksLikeHtml) return trimmed;

  return `<div>${escapeHtml(trimmed)}</div>`;
};
