describe('mathlive-instance', () => {
  let instance;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line global-require
    instance = require('../mathlive-instance');
    instance.__resetEmbeds();
  });

  describe('registerEmbed', () => {
    it('registers a known embed and exposes it as a macro', () => {
      instance.registerEmbed('answerBlock', () => ({
        htmlString: '<div class="answerBlock"></div>',
        latex: () => '\\embed{answerBlock}[]',
      }));

      expect(instance.registeredEmbeds()).toEqual(['answerBlock']);
      // The macro tags output with data-embed so CSS can target it, replacing
      // MathQuill's htmlString hook.
      expect(instance.getMacros().answerBlock).toEqual('\\htmlData{embed=answerBlock}{\\placeholder{}}');
    });

    it('registers newLine as a harmless macro (it is handled by latex-bridge)', () => {
      instance.registerEmbed('newLine', () => ({ latex: () => '\\embed{newLine}[]' }));

      expect(instance.getMacros().newLine).toEqual('\\htmlData{embed=newLine}{}');
    });

    it('falls back to a placeholder for an unknown embed', () => {
      instance.registerEmbed('somethingCustom', () => ({ htmlString: '<b>x</b>' }));

      expect(instance.getMacros().somethingCustom).toEqual('\\htmlData{embed=somethingCustom}{\\placeholder{}}');
    });

    it('honours an explicit mathliveLatex from the factory', () => {
      instance.registerEmbed('custom', () => ({ mathliveLatex: '\\alpha' }));

      expect(instance.getMacros().custom).toEqual('\\htmlData{embed=custom}{\\alpha}');
    });

    it('does not throw when the factory throws', () => {
      expect(() =>
        instance.registerEmbed('bad', () => {
          throw new Error('boom');
        }),
      ).not.toThrow();

      expect(instance.registeredEmbeds()).toEqual(['bad']);
    });

    it('ignores bad arguments', () => {
      instance.registerEmbed(undefined, () => ({}));
      instance.registerEmbed('noFactory', undefined);

      expect(instance.registeredEmbeds()).toEqual([]);
    });

    it('always includes the pie macro set', () => {
      const macros = instance.getMacros();

      expect(macros.parallelogram).toBeDefined();
      expect(macros.longdiv).toBeDefined();
      expect(macros.napprox).toEqual('\\not\\approx');
    });

    // Argument-taking macros exist only so previously authored latex parses.
    // Editing never goes through them: MathLive serialises a macro from its
    // original arguments, so typed content never comes back out.
    it('argument-taking macros are plain parse-only definitions', () => {
      ['longdiv', 'overarc', 'abs'].forEach((name) => {
        expect(typeof instance.PIE_MACROS[name]).toBe('string');
        expect(instance.PIE_MACROS[name]).toContain('#1');
      });
    });

    it('argument-less symbols stay atomic', () => {
      ['perpendicular', 'square', 'degree', 'napprox', 'parallelogram'].forEach((name) => {
        expect(typeof instance.PIE_MACROS[name]).toBe('string');
      });
    });

    it('longdiv matches the MathJax macro used by math-rendering', () => {
      expect(instance.PIE_MACROS.longdiv).toEqual('\\enclose{longdiv}{#1}');
    });
  });

  describe('applyStaticMath', () => {
    it('returns undefined without an element', () => {
      expect(instance.applyStaticMath(null, 'x')).toBeUndefined();
    });

    it('defers (returns undefined) when MathLive has not loaded', () => {
      const el = document.createElement('div');

      expect(instance.applyStaticMath(el, 'x')).toBeUndefined();
    });

    it('renders synchronously once MathLive is available', () => {
      const el = document.createElement('div');

      instance.__setMathLiveForTest({ convertLatexToMarkup: (l) => `<span>${l}</span>` });

      expect(instance.applyStaticMath(el, '\\pi')).toBe(el);
      expect(el.innerHTML).toEqual('<span>\\pi</span>');
    });

    it('falls back to the element textContent when no latex is passed', () => {
      const el = document.createElement('div');

      el.textContent = '\\theta';
      instance.__setMathLiveForTest({ convertLatexToMarkup: (l) => `<i>${l}</i>` });
      instance.applyStaticMath(el);

      expect(el.innerHTML).toEqual('<i>\\theta</i>');
    });

    it('bridges stored latex (newLine embed) before rendering', () => {
      const el = document.createElement('div');

      instance.__setMathLiveForTest({ convertLatexToMarkup: (l) => l });
      instance.applyStaticMath(el, 'a\\embed{newLine}[]b');

      // \embed{newLine}[] must become a multiline environment
      expect(el.innerHTML).toContain('displaylines');
    });
  });

  describe('configureFonts', () => {
    // MathLive's default fontsDirectory is the relative './fonts/', which it
    // resolves against its own (empty, when bundled) script url and throws
    // "Invalid base URL" from loadFonts. Paths must become absolute.
    it('is exported and callable before MathLive loads', () => {
      expect(typeof instance.configureFonts).toBe('function');
      expect(() => instance.configureFonts('/mathlive-fonts')).not.toThrow();
    });

    it('accepts null to disable font loading', () => {
      expect(() => instance.configureFonts(null)).not.toThrow();
    });

    it('applies an absolute url to an already-loaded MathfieldElement', () => {
      const MathfieldElement = {};

      // simulate a loaded instance
      instance.__setMathLiveForTest({ MathfieldElement });
      instance.configureFonts('/mathlive-fonts');

      expect(MathfieldElement.fontsDirectory).toEqual(`${document.baseURI.replace(/\/$/, '')}/mathlive-fonts`);
      expect(MathfieldElement.fontsDirectory.startsWith('http')).toBe(true);
    });

    // \neq, \nsim and \ncong are built from Private Use Area glyphs that only
    // the KaTeX fonts contain, so "no fonts" renders garbage rather than
    // degrading gracefully - hence a CDN fallback by default.
    it('falls back to a version-pinned CDN when nothing is configured', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement, version: { mathlive: '9.9.9' } });
      instance.configureFonts(undefined);

      expect(MathfieldElement.fontsDirectory).toEqual('https://unpkg.com/mathlive@9.9.9/fonts');
    });

    it('uses /fonts, not /dist/fonts (the latter 404s on unpkg)', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement, version: { mathlive: '0.110.0' } });
      instance.configureFonts(undefined);

      expect(MathfieldElement.fontsDirectory).toEqual('https://unpkg.com/mathlive@0.110.0/fonts');
      expect(MathfieldElement.fontsDirectory).not.toContain('/dist/');
    });

    it('a configured path wins over the CDN', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement, version: { mathlive: '0.110.0' } });
      instance.configureFonts('/mathlive-fonts');

      expect(MathfieldElement.fontsDirectory).not.toContain('unpkg.com');
    });

    it('null still opts out entirely', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement, version: { mathlive: '0.110.0' } });
      instance.configureFonts(null);

      expect(MathfieldElement.fontsDirectory).toBeNull();
    });

    it('leaves a fully-qualified url untouched', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement });
      instance.configureFonts('https://cdn.example.com/fonts');

      expect(MathfieldElement.fontsDirectory).toEqual('https://cdn.example.com/fonts');
    });

    it('passes null through rather than resolving it', () => {
      const MathfieldElement = {};

      instance.__setMathLiveForTest({ MathfieldElement });
      instance.configureFonts(null);

      expect(MathfieldElement.fontsDirectory).toBeNull();
    });
  });

  // A live <math-field> renders in shadow DOM, so nothing in the page's
  // stylesheets reaches it - the stretchy-accent fix has to be injected there.
  /**
   * A keypad key like \frac inserts `\frac{#?}{#?}`; MathLive turns each `#?`
   * into a `\placeholder{}` atom and *selects* the first one. Measured in
   * Chromium: that atom is a leaf (its offsets are before/after, there is no
   * position inside), so MathLive renders NO caret element and shows only the
   * selection highlight - the box read as focused-but-dead. The caret is drawn
   * by our own shadow CSS, gated on a class so it is placeholder-specific.
   */
  describe('trackPlaceholderCaret', () => {
    const fakeField = (selection, latex) => {
      const classes = new Set();

      return {
        listeners: {},
        selection,
        selectionIsCollapsed: !selection,
        getValue: () => latex,
        classList: {
          toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)),
          contains: (name) => classes.has(name),
        },
        addEventListener(name, fn) {
          this.listeners[name] = fn;
        },
        removeEventListener(name) {
          delete this.listeners[name];
        },
      };
    };

    it('marks the host when a placeholder is selected', () => {
      const mf = fakeField({ ranges: [[1, 2]] }, '\\placeholder{}');

      instance.trackPlaceholderCaret(mf);

      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(true);
    });

    it('does not mark an ordinary selection', () => {
      const mf = fakeField({ ranges: [[0, 3]] }, 'x+1');

      instance.trackPlaceholderCaret(mf);

      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);
    });

    it('does not mark a collapsed selection, which has a real caret already', () => {
      const mf = fakeField(null, '\\placeholder{}');

      instance.trackPlaceholderCaret(mf);

      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);
    });

    it('leaves a named prompt alone - it takes a real caret inside', () => {
      const mf = fakeField({ ranges: [[1, 2]] }, '\\placeholder[r1]{}');

      instance.trackPlaceholderCaret(mf);

      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);
    });

    it('re-evaluates whenever the selection moves', () => {
      const mf = fakeField(null, '');

      instance.trackPlaceholderCaret(mf);
      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);

      // the caret lands on a placeholder
      mf.selection = { ranges: [[1, 2]] };
      mf.selectionIsCollapsed = false;
      mf.getValue = () => '\\placeholder{}';
      mf.listeners['selection-change']();
      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(true);

      // ...and moves off it again
      mf.selectionIsCollapsed = true;
      mf.listeners['selection-change']();
      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);
    });

    it('returns a teardown that detaches the listener', () => {
      const mf = fakeField(null, '');
      const off = instance.trackPlaceholderCaret(mf);

      expect(typeof mf.listeners['selection-change']).toEqual('function');
      off();
      expect(mf.listeners['selection-change']).toBeUndefined();
    });

    it('survives a field that throws while reading the selection', () => {
      const mf = fakeField({ ranges: [[1, 2]] }, '');

      mf.getValue = () => {
        throw new Error('detached');
      };

      expect(() => instance.trackPlaceholderCaret(mf)).not.toThrow();
      expect(mf.classList.contains(instance.PLACEHOLDER_CARET_CLASS)).toBe(false);
    });

    it('is a no-op without a field', () => {
      expect(instance.trackPlaceholderCaret(undefined)).toBeUndefined();
      expect(instance.trackPlaceholderCaret({})).toBeUndefined();
    });
  });

  describe('applyShadowStyles', () => {
    const host = () => {
      const el = document.createElement('div');

      el.attachShadow({ mode: 'open' });

      return el;
    };

    it('is a no-op without a shadow root', () => {
      expect(() => instance.applyShadowStyles(undefined)).not.toThrow();
      expect(() => instance.applyShadowStyles(document.createElement('div'))).not.toThrow();
    });

    it('injects the accent fix into the shadow root', () => {
      const el = host();

      instance.applyShadowStyles(el);

      const viaSheet = el.shadowRoot.__pieAccentSheet;
      const viaStyle = el.shadowRoot.querySelector('style[data-pie-accent]');
      const css = viaSheet ? 'adopted' : (viaStyle && viaStyle.textContent) || '';

      expect(viaSheet || viaStyle).toBeTruthy();

      if (viaStyle) {
        expect(css).toContain('margin-left:0 !important');
        // scoped so single-glyph accents keep their centring offset
        expect(css).toContain(':has(.ML__stretchy)');
      }
    });

    it('injects the placeholder caret rules', () => {
      const el = host();

      instance.applyShadowStyles(el);

      const viaStyle = el.shadowRoot.querySelector('style[data-pie-accent]');

      if (viaStyle) {
        const css = viaStyle.textContent;

        // gated on the host class, so an ordinary selection gets no caret
        expect(css).toContain(`:host(.${instance.PLACEHOLDER_CARET_CLASS})`);
        // MathLive's own blink keyframes and caret colour, already in this root
        expect(css).toContain('ML__caret-blink');
        expect(css).toContain('--_caret-color');
        // the innermost selected element only: MathLive marks a wrapper AND the
        // glyph span, which would otherwise render two carets
        expect(css).toContain('.ML__selected:not(:has(.ML__selected))');
      }
    });

    it('injects the radical index size fix', () => {
      const el = host();

      instance.applyShadowStyles(el);

      const viaStyle = el.shadowRoot.querySelector('style[data-pie-accent]');

      if (viaStyle) {
        const css = viaStyle.textContent;

        // MathLive's scriptscriptstyle index (an inline 50%) reads too small in
        // the authoring UI; a mathfield's shadow root needs its own copy of the
        // rule, since host styles do not cross the boundary. Compared against
        // the exported rule, so the size stays defined in one place.
        // eslint-disable-next-line global-require
        const { ROOT_INDEX_CSS } = require('../mf/common-styles');

        expect(ROOT_INDEX_CSS).toContain('.ML__sqrt-index >');
        expect(css).toContain(ROOT_INDEX_CSS);
      }
    });

    it('does not inject twice', () => {
      const el = host();

      instance.applyShadowStyles(el);
      instance.applyShadowStyles(el);

      const styles = el.shadowRoot.querySelectorAll('style[data-pie-accent]');

      // either one adopted sheet, or exactly one style node
      expect(el.shadowRoot.__pieAccentSheet ? 1 : styles.length).toBe(1);
    });
  });

  describe('latexToMarkup', () => {
    it('returns empty string when MathLive is not loaded', () => {
      expect(instance.latexToMarkup('\\pi')).toEqual('');
    });

    it('returns empty string for empty latex', () => {
      expect(instance.latexToMarkup('')).toEqual('');
    });
  });
});
