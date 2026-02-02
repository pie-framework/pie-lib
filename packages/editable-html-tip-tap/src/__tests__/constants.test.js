import { PIE_TOOLBAR__CLASS } from '../constants';
import constants from '../constants';

describe('Constants', () => {
  describe('PIE_TOOLBAR__CLASS', () => {
    it('is defined', () => {
      expect(PIE_TOOLBAR__CLASS).toBeDefined();
    });

    it('has the correct value', () => {
      expect(PIE_TOOLBAR__CLASS).toBe('pie-toolbar');
    });
  });

  describe('default export', () => {
    it('contains PIE_TOOLBAR__CLASS', () => {
      expect(constants.PIE_TOOLBAR__CLASS).toBe('pie-toolbar');
    });
  });
});
