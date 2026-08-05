# Spike: Validate MathLive as a MathQuill replacement (`packages/math-input`)

## Context

`packages/math-input` (`@pie-lib/math-input@8.1.0`) is built on the `@pie-framework/mathquill@1.2.1-beta.1` fork. MathQuill is aging, hard to extend, and the fork is a maintenance liability. Before committing to build a dedicated `math-input-mathlive` package, we need evidence that MathLive (`<math-field>`) can cover the five behaviors this repo depends on today. This spike produces a **throwaway prototype** and a **findings doc** — no production code, no changes to the shipping `math-input` package. The output is a go/no-go recommendation plus an API mapping to de-risk the eventual implementation.

### What MathQuill does for us today (the surface MathLive must match)

Traced integration points (all in `packages/math-input/src`):

| Behavior                              | Current MathQuill implementation                                                                                                                                                                                                                                                                             | File                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Editable field**                    | `MQ.MathField(el, {handlers:{edit}})`; `.latex()`, `.cmd()`, `.write()`, `.keystroke()`, `.focus()/.blur()`                                                                                                                                                                                                  | `mq/input.jsx`                                                                               |
| **Static / read-only render**         | `MQ.StaticMath(el)`; `parseLatex`/`latex()`                                                                                                                                                                                                                                                                  | `mq/static.jsx:209`                                                                          |
| **Keypad button labels**              | `styled(mq.Static)` renders each key's LaTeX (`LatexButtonContent`)                                                                                                                                                                                                                                          | `keypad/index.jsx:17`, `keypad/index.jsx:393`                                                |
| **Answer blocks (fill-in-the-blank)** | `\MathQuillMathField[r1]{}` inner fields via `mathField.innerFields`, `getFieldName`, `onSubFieldChange`, `onSubFieldFocus`. Authoring inserts a `%response%`/`answerBlock` token; the `answerBlock` embed itself is registered by **external pie-elements consumers** via `registerEmbed('answerBlock', …)` | `mq/static.jsx` (regex `:8`, fallback `:222`), `math-toolbar/src/editor-and-pad.jsx:298,393` |
| **Newline embed**                     | `MQ.registerEmbed('newLine', …)` → `<div class="newLine">` / `\embed{newLine}[]` (registered internally at bootstrap)                                                                                                                                                                                        | `mq/custom-elements.js`, `mathquill-instance.js:8`                                           |
| **Post-render DOM fixups**            | `updateSpans()` walks `span[mathquill-command-id]` to resize `∥` and tag primes — coupled to MathQuill markup                                                                                                                                                                                                | `updateSpans.js:3`                                                                           |
| **Public shims for pie-elements**     | `registerEmbed`, `applyStaticMath` exported. `registerEmbed` has **two** real callers: internal `newLine` and external `answerBlock`                                                                                                                                                                         | `mq/mathquill-instance.js`, `index.jsx:26`                                                   |

Downstream, static prose rendering is **MathJax** (`@pie-lib/math-rendering@5.0.2`, `mathjax-full@3.2.2`), which converts `\embed{newLine}[]` → `\newline ` at `packages/math-rendering/src/render-math.js:40,88`. Consumers of `math-input` include `packages/math-toolbar`, `packages/editable-html/src/plugins/respArea/math-templated`, and `packages/editable-html-tip-tap`. The newline strategy must stay consistent between the editor (math-input) and the renderer (math-rendering) so authored content round-trips.

### MathLive capabilities confirmed (research, MathLive ~0.110)

- **Prompts / fill-in-the-blank**: native `\placeholder{}` + `getPrompts(filter?)`, `getPromptValue(id, format?)`, `getPromptRange(id)`, `getPromptState`, and a `placeholder` attribute. This is the direct analogue to `\MathQuillMathField`.
- **`convertLatexToMarkup(latex)`**: static export that returns HTML markup — the intended replacement for `styled(mq.Static)` keypad labels (no live mathfield instance per button).
- **Static/read-only**: `read-only` attribute / `mf.readOnly`, plus `renderMathInElement` / `convertLatexToMarkup` for pure display.
- **Multiline**: supported via `\displaylines{}`, `\\`, `gather`, `align` environments — but there is **no `registerEmbed` equivalent**. The newline strategy must be re-thought (map `\embed{newLine}[]` ↔ `\\`/`\displaylines`).
- **Bundle size**: notably large (~728 KB minified, bundled fonts) vs. the MathQuill fork — a real evaluation axis, not a footnote.

## Goal / Scope

Throwaway prototype only. Do **not** modify `packages/math-input/src`, `packages/math-rendering`, or any consumer. All spike code is disposable and lives behind a demo page (and/or a scratch branch) so it can be deleted wholesale.

## Approach

### 1. Prototype harness

- Add `mathlive` as a **devDependency of `packages/demo`** only (the demo app is already the sandbox for `math-input` at `packages/demo/pages/math-input.js`).
- Create a single throwaway page `packages/demo/pages/math-input-mathlive.js` with one section per behavior below. MathLive must be `require`d/imported client-side only (guard with `typeof window !== 'undefined'`), mirroring how `math-input.js` already lazy-requires `@pie-lib/math-input` to dodge SSR `window is not defined`.
- Do all work on a scratch branch (e.g. `spike/PIE-mathlive`) so it never merges.

