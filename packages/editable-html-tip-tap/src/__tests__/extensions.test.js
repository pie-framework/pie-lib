import { buildExtensions, ALL_PLUGINS, DEFAULT_PLUGINS } from '../extensions';

describe('Extensions', () => {
  describe('ALL_PLUGINS', () => {
    it('contains all expected plugins', () => {
      expect(ALL_PLUGINS).toContain('bold');
      expect(ALL_PLUGINS).toContain('italic');
      expect(ALL_PLUGINS).toContain('underline');
      expect(ALL_PLUGINS).toContain('strikethrough');
      expect(ALL_PLUGINS).toContain('bulleted-list');
      expect(ALL_PLUGINS).toContain('numbered-list');
      expect(ALL_PLUGINS).toContain('image');
      expect(ALL_PLUGINS).toContain('math');
      expect(ALL_PLUGINS).toContain('languageCharacters');
      expect(ALL_PLUGINS).toContain('text-align');
      expect(ALL_PLUGINS).toContain('table');
      expect(ALL_PLUGINS).toContain('video');
      expect(ALL_PLUGINS).toContain('audio');
      expect(ALL_PLUGINS).toContain('responseArea');
      expect(ALL_PLUGINS).toContain('superscript');
      expect(ALL_PLUGINS).toContain('subscript');
      expect(ALL_PLUGINS).toContain('h3');
      expect(ALL_PLUGINS).toContain('blockquote');
      expect(ALL_PLUGINS).toContain('undo');
      expect(ALL_PLUGINS).toContain('redo');
    });
  });

  describe('DEFAULT_PLUGINS', () => {
    it('excludes responseArea, h3, and blockquote', () => {
      expect(DEFAULT_PLUGINS).not.toContain('responseArea');
      expect(DEFAULT_PLUGINS).not.toContain('h3');
      expect(DEFAULT_PLUGINS).not.toContain('blockquote');
    });

    it('contains basic formatting plugins', () => {
      expect(DEFAULT_PLUGINS).toContain('bold');
      expect(DEFAULT_PLUGINS).toContain('italic');
      expect(DEFAULT_PLUGINS).toContain('underline');
    });
  });

  describe('buildExtensions', () => {
    it('returns an array when called with default parameters', () => {
      const result = buildExtensions(DEFAULT_PLUGINS, [], {});
      expect(Array.isArray(result)).toBe(true);
    });

    it('includes only active extensions', () => {
      const activeExtensions = ['bold', 'italic'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toEqual(['bold', 'italic']);
    });

    it('filters out undefined values', () => {
      const result = buildExtensions(['bold', 'italic'], [], {});
      expect(result.every((item) => item !== undefined)).toBe(true);
    });

    it('excludes image plugin when opts.image.onDelete is not provided', () => {
      const activeExtensions = ['image'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).not.toContain('image');
    });

    it('includes image plugin when opts.image.delete is provided', () => {
      const activeExtensions = ['image'];
      const opts = { image: { delete: jest.fn() } };
      const result = buildExtensions(activeExtensions, [], opts);
      expect(result).toContain('image');
    });

    it('excludes math plugin when opts.math is not provided', () => {
      const activeExtensions = ['math'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).not.toContain('math');
    });

    it('includes math plugin when opts.math is provided', () => {
      const activeExtensions = ['math'];
      const opts = { math: {} };
      const result = buildExtensions(activeExtensions, [], opts);
      expect(result).toContain('math');
    });

    it('excludes responseArea plugin when opts.responseArea.type is not provided', () => {
      const activeExtensions = ['responseArea'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).not.toContain('responseArea');
    });

    it('includes responseArea plugin when opts.responseArea.type is provided', () => {
      const activeExtensions = ['responseArea'];
      const opts = { responseArea: { type: 'explicit-constructed-response' } };
      const result = buildExtensions(activeExtensions, [], opts);
      expect(result).toContain('responseArea');
    });

    it('excludes css plugin when opts.extraCSSRules is empty', () => {
      const activeExtensions = ['css'];
      const result = buildExtensions(activeExtensions, [], { extraCSSRules: {} });
      expect(result).not.toContain('css');
    });

    it('includes css plugin when opts.extraCSSRules has values', () => {
      const activeExtensions = ['css'];
      const opts = { extraCSSRules: { color: 'red' } };
      const result = buildExtensions(activeExtensions, [], opts);
      expect(result).toContain('css');
    });

    it('excludes html plugin when opts.html is not provided', () => {
      const activeExtensions = ['html'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).not.toContain('html');
    });

    it('includes html plugin when opts.html is provided', () => {
      const activeExtensions = ['html'];
      const opts = { html: true };
      const result = buildExtensions(activeExtensions, [], opts);
      expect(result).toContain('html');
    });

    it('handles languageCharacters plugins array', () => {
      const activeExtensions = ['languageCharacters'];
      const opts = {
        languageCharacters: [
          { label: 'Greek', value: 'greek' },
          { label: 'Cyrillic', value: 'cyrillic' },
        ],
      };
      const result = buildExtensions(activeExtensions, [], opts);
      // Should include languageCharacters for each item in the array
      const languageCharsCount = result.filter((item) => item === 'languageCharacters').length;
      expect(languageCharsCount).toBe(2);
    });

    it('uses DEFAULT_PLUGINS when activeExtensions is not provided', () => {
      const result = buildExtensions(null, [], {});
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('includes list plugins', () => {
      const activeExtensions = ['bulleted-list', 'numbered-list'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('bulleted-list');
      expect(result).toContain('numbered-list');
    });

    it('includes undo and redo plugins', () => {
      const activeExtensions = ['undo', 'redo'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('undo');
      expect(result).toContain('redo');
    });

    it('includes text formatting plugins', () => {
      const activeExtensions = ['superscript', 'subscript', 'strikethrough', 'underline'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('superscript');
      expect(result).toContain('subscript');
      expect(result).toContain('strikethrough');
      expect(result).toContain('underline');
    });

    it('includes media plugins', () => {
      const activeExtensions = ['video', 'audio'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('video');
      expect(result).toContain('audio');
    });

    it('includes table plugin', () => {
      const activeExtensions = ['table'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('table');
    });

    it('includes text-align plugin', () => {
      const activeExtensions = ['text-align'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('text-align');
    });

    it('includes blockquote and h3 plugins when in active list', () => {
      const activeExtensions = ['blockquote', 'h3'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).toContain('blockquote');
      expect(result).toContain('h3');
    });

    it('filters out inactive extensions', () => {
      const activeExtensions = ['bold'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result).not.toContain('italic');
      expect(result).not.toContain('underline');
    });

    it('maintains order of extensions', () => {
      const activeExtensions = ['table', 'bold', 'italic'];
      const result = buildExtensions(activeExtensions, [], {});
      expect(result.indexOf('table')).toBeLessThan(result.indexOf('bold'));
      expect(result.indexOf('bold')).toBeLessThan(result.indexOf('italic'));
    });
  });
});
