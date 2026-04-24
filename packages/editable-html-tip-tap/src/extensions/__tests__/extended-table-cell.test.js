import { ExtendedTableCell, ExtendedTableHeader } from '../extended-table-cell';

describe('ExtendedTableCell / ExtendedTableHeader', () => {
  it('exports cell and header extensions with div preferred over paragraph in content spec', () => {
    expect(ExtendedTableCell.name).toBe('tableCell');
    expect(ExtendedTableHeader.name).toBe('tableHeader');

    const cellContent =
      ExtendedTableCell.options?.content ??
      ExtendedTableCell.config?.content ??
      ExtendedTableCell.extendOptions?.content;

    expect(String(cellContent)).toMatch(/^\(div \| paragraph/);

    const headerContent =
      ExtendedTableHeader.options?.content ??
      ExtendedTableHeader.config?.content ??
      ExtendedTableHeader.extendOptions?.content;

    expect(headerContent).toBe(cellContent);
  });
});
