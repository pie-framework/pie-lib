const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Converts consecutive div elements into a single paragraph with line breaks.
 * Example: "<div>A</div><div>B</div>" becomes "<p>A<br>B</p>"
 */
const convertConsecutiveDivsToParagraph = (html) => {
  // Create a temporary element to parse the HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Get all top-level children
  const children = Array.from(temp.children);

  // Only convert if there are 2 or more divs
  if (children.length < 2) {
    return html;
  }

  // Check if all children are divs with simple content (text or inline elements)
  const allDivs = children.every((child) => child.tagName === 'DIV');

  if (!allDivs) {
    return html;
  }

  // Check if divs have no attributes (only convert plain divs)
  const hasNoAttributes = children.every((div) => div.attributes.length === 0);

  if (!hasNoAttributes) {
    return html;
  }

  // Check if divs contain only simple content (no nested block elements)
  const hasOnlySimpleContent = children.every((div) => {
    return Array.from(div.children).every((child) => {
      const tag = child.tagName;
      // Allow inline elements and br tags
      return ['SPAN', 'B', 'I', 'EM', 'STRONG', 'U', 'SUB', 'SUP', 'A', 'CODE', 'BR'].includes(tag);
    });
  });

  if (!hasOnlySimpleContent) {
    return html;
  }

  // Convert to paragraph with br tags
  const contents = children.map((div) => div.innerHTML);
  return `<p>${contents.join('<br>')}</p>`;
};

export const normalizeInitialMarkup = (markup) => {
  const trimmed = String(markup ?? '').trim();
  if (!trimmed) return '<div></div>';

  const looksLikeHtml = /<[^>]+>/.test(trimmed);
  if (!looksLikeHtml) {
    return `<div>${escapeHtml(trimmed)}</div>`;
  }

  // Apply the div-to-paragraph transformation
  return convertConsecutiveDivsToParagraph(trimmed);
};
