import { registerLineBreak } from './custom-elements';

let mathliveModule;
let triedLoad = false;
const embedRegistry = new Map();

const tryLoad = () => {
  if (triedLoad) return mathliveModule;
  triedLoad = true;
  if (typeof window === 'undefined') return undefined;
  try {
    // eslint-disable-next-line global-require
    mathliveModule = require('mathlive');
    registerLineBreak({ registerEmbed });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('MathLive failed to load', e);
  }
  return mathliveModule;
};

/**
 * Convert legacy MathQuill-style LaTeX tokens to MathLive-compatible LaTeX.
 *
 * - `\embed{newLine}[]` → `\\` (line break in math mode).
 * - `\MathQuillMathField[rN]{default}` → `\placeholder[rN]{default}` (MathLive prompt).
 * - Other registered embeds are replaced using their factory's preferred output
 *   when it parses as valid MathLive LaTeX; otherwise fall back to a placeholder.
 */
export function normalizeLatex(latex) {
  if (!latex) return latex;

  return latex
    // \embed{newLine}[] → line break
    .replace(/\\embed\{newLine\}\[\]/g, '\\\\')
    // \MathQuillMathField[id]{default} → \placeholder[id]{default}
    .replace(/\\MathQuillMathField\[([^\]]*)\]\{([^}]*)\}/g, '\\placeholder[$1]{$2}')
    // bare \MathQuillMathField[id]{} (empty default)
    .replace(/\\MathQuillMathField\[([^\]]*)\]\{\}/g, '\\placeholder[$1]{}');
}

function registerEmbed(name, factory) {
  embedRegistry.set(name, factory);
}

export function getMathLive() {
  return tryLoad();
}

export function convertLatexToMarkup(latex) {
  const ml = getMathLive();
  if (!ml) return `<span class="ML__latex">${latex || ''}</span>`;
  return ml.convertLatexToMarkup(normalizeLatex(latex) || '');
}

export function renderMathInElement(el, opts) {
  const ml = getMathLive();
  if (!ml) return;
  ml.renderMathInElement(el, opts);
}
