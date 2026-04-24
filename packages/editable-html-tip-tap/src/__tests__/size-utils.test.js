import { valueToSize } from '../utils/size';

describe('Size Utilities', () => {
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
      expect(valueToSize(0)).toBeUndefined();
    });

    it('returns undefined for percentage strings', () => {
      expect(valueToSize('100%')).toBeUndefined();
      expect(valueToSize('50%')).toBeUndefined();
      expect(valueToSize('0%')).toBeUndefined();
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
      expect(valueToSize('calc(50vh + 10px)')).toBe('calc(50vh + 10px)');
    });

    it('converts numeric strings to px', () => {
      expect(valueToSize('100')).toBe('100px');
      expect(valueToSize('50')).toBe('50px');
      expect(valueToSize('250')).toBe('250px');
    });

    it('handles invalid numeric strings', () => {
      const result = valueToSize('invalid');
      expect(isNaN(result)).toBe(true);
    });

    it('handles edge cases with whitespace', () => {
      const result = valueToSize('  ');
      expect(isNaN(result)).toBe(true);
    });

    it('handles negative numbers', () => {
      expect(valueToSize(-100)).toBe('-100px');
      expect(valueToSize('-50')).toBe('-50px');
    });

    it('handles decimal numbers', () => {
      expect(valueToSize(100.5)).toBe('100.5px');
      expect(valueToSize('100.5')).toBe('100px'); // parseInt truncates
    });
  });
});
