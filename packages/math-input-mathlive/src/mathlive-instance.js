import debug from 'debug';
import { NEWLINE_EMBED, toMathLive, withVisibleEmptySlots } from './latex-bridge';

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
  // Argument-less symbols. Atomic is correct here: backspace should remove the
  // whole glyph, and there is nothing to type into.
  parallelogram: '\\htmlData{pie-macro=parallelogram}{\\unicode{"25B1}}',
  napprox: '\\not\\approx',
  nsim: '\\not\\sim',
  ncong: '\\not\\cong',
  nparallel: '\\not\\parallel',
  perpendicular: '\\perp',
  divide: '\\div',
  degree: '^{\\circ}',
  square: '\\unicode{"25A1}',

  // Argument-taking commands, kept ONLY so previously authored latex still
  // parses and renders. They are never used for editing: MathLive serialises a
  // macro from the arguments it was created with, so text typed inside the
  // expansion never comes back out of `getValue('latex')`. Anything entering a
  // mathfield is rewritten to the native equivalent first - see
  // `toNativeCommands` in latex-bridge.
  longdiv: '\\enclose{longdiv}{#1}',
  overarc: '\\overparen{#1}',
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

let loadWarned = false;

/** Apply post-load configuration exactly once. */
const configureLoaded = () => {
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

  injectCoreStylesheet();
};

/**
 * Ensure MathLive's "core" stylesheet is in the document.
 *
 * `convertLatexToMarkup` - which renders keypad labels and static math - does
 * NOT inject it, while `renderMathInElement` and live mathfields do. Without it
 * the generated markup is unstyled: glyphs misalign and the <svg> used by
 * stretchy accents lays out statically at an unbounded width.
 *
 * Hosts that can import CSS should `import 'mathlive/static.css'`. For bundles
 * that cannot handle CSS imports (pie-elements ships JS-only web components),
 * this triggers MathLive's own injection against a detached element, so the
 * styles come from MathLive itself rather than being duplicated here.
 */
const injectCoreStylesheet = () => {
  if (typeof document === 'undefined' || !mathlive || !mathlive.renderMathInElement) {
    return;
  }

  try {
    mathlive.renderMathInElement(document.createElement('span'));
  } catch (e) {
    log('could not trigger MathLive core stylesheet injection: %s', e && e.message);
  }
};

/**
 * Load MathLive synchronously when the bundler allows it.
 *
 * `require` keeps MathLive inside the host's bundle. An `import()` would make
 * webpack emit a separate chunk, and a deployment that does not serve that
 * chunk fails with a 404 at runtime - leaving every mathfield and keypad label
 * blank with no obvious cause. Being in the main bundle also makes the engine
 * available on first render, so callers that run synchronously (applyStaticMath,
 * keypad labels) work without a second pass.
 *
 * Returns undefined during SSR or if the module is genuinely unavailable.
 *
 * @returns {object|undefined}
 */
export const loadMathLiveSync = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!mathlive) {
    try {
      // eslint-disable-next-line global-require
      mathlive = require('mathlive');
      configureLoaded();
    } catch (e) {
      log('synchronous MathLive load unavailable: %s', e && e.message);
      return undefined;
    }
  }

  return mathlive;
};

/**
 * Load MathLive. Prefers the synchronous path; falls back to a dynamic import.
 * Resolves to undefined during SSR.
 *
 * @returns {Promise<object|undefined>}
 */
export const loadMathLive = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (mathlive) {
    return mathlive;
  }

  if (loadMathLiveSync()) {
    return mathlive;
  }

  try {
    mathlive = await import('mathlive');
    configureLoaded();
  } catch (e) {
    // Surface this once: a silent failure here renders every field and keypad
    // label blank, which is very hard to trace back to a module load.
    // Skipped under test, where jsdom cannot load the browser build.
    if (!loadWarned && process.env.NODE_ENV !== 'test') {
      loadWarned = true;
      // eslint-disable-next-line no-console
      console.warn(
        '[@pie-lib/math-input-mathlive] MathLive could not be loaded; math input will not render. ' +
          'If this is a bundling issue, ensure "mathlive" is resolvable from the host bundle. Cause: ' +
          (e && e.message),
      );
    }

    return undefined;
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
 * Callers written against MathQuill invoke this synchronously from lifecycle
 * methods, where MathLive (a dynamic import) may not have loaded yet. Rather
 * than silently rendering nothing, this kicks off the load and re-applies once
 * the engine is ready, so the element fills in on the next tick.
 *
 * @param {HTMLElement} element
 * @param {string} [latex] assigned to the element before rendering
 * @param {object} [options] `{ macros }` overrides
 * @returns {HTMLElement|undefined} the element, or undefined if deferred
 */
export function applyStaticMath(element, latex, options = {}) {
  if (!element || typeof window === 'undefined') {
    return undefined;
  }

  // Capture the source now: if we defer, the element's textContent may have
  // been overwritten by the time MathLive is ready.
  const source = latex === undefined || latex === null ? element.textContent : latex;
  const ml = getMathLive() || loadMathLiveSync();

  if (!ml) {
    log('applyStaticMath called before MathLive loaded - deferring until it is ready');

    loadMathLive().then((loaded) => {
      // The element may have been unmounted while loading.
      if (loaded && element.isConnected !== false) {
        applyStaticMath(element, source, options);
      }
    });

    return undefined;
  }

  element.innerHTML = ml.convertLatexToMarkup(withVisibleEmptySlots(toMathLive(source)), {
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
  // Try the synchronous load so the very first render can produce markup
  // instead of falling back to raw latex.
  const ml = getMathLive() || loadMathLiveSync();

  if (!ml || !latex) {
    return '';
  }

  try {
    // Empty groups render as nothing in static markup, so give them a visible
    // box. This covers every static path: keypad labels, mf.Static in display
    // mode, and applyStaticMath.
    return ml.convertLatexToMarkup(withVisibleEmptySlots(toMathLive(latex)), {
      macros: { ...getMacros(), ...(options.macros || {}) },
      ...options,
    });
  } catch (e) {
    log('convertLatexToMarkup failed for "%s": %s', latex, e.message);
    return '';
  }
}

export { NEWLINE_EMBED };
