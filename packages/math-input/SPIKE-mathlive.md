# Spike findings: MathLive as a MathQuill replacement

**Branch:** `spike/PIE-mathlive` (throwaway — do not merge)
**MathLive version evaluated:** `0.110.0`
**Prototype:** `packages/demo/pages/math-input-mathlive.js` (route `/math-input-mathlive`)
**Plan:** `packages/math-input/SPIKE-mathlive-plan.md`

---

## 1. Recommendation (TL;DR)

**GO — build a dedicated `@pie-lib/math-input-mathlive` package**, behind a feature flag, with a compatibility shim layer. MathLive covers all five critical behaviors. The migration is feasible but **not a drop-in**: the keypad label styling and `updateSpans()` need real rework, `registerEmbed` needs a translation shim, and the bundle is heavier.

**One unresolved question gates the estimate:** whether any downstream pie-elements repo calls the public `registerEmbed` export (nothing in pie-lib does). See §4.1 — resolve this with a single grep before committing to a timeline.

Confidence is high for rendering/keypad/newline (validated headlessly here) and medium for editing/answer-blocks (validated by API/type inspection + the prototype page, but the live `<math-field>` interaction needs to be exercised in a browser — see §7).

---

## 2. What was validated, and how

| #   | Behavior                                 | Method                                                     | Result                                                                        |
| --- | ---------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | `<math-field>` editing                   | Prototype page + type-def inspection                       | ✅ API maps cleanly; needs browser to exercise interaction                    |
| 2   | Read-only / static render                | Headless `convertLatexToMarkup` + prototype                | ✅ Renders                                                                    |
| 3   | Keypad labels via `convertLatexToMarkup` | **Headless harness** — 14 real key LaTeX samples           | ✅ All 14 produce valid HTML                                                  |
| 4   | `\placeholder{}` answer blocks           | Type-def inspection + prototype                            | ⚠️ Works only in a live `<math-field>` (not in static markup) — needs browser |
| 5   | Newline (`\embed{newLine}[]`)            | **Headless harness** — displaylines + legacy normalisation | ✅ Native multiline works; legacy content normalises cleanly                  |

Headless harness results (using the `mathlive/ssr` build): **20/22 checks passed**; the 2 "failures" were incorrect assertions in the harness, not MathLive limitations:

- `convertLatexToMathMl` returns a MathML **fragment** (`<mrow>…`) without the `<math>` wrapper — correct behavior, just wrap it.
- `convertLatexToMarkup` renders `\placeholder{}` as **nothing** in static markup — the editable box is a live-`<math-field>` feature only (this is the key nuance for §6).

The demo page compiles and serves HTTP 200 (SSR shell). Getting it to render required fixing a React version split (§7).

---

## 3. API mapping (MathQuill → MathLive)

| Concern             | MathQuill (today)                                     | MathLive (`0.110`)                                                                                                     |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Editable field      | `MQ.MathField(el, {handlers:{edit}})`                 | `new MathfieldElement()` / `<math-field>`                                                                              |
| Read latex          | `mf.latex()`                                          | `mf.value` or `mf.getValue('latex')`                                                                                   |
| Set latex           | `mf.latex(str)`                                       | `mf.value = str` / `mf.setValue(str)`                                                                                  |
| Change event        | `handlers.edit` callback                              | `input` event (also `change` on commit)                                                                                |
| Insert command      | `mf.cmd(v)`                                           | `mf.executeCommand(['insert', v])`                                                                                     |
| Write latex         | `mf.write(v)`                                         | `mf.insert(v)`                                                                                                         |
| Keystroke           | `mf.keystroke(v)`                                     | `mf.executeCommand(['performWithFeedback', …])` / `mf.keystroke()`                                                     |
| Focus / blur        | `mf.focus()` / `mf.blur()`                            | same (`mf.focus()` / `mf.blur()`)                                                                                      |
| Static / read-only  | `MQ.StaticMath(el)`                                   | `mf.readOnly = true` **or** `convertLatexToMarkup(latex)` for pure display                                             |
| Keypad label markup | `styled(mq.Static)` (a MathQuill instance per button) | `convertLatexToMarkup(latex)` → HTML string (no instance per button)                                                   |
| Answer-block blank  | `\MathQuillMathField[r1]{}` + `mathField.innerFields` | `\placeholder[id]{}` + `mf.getPrompts()` / `mf.getPromptValue(id)` / `mf.getPromptRange(id)` / `mf.getPromptState(id)` |
| Sub-field change    | `onSubFieldChange(name, latex)`                       | `input` event → iterate `getPrompts()` → `getPromptValue(id)`                                                          |
| Sub-field focus     | DOM walk of `mathquill-block-id` (`static.jsx:260`)   | `focus-in`/selection events + `getPromptRange` (no DOM-attribute hack)                                                 |
| Custom embed        | `MQ.registerEmbed(name, factory)`                     | **No equivalent** — see §6                                                                                             |
| Static-math shim    | `applyStaticMath(el, latex, opts)`                    | `renderMathInElement(el)` / `convertLatexToMarkup`                                                                     |
| MathML (a11y)       | (math-rendering-accessible via MathJax)               | `convertLatexToMathMl(latex)` (fragment)                                                                               |

