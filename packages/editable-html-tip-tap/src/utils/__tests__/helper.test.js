import { normalizeInitialMarkup } from '../helper';

describe('normalizeInitialMarkup', () => {
  describe('basic normalization', () => {
    it('returns empty div for empty string', () => {
      expect(normalizeInitialMarkup('')).toBe('<div></div>');
    });

    it('returns empty div for null', () => {
      expect(normalizeInitialMarkup(null)).toBe('<div></div>');
    });

    it('returns empty div for undefined', () => {
      expect(normalizeInitialMarkup(undefined)).toBe('<div></div>');
    });

    it('wraps plain text in div', () => {
      expect(normalizeInitialMarkup('Hello')).toBe('<div>Hello</div>');
    });

    it('returns HTML tags as-is when detected as HTML', () => {
      // Since '<script>' matches the HTML pattern, it's returned as-is
      // To be escaped, it would need to not match the HTML pattern
      expect(normalizeInitialMarkup('<script>')).toBe('<script>');
    });

    it('escapes HTML entities in plain text', () => {
      // Plain text without angle brackets gets escaped
      expect(normalizeInitialMarkup('Hello & World')).toBe('<div>Hello &amp; World</div>');
    });

    it('returns single div as-is', () => {
      const html = '<div>Hello</div>';
      expect(normalizeInitialMarkup(html)).toBe(html);
    });

    it('returns paragraph as-is', () => {
      const html = '<p>Hello</p>';
      expect(normalizeInitialMarkup(html)).toBe(html);
    });
  });

  describe('consecutive divs to paragraph conversion', () => {
    it('converts two consecutive divs to paragraph with br', () => {
      const input = '<div>A</div><div>B</div>';
      const expected = '<p>A<br>B</p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });

    it('converts three consecutive divs to paragraph with br tags', () => {
      const input = '<div>A</div><div>B</div><div>C</div>';
      const expected = '<p>A<br>B<br>C</p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });

    it('handles divs with whitespace', () => {
      const input = '<div>  A  </div><div>  B  </div>';
      const expected = '<p>  A  <br>  B  </p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });

    it('handles divs with inline elements', () => {
      const input = '<div><strong>A</strong></div><div><em>B</em></div>';
      const expected = '<p><strong>A</strong><br><em>B</em></p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });

    it('handles empty divs', () => {
      const input = '<div></div><div>B</div>';
      const expected = '<p><br>B</p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });

    it('preserves existing br tags within divs', () => {
      const input = '<div>A<br>A2</div><div>B</div>';
      const expected = '<p>A<br>A2<br>B</p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });
  });

  describe('cases that should NOT convert', () => {
    it('does not convert single div', () => {
      const input = '<div>Hello</div>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('does not convert divs with nested block elements', () => {
      const input = '<div><div>Nested</div></div><div>B</div>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('does not convert divs containing tables', () => {
      const input = '<div><table><tr><td>A</td></tr></table></div><div>B</div>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('does not convert divs containing lists', () => {
      const input = '<div><ul><li>Item</li></ul></div><div>B</div>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('does not convert mixed element types', () => {
      const input = '<div>A</div><p>B</p>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('does not convert paragraphs', () => {
      const input = '<p>A</p><p>B</p>';
      expect(normalizeInitialMarkup(input)).toBe(input);
    });
  });

  describe('edge cases', () => {
    it('handles divs with attributes', () => {
      const input = '<div class="test">A</div><div>B</div>';
      // Should not convert since we only want simple divs
      expect(normalizeInitialMarkup(input)).toBe(input);
    });

    it('handles complex inline formatting', () => {
      const input = '<div><strong><em>A</em></strong></div><div><u>B</u></div>';
      const expected = '<p><strong><em>A</em></strong><br><u>B</u></p>';
      expect(normalizeInitialMarkup(input)).toBe(expected);
    });
  });
});
