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

  describe('latexToMarkup', () => {
    it('returns empty string when MathLive is not loaded', () => {
      expect(instance.latexToMarkup('\\pi')).toEqual('');
    });

    it('returns empty string for empty latex', () => {
      expect(instance.latexToMarkup('')).toEqual('');
    });
  });
});
