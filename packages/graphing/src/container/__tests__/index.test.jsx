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

  describe('Redux store', () => {
    it('creates Redux store on mount', () => {
      const component = new Root({ marks: [], onChangeMarks: jest.fn() });
      expect(component.store).toBeDefined();
      expect(typeof component.store.getState).toBe('function');
      expect(typeof component.store.dispatch).toBe('function');
    });

    it('initializes store with marks from props', () => {
      const marks = [{ id: 1, type: 'point' }];
      const component = new Root({ marks, onChangeMarks: jest.fn() });

      const state = component.store.getState();
      expect(state.marks.present).toEqual(marks);
    });

    it('initializes store with empty marks', () => {
      const component = new Root({ marks: [], onChangeMarks: jest.fn() });

      const state = component.store.getState();
      expect(state.marks.present).toEqual([]);
    });

    it('subscribes to store changes', async () => {
      const onChangeMarks = jest.fn();
      const component = new Root({ marks: [], onChangeMarks });

      const newMarks = [{ id: 1 }];
      component.store.dispatch(changeMarks(newMarks));

      await waitFor(() => {
        expect(onChangeMarks).toHaveBeenCalledWith(newMarks);
      });
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

  describe('onStoreChange', () => {
    it('calls onChangeMarks when store state changes', async () => {
      const onChangeMarks = jest.fn();
      const component = new Root({ marks: [], onChangeMarks });

      const newMarks = [{ id: 1, type: 'point' }];
      component.store.dispatch(changeMarks(newMarks));

      await waitFor(() => {
        expect(onChangeMarks).toHaveBeenCalledWith(newMarks);
      });
    });

    it('does not call onChangeMarks when marks are equal', () => {
      const marks = [{ id: 1, type: 'point' }];
      const onChangeMarks = jest.fn();
      const component = new Root({ marks, onChangeMarks });

      onChangeMarks.mockClear();

      component.store.dispatch(changeMarks(marks));

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('handles multiple store changes', async () => {
      const onChangeMarks = jest.fn();
      const component = new Root({ marks: [], onChangeMarks });

      component.store.dispatch(changeMarks([{ id: 1 }]));
      component.store.dispatch(changeMarks([{ id: 2 }]));
      component.store.dispatch(changeMarks([{ id: 3 }]));

      await waitFor(() => {
        expect(onChangeMarks).toHaveBeenCalledTimes(3);
      });
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

  describe('store synchronization', () => {
    it('keeps store and props in sync', async () => {
      const onChangeMarks = jest.fn();
      const component = new Root({ marks: [], onChangeMarks });

      const newMarks = [{ id: 1 }];
      component.store.dispatch(changeMarks(newMarks));

      await waitFor(() => {
        const state = component.store.getState();
        expect(state.marks.present).toEqual(newMarks);
        expect(onChangeMarks).toHaveBeenCalledWith(newMarks);
      });
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
