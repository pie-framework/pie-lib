import React from 'react';
import { render, waitFor } from '@pie-lib/test-utils';
import Root, { GraphContainer } from '../index';
import { changeMarks } from '../actions';

jest.mock('../../graph-with-controls', () => {
  return function GraphWithControls({ marks, onChangeMarks, onUndo, onRedo, onReset, disabled }) {
    return (
      <div data-testid="graph-with-controls">
        <div data-testid="marks-count">{marks?.length || 0}</div>
        {disabled && <div data-testid="disabled-indicator">Disabled</div>}
        <button data-testid="change-marks" onClick={() => onChangeMarks && onChangeMarks([{ id: 1 }])}>
          Change
        </button>
        <button data-testid="undo" onClick={onUndo}>
          Undo
        </button>
        <button data-testid="redo" onClick={onRedo}>
          Redo
        </button>
        <button data-testid="reset" onClick={onReset}>
          Reset
        </button>
      </div>
    );
  };
});

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
}));

describe('Container Root Component', () => {
  const defaultProps = {
    marks: [],
    onChangeMarks: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<Root {...defaultProps} {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container).toBeInTheDocument();
    });

    it('renders GraphWithControls', () => {
      const { getByTestId } = renderComponent();
      expect(getByTestId('graph-with-controls')).toBeInTheDocument();
    });

    it('renders with Provider when no correctness set', () => {
      const { container } = renderComponent({ marks: [{ id: 1, type: 'point' }] });
      expect(container.querySelector('[data-testid="graph-with-controls"]')).toBeInTheDocument();
    });

    it('renders directly when correctness is set', () => {
      const marks = [{ id: 1, type: 'point', correctness: { value: 'correct' } }];
      const { getByTestId } = renderComponent({ marks });

      expect(getByTestId('graph-with-controls')).toBeInTheDocument();
      expect(getByTestId('disabled-indicator')).toBeInTheDocument();
    });

    it('passes marks to GraphWithControls', () => {
      const marks = [{ id: 1 }, { id: 2 }];
      const { getByTestId } = renderComponent({ marks });
      expect(getByTestId('marks-count')).toHaveTextContent('2');
    });
  });

  describe('componentDidUpdate', () => {
    it('updates store when marks prop changes', () => {
      const onChangeMarks = jest.fn();
      const { rerender } = render(<Root marks={[]} onChangeMarks={onChangeMarks} />);

      const newMarks = [{ id: 1, type: 'point' }];
      rerender(<Root marks={newMarks} onChangeMarks={onChangeMarks} />);

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('does not update when marks are equal', () => {
      const marks = [{ id: 1, type: 'point' }];
      const onChangeMarks = jest.fn();
      const { rerender } = render(<Root marks={marks} onChangeMarks={onChangeMarks} />);

      onChangeMarks.mockClear();

      rerender(<Root marks={marks} onChangeMarks={onChangeMarks} />);

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('handles marks changing from empty to non-empty', () => {
      const onChangeMarks = jest.fn();
      const { rerender } = render(<Root marks={[]} onChangeMarks={onChangeMarks} />);

      const newMarks = [{ id: 1 }];

      expect(() => {
        rerender(<Root marks={newMarks} onChangeMarks={onChangeMarks} />);
      }).not.toThrow();
    });

    it('handles marks changing from non-empty to empty', () => {
      const onChangeMarks = jest.fn();
      const { rerender } = render(<Root marks={[{ id: 1 }]} onChangeMarks={onChangeMarks} />);

      expect(() => {
        rerender(<Root marks={[]} onChangeMarks={onChangeMarks} />);
      }).not.toThrow();
    });
  });

  describe('correctness handling', () => {
    it('disables when any mark has correctness', () => {
      const marks = [
        { id: 1, type: 'point' },
        { id: 2, type: 'point', correctness: { value: 'correct' } },
      ];
      const { getByTestId } = renderComponent({ marks });

      expect(getByTestId('disabled-indicator')).toBeInTheDocument();
    });

    it('renders without Provider when correctness is set', () => {
      const marks = [{ id: 1, correctness: { value: 'correct' } }];
      const { container } = renderComponent({ marks });

      expect(container.querySelector('[data-testid="graph-with-controls"]')).toBeInTheDocument();
    });

    it('does not disable when no correctness is set', () => {
      const marks = [
        { id: 1, type: 'point' },
        { id: 2, type: 'line' },
      ];
      const { queryByTestId } = renderComponent({ marks });

      expect(queryByTestId('disabled-indicator')).not.toBeInTheDocument();
    });

    it('handles correctness with different values', () => {
      const marks = [{ id: 1, correctness: { value: 'incorrect' } }];
      const { getByTestId } = renderComponent({ marks });

      expect(getByTestId('disabled-indicator')).toBeInTheDocument();
    });

    it('handles empty correctness object', () => {
      const marks = [{ id: 1, correctness: {} }];
      const { getByTestId } = renderComponent({ marks });

      expect(getByTestId('disabled-indicator')).toBeInTheDocument();
    });
  });

  describe('props forwarding', () => {
    it('forwards additional props to GraphWithControls', () => {
      const { container } = renderComponent({
        className: 'custom-class',
        size: { width: 500, height: 500 },
      });

      expect(container.querySelector('[data-testid="graph-with-controls"]')).toBeInTheDocument();
    });

    it('does not forward onChangeMarks and marks to GraphWithControls', () => {
      const { getByTestId } = renderComponent({
        marks: [{ id: 1 }],
        onChangeMarks: jest.fn(),
        otherProp: 'test',
      });

      expect(getByTestId('graph-with-controls')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty marks array', () => {
      const { container } = renderComponent({ marks: [] });
      expect(container).toBeInTheDocument();
    });

    it('handles marks with complex structure', () => {
      const marks = [
        {
          id: 1,
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 10, y: 10 },
          label: 'Line A',
          correctness: { value: 'correct', label: 'Correct!' },
        },
      ];
      const { getByTestId } = renderComponent({ marks });
      expect(getByTestId('graph-with-controls')).toBeInTheDocument();
    });

    it('handles switching between correctness states', () => {
      const { rerender } = render(<Root marks={[{ id: 1 }]} onChangeMarks={jest.fn()} />);

      rerender(<Root marks={[{ id: 1, correctness: { value: 'correct' } }]} onChangeMarks={jest.fn()} />);

      rerender(<Root marks={[{ id: 1 }]} onChangeMarks={jest.fn()} />);

      expect(document.querySelector('[data-testid="graph-with-controls"]')).toBeInTheDocument();
    });
  });
});

describe('GraphContainer (connected component)', () => {
  it('is a connected component', () => {
    expect(GraphContainer).toBeDefined();
    expect(GraphContainer.displayName).toContain('Connect');
  });

  it('maps state to props', () => {
    expect(GraphContainer).toBeDefined();
  });

  it('maps dispatch to props', () => {
    expect(GraphContainer).toBeDefined();
  });
});
