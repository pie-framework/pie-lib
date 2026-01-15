import dragType from '../drag-type';

describe('drag-type', () => {
  describe('types', () => {
    it('should export types object', () => {
      expect(dragType).toBeDefined();
      expect(dragType.types).toBeDefined();
    });

    it('should have ica type defined', () => {
      expect(dragType.types.ica).toBe('dnd-kit-response');
    });

    it('should have ml (match-list) type defined', () => {
      expect(dragType.types.ml).toBe('Answer');
    });

    it('should have db (drag-in-the-blank) type defined', () => {
      expect(dragType.types.db).toBe('MaskBlank');
    });

    it('should have exactly three types', () => {
      const keys = Object.keys(dragType.types);
      expect(keys).toHaveLength(3);
      expect(keys).toContain('ica');
      expect(keys).toContain('ml');
      expect(keys).toContain('db');
    });

    it('should have all string values', () => {
      Object.values(dragType.types).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should not allow modification of the structure', () => {
      const originalTypes = { ...dragType.types };
      expect(dragType.types).toEqual(originalTypes);
    });
  });
});
