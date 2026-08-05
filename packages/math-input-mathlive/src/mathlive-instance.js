import debug from 'debug';
import { NEWLINE_EMBED, toMathLive } from './latex-bridge';

const log = debug('pie-lib:math-input-mathlive:instance');

/**
 * MathLive bootstrap + compatibility shims for @pie-lib/math-input's public API.
 *
 * MathLive is loaded lazily and only in the browser: the editor bundle is
 * ~227KB gzip and registers custom elements, so it must never run during SSR.
 */

let mathlive;

/**
 * Where the KaTeX woff2 fonts are served from, as configured by the host app.
 * `undefined` means "not configured"; `null` means "explicitly disabled".
 */
let fontsDirectory;

/**
 * Turn a fonts path into a fully-qualified URL.
 *
 * MathLive's default `fontsDirectory` is the relative `'./fonts/'`, which it
 * resolves against its own script URL. Under a bundler (webpack/Next) that
 * script URL is empty, so `new URL('./fonts/', '')` throws
 * "Failed to construct 'URL': Invalid base URL" from `loadFonts`.
 * Resolving against `document.baseURI` avoids that entirely and honours any
 * <base href> / asset prefix the host app uses.
 */
const absoluteFontsDirectory = (dir) => {
  if (!dir) {
    return dir;
  }

  // Already absolute (http://, https://, //cdn...) - MathLive handles these.
  if (/^(?:[a-z+]+:)?\/\//i.test(dir)) {
    return dir;
  }

  try {
    return new URL(dir, document.baseURI).href;
  } catch (e) {
    log('could not resolve fontsDirectory "%s": %s', dir, e && e.message);
    return null;
  }
};

/**
 * Tell the package where the MathLive fonts are served from.
 *
 * Call before `loadMathLive()`. Accepts an absolute URL, a root-relative path
 * (`/mathlive-fonts`) or a relative one; pass `null` to skip font loading and
 * fall back to system fonts.
 *
 * The fonts ship inside the `mathlive` package (`node_modules/mathlive/fonts`)
 * and must be copied into whatever the host app serves statically.
 *
 * @param {string|null} dir
 */
export const configureFonts = (dir) => {
  fontsDirectory = dir;

  if (mathlive) {
    mathlive.MathfieldElement.fontsDirectory = absoluteFontsDirectory(dir);
  }
};

/**
 * Custom macros for the pie-specific commands that the MathQuill fork
 * understood but stock LaTeX does not.
 *
 * Kept deliberately in sync with the MathJax macros in
 * @pie-lib/math-rendering (`render-math.js`) so the same latex renders the same
 * way in the editor and in the static renderer.
 */
export const PIE_MACROS = {
  parallelogram: '\\htmlData{pie-macro=parallelogram}{\\unicode{"25B1}}',
  overarc: '\\overparen{#1}',
  napprox: '\\not\\approx',
  nsim: '\\not\\sim',
  ncong: '\\not\\cong',
  nparallel: '\\not\\parallel',
  perpendicular: '\\perp',
  divide: '\\div',
  degree: '^{\\circ}',
  square: '\\unicode{"25A1}',
  longdiv: '\\htmlData{pie-macro=longdiv}{#1}',
  abs: '\\left|#1\\right|',
};

/**
 * Registry for `registerEmbed`.
 *
 * MathLive has no embed plugin system, so an embed is expressed as a macro that
 * expands to real LaTeX. `\htmlData{embed=<name>}` tags the rendered output so
 * consumers can target it with CSS exactly as they targeted the old
 * `htmlString` markup.
 *
 * Known embeds map to native constructs:
 *  - `newLine`    -> structural, handled by latex-bridge (`\displaylines` + `\\`)
 *  - `answerBlock`-> `\placeholder{}` (interactive, read via the prompts API)
 *
 * @type {Map<string, {factory: Function, latex: string}>}
 */
const embeds = new Map();

const KNOWN_EMBED_LATEX = {
  // newLine is structural: it is translated by latex-bridge before it ever
  // reaches MathLive, so the macro only needs to be harmless.
  newLine: '',
  answerBlock: '\\placeholder{}',
};

/**
 * Load MathLive. Resolves to undefined during SSR.
 * @returns {Promise<object|undefined>}
 */
