import { valueToSize, buildSizeStyle } from '../editor';

describe('Editor Utilities', () => {
  describe('valueToSize', () => {
    it('returns undefined for falsy values', () => {
      expect(valueToSize(null)).toBeUndefined();
      expect(valueToSize(undefined)).toBeUndefined();
      expect(valueToSize('')).toBeUndefined();
      expect(valueToSize(0)).toBeUndefined();
    });

    it('converts number to px string', () => {
      expect(valueToSize(100)).toBe('100px');
      expect(valueToSize(50)).toBe('50px');
    });

    it('returns undefined for percentage strings', () => {
      expect(valueToSize('100%')).toBeUndefined();
      expect(valueToSize('50%')).toBeUndefined();
    });

    it('preserves valid CSS unit strings', () => {
      expect(valueToSize('100px')).toBe('100px');
      expect(valueToSize('10vh')).toBe('10vh');
      expect(valueToSize('50vw')).toBe('50vw');
      expect(valueToSize('9ch')).toBe('9ch');
      expect(valueToSize('2em')).toBe('2em');
    });

    it('preserves calc() expressions', () => {
      expect(valueToSize('calc(10em + 42px)')).toBe('calc(10em + 42px)');
      expect(valueToSize('calc(100% - 20px)')).toBe('calc(100% - 20px)');
    });

    it('converts numeric strings to px', () => {
      expect(valueToSize('100')).toBe('100px');
      expect(valueToSize('50')).toBe('50px');
    });

    it('handles invalid numeric strings', () => {
      const result = valueToSize('invalid');
      expect(isNaN(result)).toBe(true);
    });
  });

  describe('buildSizeStyle', () => {
    it('builds style with numeric width', () => {
      const result = buildSizeStyle({ width: 100 });
      expect(result).toEqual({
        width: '100px',
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('returns undefined for percentage values', () => {
      const result = buildSizeStyle({ height: '100%', width: '100%' });
      expect(result).toEqual({
        width: undefined,
        height: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('builds style with numeric height', () => {
      const result = buildSizeStyle({ height: 100 });
      expect(result).toEqual({
        width: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        height: '100px',
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('builds style with minHeight', () => {
      const result = buildSizeStyle({ minHeight: 100 });
      expect(result).toEqual({
        width: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: '100px',
        maxHeight: undefined,
      });
    });

    it('builds style with maxHeight', () => {
      const result = buildSizeStyle({ maxHeight: 100 });
      expect(result).toEqual({
        width: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: undefined,
        maxHeight: '100px',
      });
    });

    it('builds style with calc() expression', () => {
      const result = buildSizeStyle({ width: 'calc(10em + 42px)' });
      expect(result).toEqual({
        width: 'calc(10em + 42px)',
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('builds style with ch unit', () => {
      const result = buildSizeStyle({ width: '9ch' });
      expect(result).toEqual({
        width: '9ch',
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('builds style with no size props', () => {
      const result = buildSizeStyle({});
      expect(result).toEqual({
        width: undefined,
        minWidth: undefined,
        maxWidth: undefined,
        height: undefined,
        minHeight: undefined,
        maxHeight: undefined,
      });
    });

    it('builds style with multiple size constraints', () => {
      const result = buildSizeStyle({
        width: 500,
        minWidth: 300,
        maxWidth: 700,
        height: 400,
        minHeight: 200,
        maxHeight: 600,
      });
      expect(result).toEqual({
        width: '500px',
        minWidth: '300px',
        maxWidth: '700px',
        height: '400px',
        minHeight: '200px',
        maxHeight: '600px',
      });
    });
  });
});
