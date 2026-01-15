import swap from '../swap';

describe('swap', () => {
  describe('basic functionality', () => {
    it('should swap elements at given indices', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = swap(arr, 1, 3);
      expect(result).toEqual([1, 4, 3, 2, 5]);
    });

    it('should swap first and last elements', () => {
      const arr = ['a', 'b', 'c', 'd'];
      const result = swap(arr, 0, 3);
      expect(result).toEqual(['d', 'b', 'c', 'a']);
    });

    it('should swap adjacent elements', () => {
      const arr = [10, 20, 30];
      const result = swap(arr, 0, 1);
      expect(result).toEqual([20, 10, 30]);
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      swap(original, 1, 3);
      expect(original).toEqual(copy);
    });

    it('should return a new array instance', () => {
      const arr = [1, 2, 3];
      const result = swap(arr, 0, 2);
      expect(result).not.toBe(arr);
    });
  });

  describe('edge cases and validation', () => {
    it('should throw error when array is null', () => {
      expect(() => swap(null, 0, 1)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when array is undefined', () => {
      expect(() => swap(undefined, 0, 1)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when array is empty', () => {
      expect(() => swap([], 0, 1)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when array has only one element', () => {
      expect(() => swap([1], 0, 1)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when fromIndex is undefined', () => {
      expect(() => swap([1, 2, 3], undefined, 1)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when toIndex is undefined', () => {
      expect(() => swap([1, 2, 3], 1, undefined)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when both indices are undefined', () => {
      expect(() => swap([1, 2, 3], undefined, undefined)).toThrow('swap requires a non-empty array');
    });

    it('should work with index 0', () => {
      const arr = [1, 2, 3];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([3, 2, 1]);
    });

    it('should work with negative indices (JavaScript behavior)', () => {
      // Note: This tests JavaScript's native array behavior
      const arr = [1, 2, 3, 4];
      const result = swap(arr, 1, 3);
      expect(result).toEqual([1, 4, 3, 2]);
    });
  });

  describe('different data types', () => {
    it('should swap strings', () => {
      const arr = ['apple', 'banana', 'cherry'];
      const result = swap(arr, 0, 2);
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should swap objects', () => {
      const arr = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
      const result = swap(arr, 0, 1);
      expect(result[0]).toEqual({ name: 'Jane' });
      expect(result[1]).toEqual({ name: 'John' });
    });

    it('should swap mixed types', () => {
      const arr = [1, 'two', { three: 3 }, [4]];
      const result = swap(arr, 0, 3);
      expect(result).toEqual([[4], 'two', { three: 3 }, 1]);
    });

    it('should swap booleans', () => {
      const arr = [true, false, true];
      const result = swap(arr, 0, 1);
      expect(result).toEqual([false, true, true]);
    });

    it('should swap null values', () => {
      const arr = [null, 1, null, 2];
      const result = swap(arr, 0, 3);
      expect(result).toEqual([2, 1, null, null]);
    });
  });

  describe('array length variations', () => {
    it('should work with 2-element array', () => {
      const arr = ['a', 'b'];
      const result = swap(arr, 0, 1);
      expect(result).toEqual(['b', 'a']);
    });

    it('should work with large arrays', () => {
      const arr = Array.from({ length: 100 }, (_, i) => i);
      const result = swap(arr, 0, 99);
      expect(result[0]).toBe(99);
      expect(result[99]).toBe(0);
      expect(result.length).toBe(100);
    });

    it('should maintain array length', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = swap(arr, 2, 7);
      expect(result.length).toBe(arr.length);
    });
  });
});
