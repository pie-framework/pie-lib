import ExtendedTable, { applyPresentationToTableElement, ExtendedTableView } from '../extended-table';

const mockTableViewState = { updateReturns: true };

jest.mock('@tiptap/extension-table', () => ({
  Table: {
    extend: jest.fn((config) => config),
  },
  TableView: class TableView {
    constructor() {
      this.table = {
        style: { setProperty: jest.fn() },
        setAttribute: jest.fn(),
      };
    }

    update() {
      return mockTableViewState.updateReturns;
    }
  },
}));

describe('ExtendedTable', () => {
  beforeEach(() => {
    mockTableViewState.updateReturns = true;
  });

  describe('applyPresentationToTableElement', () => {
    it('sets default border and theme styles', () => {
      const table = document.createElement('table');
      const setProperty = jest.spyOn(table.style, 'setProperty');

      applyPresentationToTableElement(table, {});

      expect(table.getAttribute('border')).toBe('1');
      expect(setProperty).toHaveBeenCalledWith('color', 'var(--pie-text, black)');
      expect(setProperty).toHaveBeenCalledWith('background-color', 'var(--pie-background, rgba(255, 255, 255))');
      setProperty.mockRestore();
    });

    it('uses explicit border from attrs', () => {
      const table = document.createElement('table');
      applyPresentationToTableElement(table, { border: '0' });

      expect(table.getAttribute('border')).toBe('0');
    });

    it('treats empty border as default', () => {
      const table = document.createElement('table');
      applyPresentationToTableElement(table, { border: '' });

      expect(table.getAttribute('border')).toBe('1');
    });
  });

  describe('ExtendedTableView', () => {
    it('applies presentation after construction', () => {
      const node = { attrs: { border: '2' } };
      const view = new ExtendedTableView(node, 25);

      expect(view.table.setAttribute).toHaveBeenCalledWith('border', '2');
      expect(view.table.style.setProperty).toHaveBeenCalledWith('color', 'var(--pie-text, black)');
      expect(view.table.style.setProperty).toHaveBeenCalledWith(
        'background-color',
        'var(--pie-background, rgba(255, 255, 255))',
      );
    });

    it('reapplies presentation when super.update returns true', () => {
      const view = new ExtendedTableView({ attrs: { border: '1' } }, 25);
      view.table.setAttribute.mockClear();
      view.table.style.setProperty.mockClear();

      view.update({ attrs: { border: '0' } });

      expect(view.table.setAttribute).toHaveBeenCalledWith('border', '0');
      expect(view.table.style.setProperty).toHaveBeenCalledWith('color', 'var(--pie-text, black)');
      expect(view.table.style.setProperty).toHaveBeenCalledWith(
        'background-color',
        'var(--pie-background, rgba(255, 255, 255))',
      );
    });

    it('does not reapply presentation when super.update returns false', () => {
      mockTableViewState.updateReturns = false;
      const view = new ExtendedTableView({ attrs: { border: '1' } }, 25);
      view.table.setAttribute.mockClear();
      view.table.style.setProperty.mockClear();

      const ok = view.update({ attrs: { border: '0' } });

      expect(ok).toBe(false);
      expect(view.table.setAttribute).not.toHaveBeenCalled();
      expect(view.table.style.setProperty).not.toHaveBeenCalled();
    });
  });

  describe('addOptions', () => {
    it('enables resizable table view with zero handle width for colgroup sync', () => {
      const options = ExtendedTable.addOptions();
      expect(options.resizable).toBe(true);
      expect(options.handleWidth).toBe(0);
      expect(options.View).toBe(ExtendedTableView);
    });
  });

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
