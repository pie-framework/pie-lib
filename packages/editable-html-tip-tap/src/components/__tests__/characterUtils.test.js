import { spanishConfig, specialConfig } from '../characters/characterUtils';

describe('characterUtils', () => {
  describe('spanishConfig', () => {
    it('exports spanishConfig object', () => {
      expect(spanishConfig).toBeDefined();
      expect(typeof spanishConfig).toBe('object');
    });

    it('has characters array', () => {
      expect(spanishConfig).toHaveProperty('characters');
      expect(Array.isArray(spanishConfig.characters)).toBe(true);
    });

    it('has correct character structure', () => {
      expect(spanishConfig.characters.length).toBeGreaterThan(0);
      spanishConfig.characters.forEach((row) => {
        expect(Array.isArray(row)).toBe(true);
      });
    });

    it('includes Spanish characters', () => {
      const allChars = spanishConfig.characters.flat();
      expect(allChars).toContain('á');
      expect(allChars).toContain('é');
      expect(allChars).toContain('í');
      expect(allChars).toContain('ó');
      expect(allChars).toContain('ú');
      expect(allChars).toContain('ñ');
      expect(allChars).toContain('Ñ');
    });

    it('includes accented uppercase letters', () => {
      const allChars = spanishConfig.characters.flat();
      expect(allChars).toContain('Á');
      expect(allChars).toContain('É');
      expect(allChars).toContain('Í');
      expect(allChars).toContain('Ó');
      expect(allChars).toContain('Ú');
    });

    it('includes special punctuation', () => {
      const allChars = spanishConfig.characters.flat();
      expect(allChars).toContain('¿');
      expect(allChars).toContain('¡');
      expect(allChars).toContain('«');
      expect(allChars).toContain('»');
    });
  });

  describe('specialConfig', () => {
    it('exports specialConfig object', () => {
      expect(specialConfig).toBeDefined();
      expect(typeof specialConfig).toBe('object');
    });

    it('has hasPreview property set to true', () => {
      expect(specialConfig).toHaveProperty('hasPreview', true);
    });

    it('has characters array', () => {
      expect(specialConfig).toHaveProperty('characters');
      expect(Array.isArray(specialConfig.characters)).toBe(true);
    });

    it('has correct character structure with metadata', () => {
      expect(specialConfig.characters.length).toBeGreaterThan(0);
      specialConfig.characters.forEach((row) => {
        expect(Array.isArray(row)).toBe(true);
        row.forEach((char) => {
          expect(char).toHaveProperty('unicode');
          expect(char).toHaveProperty('description');
          expect(char).toHaveProperty('write');
          expect(char).toHaveProperty('label');
        });
      });
    });

    it('includes currency symbols', () => {
      const allChars = specialConfig.characters.flat();
      const euroChar = allChars.find((c) => c.write === '€');
      expect(euroChar).toBeDefined();
      expect(euroChar.unicode).toBe('U+20AC');
      expect(euroChar.description).toBe('EURO SIGN');

      const centChar = allChars.find((c) => c.write === '¢');
      expect(centChar).toBeDefined();

      const poundChar = allChars.find((c) => c.write === '£');
      expect(poundChar).toBeDefined();

      const yenChar = allChars.find((c) => c.write === '¥');
      expect(yenChar).toBeDefined();
    });

    it('includes accented characters', () => {
      const allChars = specialConfig.characters.flat();
      const chars = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];
      chars.forEach((char) => {
        const found = allChars.find((c) => c.write === char);
        expect(found).toBeDefined();
      });
    });

    it('includes space characters', () => {
      const allChars = specialConfig.characters.flat();
      const descriptions = allChars.map((c) => c.description);
      expect(descriptions).toContain('NO-BREAK SPACE');
      expect(descriptions).toContain('HAIR SPACE');
      expect(descriptions).toContain('THIN SPACE');
      expect(descriptions).toContain('EM SPACE');
    });

    it('includes diacritics', () => {
      const allChars = specialConfig.characters.flat();
      const acuteAccent = allChars.find((c) => c.description === 'ACUTE ACCENT');
      expect(acuteAccent).toBeDefined();

      const circumflex = allChars.find((c) => c.description === 'CIRCUMFLEX ACCENT');
      expect(circumflex).toBeDefined();

      const grave = allChars.find((c) => c.description === 'GRAVE ACCENT');
      expect(grave).toBeDefined();

      const diaeresis = allChars.find((c) => c.description === 'DIAERESIS');
      expect(diaeresis).toBeDefined();
    });

    it('includes punctuation marks', () => {
      const allChars = specialConfig.characters.flat();
      const descriptions = allChars.map((c) => c.description);
      expect(descriptions).toContain('INVERTED QUESTION MARK');
      expect(descriptions).toContain('INVERTED EXCLAMATION MARK');
      expect(descriptions).toContain('SECTION SIGN');
      expect(descriptions).toContain('BULLET');
      expect(descriptions).toContain('HORIZONTAL ELLIPSIS');
    });

    it('includes quotation marks', () => {
      const allChars = specialConfig.characters.flat();
      const leftQuote = allChars.find((c) => c.description === 'LEFT-POINTING DOUBLE ANGLE QUOTATION MARK');
      expect(leftQuote).toBeDefined();

      const rightQuote = allChars.find((c) => c.description === 'RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK');
      expect(rightQuote).toBeDefined();
    });

    it('includes dashes', () => {
      const allChars = specialConfig.characters.flat();
      const enDash = allChars.find((c) => c.description === 'EN DASH');
      expect(enDash).toBeDefined();

      const emDash = allChars.find((c) => c.description === 'EM DASH');
      expect(emDash).toBeDefined();

      const minus = allChars.find((c) => c.description === 'MINUS SIGN');
      expect(minus).toBeDefined();
    });

    it('some characters have extraProps', () => {
      const allChars = specialConfig.characters.flat();
      const charsWithExtraProps = allChars.filter((c) => c.extraProps);
      expect(charsWithExtraProps.length).toBeGreaterThan(0);
    });
  });
});
