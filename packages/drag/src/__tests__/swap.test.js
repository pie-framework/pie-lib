import swap from '../swap';

describe('swap', () => {
  describe('basic swapping', () => {
    it('should swap two elements in an array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = swap(arr, 0, 4);
      expect(result).toEqual([5, 2, 3, 4, 1]);
    });

    it('should swap adjacent elements', () => {
      const arr = ['a', 'b', 'c'];
      const result = swap(arr, 0, 1);
      expect(result).toEqual(['b', 'a', 'c']);
    });

    it('should swap elements in the middle', () => {
      const arr = [10, 20, 30, 40, 50];
      const result = swap(arr, 1, 3);
      expect(result).toEqual([10, 40, 30, 20, 50]);
    });

    it('should handle swapping the same index', () => {
      const arr = [1, 2, 3];
      const result = swap(arr, 1, 1);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should work with two-element array', () => {
      const arr = ['first', 'second'];
      const result = swap(arr, 0, 1);
      expect(result).toEqual(['second', 'first']);
    });
  });

  describe('different data types', () => {
    it('should work with strings', () => {
      const arr = ['apple', 'banana', 'cherry'];
      const result = swap(arr, 0, 2);
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should work with objects', () => {
      const arr = [{ name: 'John' }, { name: 'Jane' }, { name: 'Bob' }];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([{ name: 'Bob' }, { name: 'Jane' }, { name: 'John' }]);
    });

    it('should work with mixed types', () => {
      const arr = [1, 'two', { three: 3 }, null, undefined];
      const result = swap(arr, 0, 4);
      expect(result).toEqual([undefined, 'two', { three: 3 }, null, 1]);
    });

    it('should work with null and undefined values', () => {
      const arr = [null, undefined, 'value'];
      const result = swap(arr, 0, 2);
      expect(result).toEqual(['value', undefined, null]);
    });

    it('should work with boolean values', () => {
      const arr = [true, false, true];
      const result = swap(arr, 0, 1);
      expect(result).toEqual([false, true, true]);
    });
  });

  describe('error handling', () => {
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
      expect(() => swap([1, 2, 3], 0, undefined)).toThrow('swap requires a non-empty array');
    });

    it('should throw error when both indices are undefined', () => {
      expect(() => swap([1, 2, 3], undefined, undefined)).toThrow('swap requires a non-empty array');
    });
  });

  describe('edge cases', () => {
    it('should handle index 0', () => {
      const arr = [1, 2, 3];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([3, 2, 1]);
    });

    it('should handle last index', () => {
      const arr = [1, 2, 3, 4];
      const result = swap(arr, 1, 3);
      expect(result).toEqual([1, 4, 3, 2]);
    });

    it('should handle zero as a value', () => {
      const arr = [0, 1, 2];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([2, 1, 0]);
    });

    it('should work with large arrays', () => {
      const arr = Array.from({ length: 1000 }, (_, i) => i);
      const result = swap(arr, 0, 999);
      expect(result[0]).toBe(999);
      expect(result[999]).toBe(0);
      expect(result.length).toBe(1000);
    });

    it('should preserve array length', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = swap(arr, 1, 3);
      expect(result.length).toBe(arr.length);
    });
  });

  describe('complex objects', () => {
    it('should handle nested arrays', () => {
      const arr = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([
        [5, 6],
        [3, 4],
        [1, 2],
      ]);
    });

    it('should handle deeply nested objects', () => {
      const arr = [{ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }, { a: { b: { c: 3 } } }];
      const result = swap(arr, 0, 2);
      expect(result).toEqual([{ a: { b: { c: 3 } } }, { a: { b: { c: 2 } } }, { a: { b: { c: 1 } } }]);
    });

    it('should handle objects with functions (deep clone limitation)', () => {
      const fn = () => 'test';
      const arr = [{ fn }, { value: 'b' }];
      const result = swap(arr, 0, 1);
      // Functions should be preserved by lodash cloneDeep
      expect(result).toEqual([{ value: 'b' }, { fn }]);
    });
  });
});