Attribute/property parity is documented in MathLive's own type defs (`mathfield-element.d.ts:313`), e.g. `read-only` ↔ `mf.readOnly`, `smart-mode` ↔ `mf.smartMode`.

---

## 4. Blockers & limitations

1. **No `registerEmbed`** — MathLive has no plugin embed system at all. But the blast radius is smaller than first assumed:

   **Inside pie-lib the scope is small and verified.** `mq/custom-elements.js:2` is the _only_ real `MQ.registerEmbed(...)` call in the entire repo, registering `newLine`. It re-expresses cleanly as `\\` inside `\displaylines{}` (validated — see §2). Nothing else in pie-lib registers an embed.

   **The open risk is external and currently unverified.** `registerEmbed` and `applyStaticMath` are public exports (`index.jsx:26-27`) with **zero callers inside pie-lib** — they exist solely for downstream consumers. The JSDoc at `mathquill-instance.js:13` says _"e.g. answer blocks in pie-elements"_ and `mathquill-instance.test.js:32` uses `'answerBlock'` as a fixture name, but **neither is proof of a live caller.**

   **Action required before sizing this:** grep the pie-elements repos for `registerEmbed(`. If an `answerBlock` embed is registered there, it must move to `\placeholder{}` + the prompts API — a cross-repo contract change that also touches the `%response%` authoring token (`math-toolbar/src/editor-and-pad.jsx:298`). If nothing calls it, this blocker largely evaporates and `registerEmbed` can degrade to a logged no-op.

2. **Keypad label styling is a rewrite.** Today each LaTeX label is a `styled(mq.Static)` with ~130 lines of hard-coded `.mq-*` selectors (`keypad/index.jsx:17-146`) tuning MathQuill glyphs. `convertLatexToMarkup` emits MathLive/KaTeX markup with entirely different class names — every one of those tuning selectors is dead and the visual tuning must be redone against MathLive's DOM.
3. **`updateSpans()` becomes obsolete.** It walks `span[mathquill-command-id]` (`updateSpans.js:3`) — those attributes don't exist in MathLive output. The `∥`-resize / prime-tagging fixups must be re-implemented (or dropped if MathLive renders them acceptably).
4. **Answer-block placeholders are interactive-only.** `\placeholder{}` renders as an editable box **only inside a live `<math-field>`**; `convertLatexToMarkup` renders it as nothing. So any static/print rendering of answer templates needs a different treatment than the editor.
5. **DOM-attribute hacks disappear (good, but requires rewrite).** `static.jsx` reaches into `field.__controller.cursor` internals and reads `mathquill-block-id` attributes. None of this exists in MathLive; the prompts API replaces it but the surrounding logic (`getFieldName`, announce/live-region) must be reworked.
6. **Own accessibility layer.** `static.jsx:76` builds a bespoke `aria-live` region for "Converted to math symbol" announcements. MathLive ships its own a11y/speech layer — parity and possible duplication must be checked.
7. **Bundle weight** (see §5).
8. **Two React copies in the demo caused SSR to 500** (§7) — an integration detail, not a MathLive defect, but worth knowing for the eventual package's peer-dep setup.