### 2. Behaviors to validate (one demo section each)

1. **`<math-field>` editing** — mount an editable field, wire the `input`/`change` events, read/write LaTeX via `mf.value` / `mf.getValue('latex')` / `mf.setValue()`. Verify parity with `mq.Input`: programmatic insert (`mf.insert(latex)` vs `.write`/`.cmd`), focus/blur, and that controlled-component updates don't fight the field (the `shouldComponentUpdate` latex-equality guard in `input.jsx:143` will need an equivalent).
2. **Read-only / static rendering** — render fixed LaTeX with `read-only` and compare visual output + DOM cost against `mq.Static`. Confirm it survives the same inputs the current `Static.update()` fallback guards against (`static.jsx:216`).
3. **Keypad labels via `convertLatexToMarkup`** — render a representative sample of real key LaTeX (pull from `packages/math-input/src/keys/*`, e.g. `\parallel`, `\overleftrightarrow{\overline{}}`, fractions, sub/sup) through `convertLatexToMarkup` into a button and compare against `LatexButtonContent` (`keypad/index.jsx:17`). Note styling hooks lost (MathQuill `.mq-*` class selectors used for scaling won't exist).
4. **`\placeholder{}` for answer blocks** — replicate the `math-templated` respArea scenario: a read-only expression containing multiple editable prompts. Validate `getPrompts()`/`getPromptValue()` map onto the current `innerFields` + `getFieldName` + `onSubFieldChange`/`onSubFieldFocus` contract (`static.jsx:126,260`). Confirm per-prompt focus events and per-prompt value change events are obtainable. **Also cover the external `answerBlock` case**: today pie-elements register their own `answerBlock` embed via `registerEmbed` and authoring emits a `%response%` token (`editor-and-pad.jsx:298`); determine how that maps to `\placeholder{}` (distinct from the `newLine` embed) and whether authoring must change.
5. **Newline strategy** — test `\\` inside `\displaylines{}` (and/or `align`) as the replacement for `\embed{newLine}[]`. Define the round-trip: what the editor emits vs. what `math-rendering` (`render-math.js`) must accept. Prototype a `latex-in → latex-out` normalization so authored content created under MathQuill (`\embed{newLine}[]`) still renders.

### 3. API mapping to produce (MathQuill → MathLive)

Fill in a table covering at least: `MathField`→`<math-field>`; `.latex()` get/set → `.value`/`.getValue`/`.setValue`; `.cmd`/`.write`/`.keystroke` → `.insert`/`.executeCommand`; `.focus`/`.blur` → same; `edit` handler → `input`/`change` events; `StaticMath` → `read-only` / `convertLatexToMarkup`; `innerFields`/`\MathQuillMathField` → prompts API/`\placeholder{}`; `registerEmbed('newLine')` → **no equivalent** (document the substitute); `applyStaticMath` → what shim shape replaces it.

## Deliverables (Acceptance Criteria)

A findings doc committed on the scratch branch at `packages/math-input/SPIKE-mathlive.md` containing:

1. **API mapping table** (MathQuill → MathLive) as above.
2. **Blockers / limitations** — concretely: no `registerEmbed` (breaks both `newLine` and the external `answerBlock` extension point); keypad label styling classes lost (dozens of hard-coded `.mq-*` selectors in `keypad/index.jsx`); `updateSpans()` DOM fixups have no target in MathLive markup; multiline caveats; controlled-component/React-18 wrapper friction; accessibility/live-region parity (current `static.jsx` builds its own aria-live region at `:76`, and MathLive has its own a11y layer).
3. **Bundle-size considerations** — measured mathlive footprint (min + gzip, incl. fonts) vs. current `@pie-framework/mathquill`; note tree-shakeability of `convertLatexToMarkup`-only usage and font-loading strategy.
4. **Recommendation for `registerEmbed` / `applyStaticMath`** — how the two public exports (`index.jsx:26`) would be reimplemented (or deprecated) on MathLive so pie-elements consumers keep working. Must address **both** `registerEmbed` callers: the internal `newLine` (→ `\\`/`\displaylines` normalization aligned with `math-rendering`) and the external `answerBlock` extension point (→ `\placeholder{}` + prompts API, and whether the `%response%` authoring token in `math-toolbar` survives). Note `updateSpans()` likely becomes obsolete.
5. **Go / no-go recommendation** for building a dedicated `math-input-mathlive` package.

## Verification

Since this is a spike, "verification" = the prototype demonstrably exercises each behavior, not passing tests:

- Run the demo app (`packages/demo`) and open `/math-input-mathlive`; confirm each of the 5 sections renders and is interactive.
- For editing/answer-blocks: type/click and confirm LaTeX out matches expectation in an on-page readout.
- For keypad labels: visually diff the `convertLatexToMarkup` buttons against the existing `/math-input` page keypad.
- For newline: paste legacy `\embed{newLine}[]` content and confirm the normalization renders multi-line.
- Capture measurements (bundle size, screenshots) directly into `SPIKE-mathlive.md`.

## Out of scope / non-goals

- No changes to production `math-input`, `math-rendering`, or consumers.
- No new `math-input-mathlive` package (this spike only decides whether to build it).
- No test suite, no CI wiring — throwaway branch, delete after decision.
