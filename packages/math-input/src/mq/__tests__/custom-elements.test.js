import { registerLineBreak } from '../custom-elements';

describe('custom-elements', () => {
  describe('registerLineBreak', () => {
    let mockMQ;
    let mockRegisterEmbed;
    let embedCallback;

    beforeEach(() => {
      mockRegisterEmbed = jest.fn((name, callback) => {
        embedCallback = callback;
      });

      mockMQ = {
        registerEmbed: mockRegisterEmbed,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
      embedCallback = null;
    });

    it('should call MQ.registerEmbed with "newLine" as the embed name', () => {
      registerLineBreak(mockMQ);

      expect(mockRegisterEmbed).toHaveBeenCalledTimes(1);
      expect(mockRegisterEmbed).toHaveBeenCalledWith('newLine', expect.any(Function));
    });

    it('should register an embed callback function', () => {
      registerLineBreak(mockMQ);

      expect(embedCallback).toBeDefined();
      expect(typeof embedCallback).toBe('function');
    });

    describe('newLine embed configuration', () => {
      let embedConfig;

      beforeEach(() => {
        registerLineBreak(mockMQ);
        embedConfig = embedCallback();
      });

      it('should return a configuration object with all required properties', () => {
        expect(embedConfig).toHaveProperty('htmlString');
        expect(embedConfig).toHaveProperty('text');
        expect(embedConfig).toHaveProperty('latex');
      });

      it('should return htmlString with newLine div', () => {
        expect(embedConfig.htmlString).toBe('<div class="newLine"></div>');
      });

      it('should return text function that returns "testText"', () => {
        expect(embedConfig.text).toBeDefined();
        expect(typeof embedConfig.text).toBe('function');
        expect(embedConfig.text()).toBe('testText');
      });

      it('should return latex function that returns embed syntax', () => {
        expect(embedConfig.latex).toBeDefined();
        expect(typeof embedConfig.latex).toBe('function');
        expect(embedConfig.latex()).toBe('\\embed{newLine}[]');
      });

      it('should return consistent values on multiple calls', () => {
        const firstCall = embedCallback();
        const secondCall = embedCallback();

        expect(firstCall.htmlString).toBe(secondCall.htmlString);
        expect(firstCall.text()).toBe(secondCall.text());
        expect(firstCall.latex()).toBe(secondCall.latex());
      });

      it('should have text function that returns the same value on multiple invocations', () => {
        expect(embedConfig.text()).toBe('testText');
        expect(embedConfig.text()).toBe('testText');
        expect(embedConfig.text()).toBe('testText');
      });

      it('should have latex function that returns the same value on multiple invocations', () => {
        expect(embedConfig.latex()).toBe('\\embed{newLine}[]');
        expect(embedConfig.latex()).toBe('\\embed{newLine}[]');
        expect(embedConfig.latex()).toBe('\\embed{newLine}[]');
      });
    });

    describe('integration scenarios', () => {
      it('should handle multiple registrations without errors', () => {
        registerLineBreak(mockMQ);
        expect(() => registerLineBreak(mockMQ)).not.toThrow();

        expect(mockRegisterEmbed).toHaveBeenCalledTimes(2);
      });

      it('should work with different MQ instances', () => {
        const mockMQ1 = { registerEmbed: jest.fn() };
        const mockMQ2 = { registerEmbed: jest.fn() };

        registerLineBreak(mockMQ1);
        registerLineBreak(mockMQ2);

        expect(mockMQ1.registerEmbed).toHaveBeenCalledTimes(1);
        expect(mockMQ2.registerEmbed).toHaveBeenCalledTimes(1);
      });

      it('should register embed with correct callback signature', () => {
        registerLineBreak(mockMQ);

        const callArgs = mockRegisterEmbed.mock.calls[0];
        expect(callArgs[0]).toBe('newLine');
        expect(callArgs[1]).toBeInstanceOf(Function);
      });
    });

    describe('embed configuration structure', () => {
      it('should return an object with exactly 3 properties', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        const keys = Object.keys(config);
        expect(keys).toHaveLength(3);
        expect(keys).toContain('htmlString');
        expect(keys).toContain('text');
        expect(keys).toContain('latex');
      });

      it('should have htmlString as a string type', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(typeof config.htmlString).toBe('string');
      });

      it('should have text as a function type', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(typeof config.text).toBe('function');
      });

      it('should have latex as a function type', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(typeof config.latex).toBe('function');
      });
    });

    describe('HTML structure validation', () => {
      it('should return htmlString with valid HTML div element', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.htmlString).toMatch(/<div[^>]*>.*<\/div>/);
      });

      it('should return htmlString with newLine class', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.htmlString).toContain('class="newLine"');
      });

      it('should return htmlString with empty div content', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.htmlString).toBe('<div class="newLine"></div>');
      });
    });

    describe('LaTeX syntax validation', () => {
      it('should return latex with correct embed syntax', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex()).toMatch(/\\embed\{[^}]+\}\[\]/);
      });

      it('should return latex with newLine identifier', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex()).toContain('newLine');
      });

      it('should return latex with empty bracket notation', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex()).toContain('[]');
      });

      it('should return latex that matches exact expected format', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex()).toBe('\\embed{newLine}[]');
      });
    });

    describe('error handling', () => {
      it('should not throw if MQ object is valid', () => {
        expect(() => registerLineBreak(mockMQ)).not.toThrow();
      });

      it('should handle MQ with additional properties', () => {
        const extendedMQ = {
          registerEmbed: mockRegisterEmbed,
          otherProperty: 'value',
          otherMethod: jest.fn(),
        };

        expect(() => registerLineBreak(extendedMQ)).not.toThrow();
        expect(mockRegisterEmbed).toHaveBeenCalledTimes(1);
      });
    });

    describe('function export', () => {
      it('should export registerLineBreak as a function', () => {
        expect(typeof registerLineBreak).toBe('function');
      });

      it('should be callable', () => {
        expect(() => registerLineBreak(mockMQ)).not.toThrow();
      });

      it('should accept one parameter', () => {
        expect(registerLineBreak.length).toBe(1);
      });
    });

    describe('embed callback behavior', () => {
      it('should return functions that are new instances on each call', () => {
        registerLineBreak(mockMQ);

        const config1 = embedCallback();
        const config2 = embedCallback();

        expect(config1.text).not.toBe(config2.text);
        expect(config1.latex).not.toBe(config2.latex);
      });

      it('should not require any parameters for embed callback', () => {
        registerLineBreak(mockMQ);

        expect(() => embedCallback()).not.toThrow();
        expect(() => embedCallback(null)).not.toThrow();
        expect(() => embedCallback('arg')).not.toThrow();
      });
    });

    describe('text function behavior', () => {
      it('should return a string', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(typeof config.text()).toBe('string');
      });

      it('should return a non-empty string', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.text().length).toBeGreaterThan(0);
      });

      it('should return the exact string "testText"', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.text()).toBe('testText');
      });

      it('should not accept parameters', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.text('ignored')).toBe('testText');
        expect(config.text(123)).toBe('testText');
      });
    });

    describe('latex function behavior', () => {
      it('should return a string', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(typeof config.latex()).toBe('string');
      });

      it('should return a non-empty string', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex().length).toBeGreaterThan(0);
      });

      it('should start with backslash', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex()).toMatch(/^\\/);
      });

      it('should not accept parameters', () => {
        registerLineBreak(mockMQ);
        const config = embedCallback();

        expect(config.latex('ignored')).toBe('\\embed{newLine}[]');
        expect(config.latex(123)).toBe('\\embed{newLine}[]');
      });
    });

    describe('registration validation', () => {
      it('should register only one embed type', () => {
        registerLineBreak(mockMQ);

        expect(mockRegisterEmbed).toHaveBeenCalledTimes(1);
      });

      it('should use consistent embed name', () => {
        registerLineBreak(mockMQ);

        const firstArg = mockRegisterEmbed.mock.calls[0][0];
        expect(firstArg).toBe('newLine');
      });

      it('should not modify the MQ object', () => {
        const originalMQ = { registerEmbed: mockRegisterEmbed };
        const mqKeysBeforeCount = Object.keys(originalMQ).length;

        registerLineBreak(originalMQ);

        expect(Object.keys(originalMQ)).toHaveLength(mqKeysBeforeCount);
      });
    });
  });
});