---

## 5. Bundle size

Measured from the installed `node_modules/mathlive@0.110.0`:

| Artifact                                                | Raw    | Gzip                 |
| ------------------------------------------------------- | ------ | -------------------- |
| `mathlive.min.mjs` (full editor)                        | 843 KB | **227 KB**           |
| `mathlive-ssr.min.mjs` (`convertLatexToMarkup`, no DOM) | 397 KB | **111 KB**           |
| KaTeX fonts (`fonts/`, woff2)                           | 296 KB | (already compressed) |

For comparison the current stack ships `@pie-framework/mathquill@1.2.1-beta.1` (a much smaller fork) plus MathJax only in `math-rendering`.

**Implications & levers:**

- The full editor is ~227 KB gzip + ~296 KB fonts — materially heavier than MathQuill. Acceptable if the field is lazy-loaded (as the prototype does via dynamic `import('mathlive')`), so it's off the critical path until a math input mounts.
- **Split the concerns.** Keypad labels and static rendering need only the SSR build (`mathlive/ssr`, ~111 KB gzip, no DOM). Consumers that only render (never edit) can avoid the full editor entirely.
- MathLive pulled in a heavy transitive dep, **`@cortex-js/compute-engine@0.58.0` (~21 MB on disk unpacked)**. It is used for math evaluation and is lazy/optional — confirm it is not eagerly bundled (the `.min.mjs` is self-contained at 843 KB, so compute-engine is not in the default editor bundle). Do not accidentally import it.
- Fonts must be served from the app bundle in production. The prototype points `MathfieldElement.fontsDirectory` at a CDN purely for the spike.

---

## 6. Recommendation for `registerEmbed` / `applyStaticMath`

Keep the **public export surface stable** (`registerEmbed`, `applyStaticMath` in `index.jsx:26`) so pie-elements consumers don't break, but reimplement underneath:

- **`applyStaticMath(el, latex, opts)`** → wrap `renderMathInElement` / set `el.innerHTML = convertLatexToMarkup(latex)`. Straightforward.
- **`registerEmbed(name, factory)`** → cannot be backed by a MathLive plugin. Provide a shim that translates _known_ embed names to LaTeX, and fails soft on the rest:
  - **`newLine`** (the only embed actually registered in pie-lib): translate `\embed{newLine}[]` ⇄ `\\` inside a `\displaylines{}` (validated: `a+b\embed{newLine}[]c` → `\displaylines{a + b \\ c}` renders). Crucially, **align with `math-rendering`**: `render-math.js:40,88` already converts `\embed{newLine}[]` → `\newline` for MathJax, so authored content keeps its `\embed{newLine}[]` on-disk form and each renderer normalises at its boundary. The editor just needs a serialize/parse pair (embed-token ⇄ multiline env).
  - **`answerBlock`** (_only if_ the pie-elements grep confirms a real caller — see §4.1): map to `\placeholder[id]{}` and expose values via the prompts API. This would change the authoring token flow (`%response%` in `math-toolbar/src/editor-and-pad.jsx:298`) and the consumer contract, needing a coordinated change with the pie-elements team.
  - **Any other name**: log a warning and no-op, so unknown third-party embeds degrade instead of throwing.

### 6.1 Can `registerEmbed` be made API-compatible? Yes — validated

The signature can stay **byte-for-byte identical** (`registerEmbed(name, factory)`), so no caller changes. The mechanism differs: instead of MathQuill's embed plugin, back it with three MathLive primitives — `mf.macros` (a `MacroDictionary`, `mathfield-element.d.ts:1082`), `\htmlData{}` / `\cssId{}` LaTeX extensions, and `mf.onExport` (`:1399`) for serialization.

Proven headlessly (6/6 checks) — `\htmlData{embed=answerBlock}{\placeholder[ans]{}}` renders and **emits `data-embed="answerBlock"` into the markup**, and `\cssId{blank-1}{…}` emits its id. So the old `htmlString` styling hook has a real equivalent: attach CSS to `[data-embed="…"]`.

