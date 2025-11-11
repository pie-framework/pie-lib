import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TableToolbar } from '../table-toolbar';

describe('table-toolbar', () => {
  let onDone, onAddColumn, onAddRow, onRemoveColumn, onRemoveRow, onRemoveTable, onToggleBorder;

  beforeEach(() => {
    onAddColumn = jest.fn();
    onAddRow = jest.fn();
    onRemoveColumn = jest.fn();
    onRemoveRow = jest.fn();
    onRemoveTable = jest.fn();
    onDone = jest.fn();
    onToggleBorder = jest.fn();
  });

  const renderComponent = (extras = {}) => {
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
        tableToolbar: 'table-toolbar',
      },
      plugins: [],
      value: {},
      onChange: jest.fn(),
      ...extras,
    };

    return render(<TableToolbar {...props} />);
  };

  describe('rendering', () => {
    it('renders toolbar without crashing', () => {
      const { container } = renderComponent();

      // Check that the toolbar container is rendered
      expect(container.firstChild).toBeInTheDocument();

      // Check for Done button (only one with aria-label)
      expect(screen.getByLabelText('Done')).toBeInTheDocument();

      // Check that there are multiple buttons (table manipulation buttons)
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('renders with hasBorder prop', () => {
      const { container } = renderComponent({ hasBorder: false });

      expect(container.firstChild).toBeInTheDocument();

      // Verify hasBorder affects rendering - button with aria-pressed attribute
      const borderButton = container.querySelector('button[aria-pressed]');
      expect(borderButton).toBeInTheDocument();
      expect(borderButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders with hasBorder true', () => {
      const { container } = renderComponent({ hasBorder: true });

      // Verify hasBorder affects rendering
      const borderButton = container.querySelector('button[aria-pressed]');
      expect(borderButton).toBeInTheDocument();
      expect(borderButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
