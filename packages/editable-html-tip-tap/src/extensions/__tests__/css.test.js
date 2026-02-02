import { CSSMark, removeDialogs } from '../css';

jest.mock('@tiptap/core', () => ({
  Mark: { create: jest.fn((config) => config) },
  mergeAttributes: jest.fn((...args) => Object.assign({}, ...args)),
}));

jest.mock('react-dom', () => ({
  render: jest.fn(),
}));

describe('CSSMark', () => {
  describe('configuration', () => {
    it('has correct name', () => {
      expect(CSSMark.name).toBe('cssmark');
    });
  });

  describe('addOptions', () => {
    it('returns default options with empty classes array', () => {
      const options = CSSMark.addOptions();

      expect(options).toHaveProperty('classes');
      expect(Array.isArray(options.classes)).toBe(true);
      expect(options.classes).toHaveLength(0);
    });
  });

  describe('addAttributes', () => {
    it('returns class attribute configuration', () => {
      const attributes = CSSMark.addAttributes();

      expect(attributes).toHaveProperty('class');
      expect(attributes.class).toHaveProperty('default', null);
      expect(attributes.class).toHaveProperty('parseHTML');
      expect(attributes.class).toHaveProperty('renderHTML');
      expect(typeof attributes.class.parseHTML).toBe('function');
      expect(typeof attributes.class.renderHTML).toBe('function');
    });

    it('parseHTML extracts class attribute', () => {
      const attributes = CSSMark.addAttributes();
      const mockEl = {
        getAttribute: jest.fn((attr) => (attr === 'class' ? 'my-class' : null)),
      };

      const result = attributes.class.parseHTML(mockEl);

      expect(result).toBe('my-class');
      expect(mockEl.getAttribute).toHaveBeenCalledWith('class');
    });

    it('renderHTML returns empty object when no class', () => {
      const attributes = CSSMark.addAttributes();
      const result = attributes.class.renderHTML({ class: null });

      expect(result).toEqual({});
    });

    it('renderHTML returns class when present', () => {
      const attributes = CSSMark.addAttributes();
      const result = attributes.class.renderHTML({ class: 'my-class' });

      expect(result).toEqual({ class: 'my-class' });
    });
  });

  describe('parseHTML', () => {
    beforeEach(() => {
      CSSMark.options = { classes: ['allowed-class', 'another-class'] };
    });

    it('returns array with span[class] selector', () => {
      const rules = CSSMark.parseHTML();

      expect(Array.isArray(rules)).toBe(true);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toHaveProperty('tag', 'span[class]');
      expect(rules[0]).toHaveProperty('getAttrs');
    });

    it('matches allowed classes', () => {
      const rules = CSSMark.parseHTML();
      const mockEl = {
        getAttribute: jest.fn(() => 'allowed-class some-other'),
      };

      const result = rules[0].getAttrs(mockEl);

      expect(result).toEqual({ class: 'allowed-class' });
    });

    it('returns false for non-allowed classes', () => {
      const rules = CSSMark.parseHTML();
      const mockEl = {
        getAttribute: jest.fn(() => 'not-allowed'),
      };

      const result = rules[0].getAttrs(mockEl);

      expect(result).toBe(false);
    });

    it('handles empty class attribute', () => {
      const rules = CSSMark.parseHTML();
      const mockEl = {
        getAttribute: jest.fn(() => ''),
      };

      const result = rules[0].getAttrs(mockEl);

      expect(result).toBe(false);
    });
  });

  describe('renderHTML', () => {
    it('returns span with merged attributes', () => {
      const result = CSSMark.renderHTML({
        HTMLAttributes: { class: 'my-class' },
      });

      expect(result[0]).toBe('span');
      expect(result[1]).toEqual({ class: 'my-class' });
      expect(result[2]).toBe(0);
    });
  });

  describe('addCommands', () => {
    it('returns setCSSClass command', () => {
      const commands = CSSMark.addCommands();

      expect(commands).toHaveProperty('setCSSClass');
      expect(typeof commands.setCSSClass).toBe('function');
    });

    it('returns unsetCSSClass command', () => {
      const commands = CSSMark.addCommands();

      expect(commands).toHaveProperty('unsetCSSClass');
      expect(typeof commands.unsetCSSClass).toBe('function');
    });

    it('returns openCSSClassDialog command', () => {
      const commands = CSSMark.addCommands();

      expect(commands).toHaveProperty('openCSSClassDialog');
      expect(typeof commands.openCSSClassDialog).toBe('function');
    });

    it('setCSSClass sets mark with class name', () => {
      const context = { name: 'cssmark' };
      const commands = CSSMark.addCommands.call(context);
      const mockCommands = {
        setMark: jest.fn(() => true),
      };

      const result = commands.setCSSClass('my-class')({ commands: mockCommands });

      expect(mockCommands.setMark).toHaveBeenCalledWith('cssmark', { class: 'my-class' });
      expect(result).toBe(true);
    });

    it('unsetCSSClass unsets mark', () => {
      const context = { name: 'cssmark' };
      const commands = CSSMark.addCommands.call(context);
      const mockCommands = {
        unsetMark: jest.fn(() => true),
      };

      const result = commands.unsetCSSClass()({ commands: mockCommands });

      expect(mockCommands.unsetMark).toHaveBeenCalledWith('cssmark');
      expect(result).toBe(true);
    });
  });
});

describe('removeDialogs', () => {
  it('removes all elements with insert-css-dialog class', () => {
    const mockElements = [{ remove: jest.fn() }, { remove: jest.fn() }];

    document.querySelectorAll = jest.fn(() => mockElements);

    removeDialogs();

    expect(document.querySelectorAll).toHaveBeenCalledWith('.insert-css-dialog');
    expect(mockElements[0].remove).toHaveBeenCalled();
    expect(mockElements[1].remove).toHaveBeenCalled();
  });

  it('handles no dialogs gracefully', () => {
    document.querySelectorAll = jest.fn(() => []);

    expect(() => removeDialogs()).not.toThrow();
  });
});