| MathQuill factory field                     | MathLive equivalent                         | Ports?            |
| ------------------------------------------- | ------------------------------------------- | ----------------- |
| `latex: () => '\embed{name}[]'`             | macro entry + `onExport`                    | ✅ round-trips    |
| `text: () => …`                             | `getValue('plain-text')` / `onExport`       | ✅                |
| `htmlString` **as a styling hook**          | `\htmlData{embed=name}` → `data-embed` attr | ✅ validated      |
| `htmlString` **as arbitrary DOM injection** | —                                           | ❌ **hard limit** |

**The one thing that cannot be reproduced:** MathQuill's `htmlString` injects an _arbitrary DOM subtree_ as a leaf node. `\htmlData` only decorates MathLive's own rendered span — you cannot mount foreign markup (a custom widget, an `<input>`, an image) inside the formula. So:

- Embeds that are **structural** (`newLine`) → use native `\\` / `\displaylines`. ✅
- Embeds that are **interactive slots** (`answerBlock`) → use `\placeholder{}` + prompts API. ✅
- Embeds that **inject a custom widget** → will **not** port; needs a redesign (e.g. render the widget outside the field, or overlay it using `getElementInfo()` bounds, which returns `bounds`, `id` and `data` per element — `core-types.d.ts:345`).

Since `newLine` is the only embed pie-lib registers, and both known shapes fall in the ✅ rows, **an API-compatible `registerEmbed` is achievable** — pending the pie-elements grep in §4.1 to confirm no consumer relies on arbitrary-DOM injection.

- **`updateSpans`** → drop or reimplement against MathLive markup (§4.3).

Net: the exports survive as a thin compatibility layer, but `registerEmbed('answerBlock', …)` is the item that forces cross-repo coordination.

---

## 7. Running the prototype (and the React-split gotcha)

```
nvm use --delete-prefix v22 --silent        # mathlive needs node >= 18; repo default is v12
./node_modules/.bin/next dev packages/demo -p 3210
# open http://localhost:3210/math-input-mathlive
```

**React version split:** installing `mathlive` into `packages/demo` surfaced a React mismatch — root `node_modules/react` is `18.3.1` while `packages/demo/node_modules/react` pins `18.2.0`. Next 15 externalises `node_modules` on the server, so page files resolved `react@18.2.0` while hoisted `@mui` resolved `react@18.3.1`, producing `Cannot read properties of null (reading 'useMemo')` (invalid hook call) on SSR — affecting **all** content pages, not just the spike. Deduping to a single React (removing the nested `packages/demo/node_modules/react{,-dom}`) fixes it. The client-side alias in `next.config.js:61` only covers the client bundle, not server externals.

**Not verifiable in this environment:** no browser automation was available, so the _live_ `<math-field>` interactions (typing in behavior 1, clicking placeholder boxes in behavior 4) were validated by API/type inspection and the prototype wiring, not by driving the DOM. Recommended next step: open `/math-input-mathlive` in a browser and confirm editing + placeholder editing + `getPromptValue()` round-trips.

---

## 8. Suggested implementation shape (post-spike)

1. New package `@pie-lib/math-input-mathlive` mirroring `@pie-lib/math-input`'s exports (`mq.Input`, `mq.Static`, `HorizontalKeypad`, `keys`, `registerEmbed`, `applyStaticMath`).
2. Thin React wrapper around `MathfieldElement` (ref-based mount, `input`→`onChange`, `value` sync guarded to avoid controlled-component thrash — the analogue of `input.jsx:143`'s latex-equality `shouldComponentUpdate`).
3. Keypad rebuilt on `convertLatexToMarkup`; port/redo the glyph-tuning CSS against MathLive markup.
4. `registerEmbed` compatibility shim backed by `macros` + `\htmlData` + `onExport` (§6.1 — signature unchanged). First: grep pie-elements for real callers (§4.1).
5. Serve fonts from the bundle; lazy-load the editor; use `mathlive/ssr` where only rendering is needed.
6. Feature-flag it against the MathQuill implementation for A/B rollout.
