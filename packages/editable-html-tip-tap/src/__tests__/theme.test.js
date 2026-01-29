import { primary } from '../theme';

describe('Theme', () => {
  describe('primary color', () => {
    it('is defined', () => {
      expect(primary).toBeDefined();
    });

    it('has the correct hex value', () => {
      expect(primary).toBe('#304ffe');
    });

    it('is a valid hex color', () => {
      expect(primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
