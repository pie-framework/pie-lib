import ExtendedTable from '../extended-table';

jest.mock('@tiptap/extension-table', () => ({
  Table: {
    extend: jest.fn((config) => config),
  },
}));

describe('ExtendedTable', () => {
  describe('addAttributes', () => {
    it('returns border attribute with default value', () => {
      const attributes = ExtendedTable.addAttributes();
      expect(attributes).toHaveProperty('border');
      expect(attributes.border).toEqual({ default: '1' });
    });
  });

  describe('renderHTML', () => {
    it('renders table with default border', () => {
      const props = {
        HTMLAttributes: {},
      };

      const mockParent = jest.fn(() => ['table', { style: '' }]);

      const context = {
        parent: mockParent,
      };

      const result = ExtendedTable.renderHTML.call(context, props);

      expect(mockParent).toHaveBeenCalledWith(props);
      expect(result[0]).toBe('table');
      expect(result[1]).toHaveProperty('style');
    });

    it('renders table with custom border', () => {
      const props = {
        HTMLAttributes: { border: '2' },
      };

      const mockParent = jest.fn(() => ['table', { style: '' }]);

      const context = {
        parent: mockParent,
      };

      const result = ExtendedTable.renderHTML.call(context, props);

      expect(result[1].border).toBe('2');
    });

    it('handles styles ending with semicolon', () => {
      const props = {
        HTMLAttributes: {},
      };

      const mockParent = jest.fn(() => ['table', { style: 'padding: 5px;' }]);

      const context = {
        parent: mockParent,
      };

      const result = ExtendedTable.renderHTML.call(context, props);

      expect(result[1].style).toContain('padding: 5px;');
    });

    it('includes CSS custom properties', () => {
      const props = {
        HTMLAttributes: {},
      };

      const mockParent = jest.fn(() => ['table', { style: '' }]);

      const context = {
        parent: mockParent,
      };

      const result = ExtendedTable.renderHTML.call(context, props);

      expect(result[1].style).toContain('color: var(--pie-text, black)');
      expect(result[1].style).toContain('background-color: var(--pie-background, rgba(255, 255, 255))');
    });
  });
});
