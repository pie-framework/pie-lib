import { render } from '@pie-lib/test-utils';
import React from 'react';
import UndoRedo from '../undo-redo';

describe('UndoRedo', () => {
  let onUndo = jest.fn();
  let onRedo = jest.fn();
  let onReset = jest.fn();

  const renderComponent = (extras) => {
    const defaults = {
      onUndo,
      onRedo,
      onReset,
    };
    const props = { ...defaults, ...extras };
    return render(<UndoRedo {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
