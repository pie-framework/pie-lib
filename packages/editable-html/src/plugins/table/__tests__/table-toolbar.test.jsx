import { shallow } from 'enzyme';
import React from 'react';
import { TableToolbar } from '../table-toolbar';
describe('table-toolbar', () => {
  let onDone,
    onAddColumn,
    onAddRow,
    onRemoveColumn,
    onRemoveRow,
    onRemoveTable,
    onToggleBorder;

  beforeEach(() => {
    onAddColumn = jest.fn();
    onAddRow = jest.fn();
    onRemoveColumn = jest.fn();
    onRemoveRow = jest.fn();
    onRemoveTable = jest.fn();
    onDone = jest.fn();
    onToggleBorder = jest.fn();
  });

  const mkWrapper = extras => {
    const props = {
      onDone,
      onAddRow,
      onRemoveRow,
      onAddColumn,
      onRemoveColumn,
      onRemoveTable,
      hasBorder: true,
      onToggleBorder,
      classes: {
        tableToolbar: 'table-toolbar'
      },
      ...extras
    };

    return shallow(<TableToolbar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = mkWrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
