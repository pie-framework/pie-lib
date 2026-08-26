# @pie-lib/math-input-mathlive

MathLive-backed math input. A drop-in alternative to `@pie-lib/math-input`, which
is built on the `@pie-framework/mathquill` fork.

Findings that motivated this package: [`../math-input/SPIKE-mathlive.md`](../math-input/SPIKE-mathlive.md).

## Migrating

The export surface mirrors `@pie-lib/math-input`, so in most cases only the
import changes:

```diff
-import { mq, keys, keysForGrade, HorizontalKeypad, registerEmbed, applyStaticMath } from '@pie-lib/math-input';
+import { mq, keys, keysForGrade, HorizontalKeypad, registerEmbed, applyStaticMath } from '@pie-lib/math-input-mathlive';
```

The field wrappers are exported as `mf`, with `mq` kept as an alias so existing
`mq.Input` / `mq.Static` call sites keep working.

### Behaviour differences

|                             | `@pie-lib/math-input`            | this package                                                                  |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| `mq.Input`                  | MathQuill `MathField`            | `<math-field>`                                                                |
| `mq.Static` (display)       | one `MQ.StaticMath` per instance | `convertLatexToMarkup`, no live instance                                      |
| `mq.Static` (answer blocks) | `innerFields`                    | prompts API (`getPrompts`/`getPromptValue`)                                   |
| `updateSpans()`             | patched MathQuill DOM            | **no-op** (kept for compatibility)                                            |
| `registerEmbed`             | MathQuill embed plugin           | macro + `\htmlData` shim, see below                                           |
| Loading                     | synchronous                      | **async** - `await loadMathLive()` before `applyStaticMath` / `latexToMarkup` |

### Content model is preserved

Stored latex keeps its MathQuill-era form, so items authored with either
implementation stay readable and `@pie-lib/math-rendering` needs no change.
Translation happens at the package boundary:

| stored                      | in MathLive             |
| --------------------------- | ----------------------- |
| `\embed{newLine}[]`         | `\displaylines{… \\ …}` |
| `\MathQuillMathField[id]{}` | `\placeholder[id]{}`    |

`toMathLive()` / `fromMathLive()` are exported if you need the conversion directly.

### `registerEmbed`

Same signature, different mechanism - MathLive has no embed plugin system, so an
embed becomes a macro that expands to real LaTeX, tagged with
`\htmlData{embed=<name>}` so CSS can target `[data-embed="<name>"]` the way it
used to target the embed's `htmlString`.

```js
registerEmbed('answerBlock', () => ({
  latex: () => '\\embed{answerBlock}[]',
  mathliveLatex: '\\placeholder{}', // optional: control the expansion
}));
```

`newLine` and `answerBlock` are handled natively. Any other name falls back to a
`\placeholder{}` and logs a warning.

**Limitation:** MathQuill's `htmlString` could inject an arbitrary DOM subtree.
`\htmlData` only decorates MathLive's own output, so embeds that mounted a custom
widget do not port and need a redesign (`mf.getElementInfo()` exposes per-element
`bounds`/`id`/`data` if you need to overlay something).

## Notes

- **Browser only.** MathLive registers custom elements; `loadMathLive()` returns
  `undefined` during SSR and every consumer degrades gracefully. Import the
  package client-side (see `packages/demo/pages/math-input-mathlive.js`).
- **Bundle.** The editor is ~227KB gzip plus ~296KB of KaTeX fonts, so it is
  loaded lazily via dynamic `import()`. Render-only consumers can use
  `mathlive/ssr` (~111KB gzip) through `latexToMarkup`.
- **Stylesheets: import both, once, in the host app.**

  ```js
  import 'mathlive/fonts.css'; // KaTeX @font-face rules
  import 'mathlive/static.css'; // REQUIRED for convertLatexToMarkup output
  ```

  `static.css` is not optional. Keypad labels and `mf.Static` in display mode are
  rendered with `convertLatexToMarkup`, whose output relies on
  `ML__vlist` / `ML__strut` / `ML__base` / `ML__sqrt-sign` / `ML__pstrut` and on
  `svg { position: absolute; width: 100% }`. Without the stylesheet, static math
  renders misaligned and stretchy accents (`\overrightarrow`,
  `\overleftrightarrow`, `\overarc`) expand without bound - a keypad button can
  end up stretching across the viewport. The keypad defends against the worst of
  this (`overflow: hidden` plus an svg rule on the label), but correct layout
  still needs the real stylesheet.

  Live `<math-field>` elements style themselves via shadow DOM and are unaffected.

  On fonts specifically, `fonts.css` is the recommended route - no copied files,
  no CDN:

  The stylesheet's relative `url(fonts/*.woff2)` paths are resolved by your
  bundler, so the fonts are emitted with the build and content-hashed. It also
  sets `--ML__static-fonts`, which makes MathLive skip font fetching entirely.

  This matters because MathLive's default `fontsDirectory` is the relative
  `'./fonts/'`, which it resolves against its own script URL - empty under a
  bundler, so `loadFonts` throws
  `Failed to construct 'URL': Invalid base URL`. Importing the stylesheet avoids
  that code path completely.

  _Bundler caveat:_ a `url-loader`/`file-loader` rule matching `woff2` will
  corrupt these fonts (it emits a JS module under a `.woff2` name). Exclude
  mathlive from such rules - see `packages/demo/next.config.js`.

  **Fonts are required, not cosmetic.** Some symbols are composed from Private
  Use Area glyphs that exist only in the KaTeX fonts: `\neq` is U+E020 (a
  negation slash) overlapped on `=`, and `\nsim` / `\ncong` are the same. With
  no fonts the browser substitutes an arbitrary glyph for U+E020, so those keys
  render as garbage rather than in a plainer face.

  **Alternative** - serve the fonts yourself (a static path, or a CDN):

  ```js
  import { configureFonts } from '@pie-lib/math-input-mathlive';

  configureFonts('/mathlive-fonts'); // before loadMathLive()
  configureFonts('https://unpkg.com/mathlive@0.110.0/fonts'); // note: /fonts, /dist/fonts 404s
  configureFonts(null); // opt out; \neq and friends will render incorrectly
  ```

  Paths are resolved to absolute URLs against `document.baseURI`.

  If you neither import the stylesheet nor call `configureFonts`, the package
  falls back to a **version-pinned CDN** - `https://unpkg.com/mathlive@<engine
version>/fonts` - so those glyph-dependent symbols still render. Serve the
  fonts yourself to avoid the third-party request.

- **Custom macros.** `PIE_MACROS` covers the pie-specific commands the MathQuill
  fork understood (`\parallelogram`, `\longdiv`, `\napprox`, …) and is kept in
  sync with the MathJax macros in `@pie-lib/math-rendering`.

## Development

```bash
nvm use --delete-prefix v22           # mathlive needs node >= 18
./node_modules/.bin/jest packages/math-input-mathlive/src
./node_modules/.bin/next dev packages/demo   # then /math-input-mathlive
```