export const loadMathLive = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!mathlive) {
    try {
      mathlive = await import('mathlive');
    } catch (e) {
      // MathLive is browser-only and ships an ESM-conditional exports map, so
      // the import can fail in test/SSR-ish runtimes. Fail soft: callers all
      // handle a missing instance (static rendering falls back to raw latex).
      log('MathLive could not be loaded: %s', e && e.message);
      return undefined;
    }

    // Always replace MathLive's relative `'./fonts/'` default: it throws
    // "Invalid base URL" when bundled. Either point at the host app's copy or
    // disable font loading, both of which are safe.
    if (fontsDirectory === undefined) {
      log(
        'no fontsDirectory configured - MathLive will use fallback fonts. ' +
          'Call configureFonts("/path/to/fonts") with a copy of node_modules/mathlive/fonts to enable them.',
      );
    }

    mathlive.MathfieldElement.fontsDirectory =
      fontsDirectory === undefined ? null : absoluteFontsDirectory(fontsDirectory);
  }

  return mathlive;
};

/**
 * Synchronous accessor for an already-loaded MathLive.
 * @returns {object|undefined}
 */
export const getMathLive = () => mathlive;

/**
 * The macro dictionary to hand to a mathfield: pie macros plus anything
 * registered through `registerEmbed`.
 *
 * @returns {object}
 */
export const getMacros = () => {
  const out = { ...PIE_MACROS };

  embeds.forEach(({ latex }, name) => {
    out[name] = `\\htmlData{embed=${name}}{${latex}}`;
  });

  return out;
};

/**
 * Register an embed. API-compatible with @pie-lib/math-input's `registerEmbed`
 * so existing callers do not change.
 *
 * MathQuill's factory returns `{ htmlString, text, latex }`. Only the
 * declarative parts survive: `latex` round-trips through a macro and the
 * styling hook becomes a `data-embed` attribute. Arbitrary DOM injection via
 * `htmlString` has no MathLive equivalent and is ignored.
 *
 * @param {string} name
 * @param {Function} factory
 */
export function registerEmbed(name, factory) {
  if (!name || typeof factory !== 'function') {
    return;
  }

  let definition = {};

  try {
    definition = factory() || {};
  } catch (e) {
    log('embed factory threw for "%s": %s', name, e.message);
  }

  const latex = Object.prototype.hasOwnProperty.call(KNOWN_EMBED_LATEX, name)
    ? KNOWN_EMBED_LATEX[name]
    : definition.mathliveLatex || '\\placeholder{}';

  if (!Object.prototype.hasOwnProperty.call(KNOWN_EMBED_LATEX, name) && !definition.mathliveLatex) {
    // Unknown third-party embed: degrade instead of throwing. `htmlString`
    // cannot be reproduced, so it renders as an editable slot.
    log(
      'embed "%s" is not natively supported by MathLive; rendering as a placeholder. ' +
        'Provide `mathliveLatex` in the factory result to control this.',
      name,
    );
  }

  embeds.set(name, { factory, latex });
}

/**
 * Embeds registered so far. Exposed for tests/diagnostics.
 * @returns {string[]}
 */
export const registeredEmbeds = () => Array.from(embeds.keys());

/** Reset the embed registry. Test helper. */
export const __resetEmbeds = () => embeds.clear();

/** Inject a stub MathLive instance. Test helper. */
export const __setMathLiveForTest = (stub) => {
  mathlive = stub;
};

/**
 * Render static math into an element. API-compatible with
 * @pie-lib/math-input's `applyStaticMath`.
 *
 * @param {HTMLElement} element
 * @param {string} [latex] assigned to the element before rendering
 * @param {object} [options] `{ macros }` overrides
 * @returns {HTMLElement|undefined} the element, for parity with the old return
 */
export function applyStaticMath(element, latex, options = {}) {
  if (!element || typeof window === 'undefined') {
    return undefined;
  }

  const ml = getMathLive();

  if (!ml) {
    log('applyStaticMath called before MathLive loaded - call loadMathLive() first');
    return undefined;
  }

  const source = latex === undefined || latex === null ? element.textContent : latex;

  element.innerHTML = ml.convertLatexToMarkup(toMathLive(source), {
    macros: { ...getMacros(), ...(options.macros || {}) },
  });

  return element;
}

/**
 * Convert latex to markup using the pie macro set. Used for keypad labels and
 * any read-only rendering that does not need a live mathfield.
 *
 * @param {string} latex
 * @param {object} [options]
 * @returns {string} HTML markup, or '' if MathLive is not loaded
 */
export function latexToMarkup(latex, options = {}) {
  const ml = getMathLive();

  if (!ml || !latex) {
    return '';
  }

  try {
    return ml.convertLatexToMarkup(toMathLive(latex), {
      macros: { ...getMacros(), ...(options.macros || {}) },
      ...options,
    });
  } catch (e) {
    log('convertLatexToMarkup failed for "%s": %s', latex, e.message);
    return '';
  }
}

export { NEWLINE_EMBED };
