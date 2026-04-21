/**
 * transformDataHeadings
 *
 * Rewrites every `<p data-heading="headingN">…</p>` in an HTML string to a
 * proper heading element whose level is `clamp(baseLevel + N - 1, 1, 6)`.
 *
 *
 * This is a pure function: it performs no DOM mutations and has no side-effects.
 * It relies on the browser's (or jsdom's) HTML parser via DOMParser, so it must
 * only be called in an environment that provides that global.
 *
 * @param {string} html       - Raw HTML string (passage body, prompt, etc.)
 * @param {number} baseLevel  - The base heading level (1–6). Defaults to 2.
 * @returns {string}          - HTML string with promoted heading elements.
 *
 * @example
 * // baseLevel=2, data-heading="heading1" → <h2 data-heading="heading1">…</h2>
 * // baseLevel=2, data-heading="heading2" → <h3 data-heading="heading2">…</h3>
 * // baseLevel=3, data-heading="heading1" → <h3 data-heading="heading1">…</h3>
 */
export function transformDataHeadings(html = '', baseLevel = 2) {
  if (!html) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.body.querySelectorAll('[data-heading]').forEach((el) => {
    const raw = el.getAttribute('data-heading') || '';
    const n = parseInt(raw.replace('heading', ''), 10);

    if (!Number.isFinite(n)) return; // skip malformed values

    const level = Math.min(6, Math.max(1, baseLevel + n - 1));
    const heading = doc.createElement(`h${level}`);

    heading.setAttribute('data-heading', raw);

    // Copy all other attributes (class, id, style, …)
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name !== 'data-heading') {
        heading.setAttribute(attr.name, attr.value);
      }
    });

    heading.innerHTML = el.innerHTML;
    el.replaceWith(heading);
  });

  return doc.body.innerHTML;
}
