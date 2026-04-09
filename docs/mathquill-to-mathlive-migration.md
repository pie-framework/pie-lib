# MathQuill → MathLive migration plan

**Repository:** `pie-framework/pie-lib` (and coordinated changes in `pie-framework/pie-elements`, `pie-framework/mathquill`).

**Last reviewed:** 2026-04-07 (branch snapshot).

---

## Goals

- **Long term:** Replace MathQuill with [MathLive](https://cortexjs.io/mathlive/) for math editing and in-editor display, aligning with a modern stack (no jQuery).
- **Short term (done):** The `@pie-framework/mathquill` fork ships a small jQuery shim so apps do not depend on jQuery directly.
- **Display pipeline:** Keep **MathJax** (via `@pie-lib/math-rendering`) for authored/read-only math in the player and similar surfaces unless product later decides to consolidate rendering.

---

## Agreed approach (refined)

| Decision | Choice |
|----------|--------|
| Package strategy | Copy `@pie-lib/math-input` → **`@pie-lib/math-input-mathlive`**, preserve the public API. Consumers switch import + dependency when ready; legacy `math-input` stays publishable during transition. |
| Virtual keyboard | **Keep `HorizontalKeypad`** initially. Move to MathLive’s built-in keyboard only after accessibility / product decisions are finalized. |
| Rich text | **TipTap** (`editable-html-tip-tap`) is the primary integration target. **Slate** (`editable-html`) remains in the monorepo; treat MathLive migration for Slate as **out of scope** unless product requires it. |
| MathML → LaTeX | Continue using **`@pie-framework/mathml-to-latex`** where needed; MathLive does not replace that path. |

---

## Current architecture (pie-lib)

### Roles

- **MathQuill:** Interactive editing (`MQ.MathField`), static/in-editor math (`MQ.StaticMath`), custom embeds (`MQ.registerEmbed`), keypad labels (via `mq.Static`).
- **MathJax (`math-rendering`):** Typeset LaTeX in DOM; normalizes `\embed{newLine}[]` → `\newline` for compatibility with non–MathQuill output.

### Direct `@pie-framework/mathquill` usage in this repo

| Location | Role |
|----------|------|
| `packages/math-input/src/mq/input.jsx` | `MathQuill.getInterface(3)`, `MQ.MathField`, registers line-break embed (via `custom-elements`) |
| `packages/math-input/src/mq/static.jsx` | `MQ.StaticMath`, `\MathQuillMathField[rN]{...}` handling |
| `packages/math-input/src/mq/custom-elements.js` | `MQ.registerEmbed('newLine', ...)` |
| `packages/math-input/package.json` | Declares `@pie-framework/mathquill` |

**Dev-only** mathquill (tests / tooling): `packages/editable-html`, `packages/editable-html-tip-tap`, `packages/demo` (versions aligned with `math-input`, currently **`1.2.1-beta.1`**).

### Indirect consumers (pie-lib)

| Package | Depends on |
|---------|------------|
| `math-toolbar` | `@pie-lib/math-input` (`mq.Input`, `mq.Static`), heavy `.mq-*` styling, **`this.input.mathField`** / `__controller` usage in `editor-and-pad.jsx` |
| `editable-html-tip-tap` | `math-input`, `math-toolbar` |
| `editable-html` | Same (Slate path) |
| `demo` | Dynamic `require` of `math-input` to avoid SSR loading mathquill |

### Supporting files

- `__mocks__/@pie-framework/mathquill.js` — Jest mock.
- `pslb/pslb.config.js` — bundles `@pie-framework/mathquill` in the math-edit module.
- `packages/demo/next.config.js` — transpiles `@pie-framework/mathquill`.

### pie-elements (outside this repo)

`math-inline` and `math-templated` historically import `@pie-framework/mathquill` for **`registerEmbed('answerBlock')`** and **`MQ.StaticMath`**. **Phase 0** removes that direct dependency in favor of `@pie-lib/math-input` APIs.

---

## Migration status (this snapshot)

- **Phase 0a (pie-lib):** `registerEmbed` and `applyStaticMath` are implemented in `packages/math-input/src/mq/mathquill-instance.js` and exported from `packages/math-input/src/index.jsx`. MathQuill is initialized once there; `mq/input.jsx` and `mq/static.jsx` import shared `MQ`.
- **Phase 0b (pie-elements):** still to do — switch `math-inline` / `math-templated` / configure UI to these APIs and drop direct `@pie-framework/mathquill` imports.

---

## Phase 0 — Centralize the math engine (do this first)

**Objective:** `@pie-framework/mathquill` is imported only inside `@pie-lib/math-input` (plus mocks/tooling). pie-elements stops importing the fork directly.

### 0a. pie-lib — public API on `math-input`

1. Add **`registerEmbed(name, factory)`** — delegate to `MQ.registerEmbed` when `MQ` is available (same `typeof window !== 'undefined'` pattern as today).
2. Add **`applyStaticMath(element, latex)`** — set text/content as required, then call `MQ.StaticMath(element)` (match current pie-elements usage; adjust if they pass latex separately today).
3. Export both from **`packages/math-input/src/index.jsx`**.
4. **Unit tests** for the new exports (mock `@pie-framework/mathquill` at module boundary).

**Publish:** release a new `math-input` version so pie-elements can bump.

### 0b. pie-elements — remove direct fork imports

1. **`math-inline`:** `main.jsx` and `configure/src/general-config-block.jsx` — import `{ registerEmbed, applyStaticMath }` from `@pie-lib/math-input`; remove `@pie-framework/mathquill` from package deps.
2. **`math-templated`:** same pattern in `main.jsx`.
3. Update tests/mocks.

**Verification:**

```bash
# In pie-elements (after changes)
rg '@pie-framework/mathquill' packages/*/src/
# Expect: no matches in source (only lockfiles if any)
```

---

## Phase 1 — `@pie-lib/math-input-mathlive`

1. Copy `packages/math-input` → `packages/math-input-mathlive` (new package name in `package.json`).
2. Replace dependency: `mathlive` instead of `@pie-framework/mathquill`.
3. Reimplement internals:
   - **`mq/input.jsx`** — `<math-field>` / `MathfieldElement`, map `latex()`, `cmd` / `write` / `keystroke`, focus/blur.
   - **`mq/static.jsx`** — read-only math-field or `convertLatexToMarkup` where sub-fields are not needed; plan **`\MathQuillMathField[rN]{...}` → MathLive placeholders** for templated flows.
   - **`custom-elements.js` / newline** — macro or normalize `\embed{newLine}[]` → `\newline` (consistent with `math-rendering`).
   - **`registerEmbed` / `applyStaticMath`** — MathLive implementations (`\placeholder{}`, markup injection, or surrounding React chrome for answer blocks).
   - **Keypad labels** — prefer `convertLatexToMarkup` over per-button MathQuill instances.
   - **`updateSpans.js`** — re-evaluate against MathLive DOM; may become no-op or new selectors.
   - **`common-mq-styles.js`** — replace `.mq-*` with MathLive `.ML__*` (or equivalent) as needed.
4. Keep **`HorizontalKeypad`** and **`keys/`**; only the rendering path for LaTeX on keys changes.
5. Export surface **matches** `math-input` (including `registerEmbed`, `applyStaticMath`).

---

## Phase 2 — `math-toolbar`

1. Point dependency from `@pie-lib/math-input` → `@pie-lib/math-input-mathlive`.
2. Replace **all `.mq-*` styles** and **`utils.js`** DOM assumptions with MathLive structure.
3. Remove **deep MathQuill access** in `editor-and-pad.jsx` (`mathField.__controller.cursor`, synthetic `keydown`) — reimplement mixed-number / fraction behavior using **supported** MathLive APIs.

---

## Phase 3 — Consumers (pie-lib)

1. **`editable-html-tip-tap`** — switch to `math-input-mathlive`; adjust any MathQuill-specific CSS.
2. **`demo`** — imports + `next.config.js` transpile list (`mathlive` instead of `@pie-framework/mathquill` where applicable).
3. **`pslb/pslb.config.js`** — math-edit module includes `mathlive` instead of (or alongside) mathquill during transition.
4. **`editable-html` (Slate)** — only if still required by product; otherwise leave on legacy `math-input` until Slate is removed or deprecated.

**pie-elements:** bump to `math-input-mathlive` after pie-lib packages are stable.

---

## Phase 4 — Compatibility and data

- **Stored LaTeX:** Items may contain `\embed{answerBlock}`, `\embed{newLine}[]`, `\MathQuillMathField[...]`. Ensure **authoring + player** either normalize at load time or support both during a transition window.
- **MathJax:** Keep `math-rendering` behavior for player-facing HTML; editing stack changes do not require replacing MathJax immediately.

---

## Phase 5 — Cleanup

- Remove `@pie-framework/mathquill` from all `package.json` files that still list it.
- Remove or replace **`__mocks__/@pie-framework/mathquill.js`**.
- Archive or retire the **mathquill fork** when nothing depends on it.
- Optional: rename `math-input-mathlive` → `math-input` with a **major** version when consumers are gone.

---

## Risks and unknowns

| Area | Risk |
|------|------|
| **Answer block embeds** | MathQuill `registerEmbed` has no 1:1 MathLive equivalent; may need placeholders + React UI around the field. |
| **`\MathQuillMathField`** | Stored content; needs explicit conversion or MathLive feature parity. |
| **`updateSpans`** | Tied to `mathquill-command-id`; must be revalidated for MathLive output. |
| **math-toolbar** | Tight coupling to `.mq-*` and internal `__controller` APIs. |
| **Bundle size** | MathLive is larger than MathQuill; mitigate with lazy-loading (existing math-edit split helps). |
| **Visual regression** | Plan manual QA + optional screenshot tests around math editor and keypad. |

---

## Initial tickets (suggested sizing)

| # | Scope | Points | Notes |
|---|--------|--------|--------|
| 1 | `math-input`: `registerEmbed`, `applyStaticMath`, exports, tests | 2 | No consumer changes yet. |
| 2 | `math-inline` + configure: use new API, drop fork dep, tests | 3 | Two files + mocks. |
| 3 | `math-templated`: same as ticket 2 | 2 | Single main file pattern. |
| 4 | Spike: MathLive POC (field, static, placeholder, keypad label, newline) | 3 | Can run parallel to 1–3 after ticket 1 is merged (or in parallel if no API conflict). |

**Order:** 1 → 2 → 3; then 4 and Phase 1.

---

## Rough timeline (indicative)

| Phase | Effort |
|-------|--------|
| 0 | ~1–3 days engineering + review + publish |
| 1 | ~2–3 weeks |
| 2 | ~1 week |
| 3 | ~1 week (TipTap + demo + pie-elements bumps) |
| 4–5 | As needed for compat and cleanup |

---

## References

- Fork: `@pie-framework/mathquill` (jQuery shim, Interface v3).
- Internal audit and Q&A that shaped this document: Cursor chat / team notes (search for “Migration Plan: MathQuill → MathLive”, Phase 0 centralization).
