import { render } from '@testing-library/react';
import React from 'react';
import { gridDraggable } from '../grid-draggable';
import { getDelta } from '../utils';
import { pointer } from 'd3-selection';

jest.mock('d3-selection', () => ({
  pointer: jest.fn().mockReturnValue([0, 0]),
}));

let mockDraggableCoreProps;
jest.mock('../draggable', () => ({
  DraggableCore: (props) => {
    // Store the props so tests can call the handlers
    mockDraggableCoreProps = props;
    return props.children;
  },
}));

jest.mock('../utils', () => ({
  getDelta: jest.fn(),
}));

const xyFn = () => {
  const out = jest.fn((n) => n);
  out.invert = jest.fn((n) => n);
  return out;
};

const getGraphProps = () => ({
  scale: {
    x: xyFn(),
    y: xyFn(),
  },
  snap: {
    x: xyFn(),
    y: xyFn(),
  },
  domain: {
    min: 0,
    max: 1,
    step: 1,
  },
  range: {
    min: 0,
    max: 1,
    step: 1,
  },
  size: {
    width: 500,
    height: 500,
  },
  getRootNode: () => ({
    ownerSVGElement: null,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    }),
  }),
});

describe('gridDraggable', () => {
  let defaultOptions;
  let defaultProps;

  beforeEach(() => {
    mockDraggableCoreProps = null;
    defaultOptions = {
      anchorPoint: jest.fn().mockReturnValue({ x: 0, y: 0 }),
      bounds: jest.fn().mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 }),
      fromDelta: jest.fn(),
    };

    defaultProps = {
      graphProps: getGraphProps(),
    };
  });

  it('renders regular component', () => {
    const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
    const { container } = render(<Comp {...defaultProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with decimal domain and range', () => {
    const props = {
      ...defaultProps,
      graphProps: {
        ...getGraphProps(),
        domain: {
          min: -1.5,
          max: 1.6,
          step: 0.3,
        },
        range: {
          min: -2,
          max: 3,
          step: 0.2,
        },
      },
    };
    const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
    const { container } = render(<Comp {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('logic', () => {
    describe('grid calculation', () => {
      it('passes correct grid to DraggableCore based on domain and range step', () => {
        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...defaultProps} />);

        // Grid is calculated as: scale.x(domain.step) - scale.x(0)
        // With our mock xyFn that returns n, this is: step - 0 = step
        expect(mockDraggableCoreProps.grid).toEqual([1, 1]);
      });

      it('calculates grid with decimal steps', () => {
        const props = {
          ...defaultProps,
          graphProps: {
            ...getGraphProps(),
            domain: { min: -1.5, max: 1.6, step: 0.3 },
            range: { min: -2, max: 3, step: 0.2 },
          },
        };
        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...props} />);

        expect(mockDraggableCoreProps.grid).toEqual([0.3, 0.2]);
      });
    });

    describe('onStart', () => {
      it('calls onDragStart handler when drag starts', () => {
        const onDragStart = jest.fn();
        const props = { ...defaultProps, onDragStart };
        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...props} />);

        // Simulate drag start
        mockDraggableCoreProps.onStart({ clientX: 100, clientY: 100 });

        expect(onDragStart).toHaveBeenCalled();
      });
    });

    describe('onDrag', () => {
      it('calls onDrag callback with result from fromDelta', () => {
        const onDrag = jest.fn();
        const fromDelta = jest.fn().mockReturnValue('delta-result');
        const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 100, right: 100 });
        const options = { ...defaultOptions, fromDelta, bounds };
        const props = { ...defaultProps, onDrag };

        const Comp = gridDraggable(options)(() => <div>Test</div>);
        render(<Comp {...props} />);

        // Set up drag start state
        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });

        // Simulate drag
        mockDraggableCoreProps.onDrag({}, { deltaX: 10, deltaY: 10 });

        expect(fromDelta).toHaveBeenCalled();
        expect(onDrag).toHaveBeenCalledWith('delta-result');
      });

      it('does not call onDrag when no onDrag handler is provided', () => {
        const fromDelta = jest.fn();
        const options = { ...defaultOptions, fromDelta };
        const Comp = gridDraggable(options)(() => <div>Test</div>);
        render(<Comp {...defaultProps} />);

        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
        mockDraggableCoreProps.onDrag({}, { deltaX: 10, deltaY: 10 });

        expect(fromDelta).not.toHaveBeenCalled();
      });

      describe('bounds checking', () => {
        it('does not call onDrag when dragging left beyond left bound', () => {
          const onDrag = jest.fn();
          const bounds = jest.fn().mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 });
          const fromDelta = jest.fn().mockReturnValue('result');
          const options = { ...defaultOptions, bounds, fromDelta };
          const props = { ...defaultProps, onDrag };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          // deltaX < 0 and deltaX < scaled bounds.left (0), so -10 < 0 triggers early return
          mockDraggableCoreProps.onDrag({}, { deltaX: -10, deltaY: 0 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('does not call onDrag when dragging right beyond right bound', () => {
          const onDrag = jest.fn();
          const bounds = jest.fn().mockReturnValue({ left: 0, top: 0, bottom: 0, right: 0 });
          const fromDelta = jest.fn().mockReturnValue('result');
          const options = { ...defaultOptions, bounds, fromDelta };
          const props = { ...defaultProps, onDrag };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          // deltaX > 0 and deltaX > scaled bounds.right (0), so 10 > 0 triggers early return
          mockDraggableCoreProps.onDrag({}, { deltaX: 10, deltaY: 0 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('does not call onDrag when dragging up beyond top bound', () => {
          const onDrag = jest.fn();
          const bounds = jest.fn().mockReturnValue({ left: -100, top: 0, bottom: 0, right: 100 });
          const fromDelta = jest.fn().mockReturnValue('result');
          const options = { ...defaultOptions, bounds, fromDelta };
          const props = { ...defaultProps, onDrag };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          // deltaY < 0 and deltaY < scaled bounds.top (0), so -10 < 0 triggers early return
          mockDraggableCoreProps.onDrag({}, { deltaX: 0, deltaY: -10 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('does not call onDrag when dragging down beyond bottom bound', () => {
          const onDrag = jest.fn();
          const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 0, right: 100 });
          const fromDelta = jest.fn().mockReturnValue('result');
          const options = { ...defaultOptions, bounds, fromDelta };
          const props = { ...defaultProps, onDrag };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          // deltaY > 0 and deltaY > scaled bounds.bottom (0), so 10 > 0 triggers early return
          mockDraggableCoreProps.onDrag({}, { deltaX: 0, deltaY: 10 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('calls onDrag when dragging within bounds', () => {
          const onDrag = jest.fn();
          const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 100, right: 100 });
          const fromDelta = jest.fn().mockReturnValue('result');
          const options = { ...defaultOptions, bounds, fromDelta };
          const props = { ...defaultProps, onDrag };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          // All bound checks pass: deltaX (-10) is NOT < bounds.left (-100) and NOT > bounds.right (100)
          // Similarly for deltaY
          mockDraggableCoreProps.onDrag({}, { deltaX: -10, deltaY: 10 });

          expect(onDrag).toHaveBeenCalled();
        });
      });

      describe('skipDragOutsideOfBounds', () => {
        it('skips drag when moving left and x is below domain.min', () => {
          const onDrag = jest.fn();
          const graphProps = {
            ...getGraphProps(),
            domain: { min: -5, max: 5, step: 1 },
            range: { min: -5, max: 5, step: 1 },
          };
          graphProps.scale.x.invert = jest.fn().mockReturnValue(-6); // Below min

          const props = { ...defaultProps, graphProps, onDrag };
          const bounds = jest.fn().mockReturnValue({ left: 100, top: 100, bottom: 100, right: 100 });
          const options = { ...defaultOptions, bounds };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          mockDraggableCoreProps.onDrag({}, { deltaX: 1, deltaY: 0 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('skips drag when moving right and x is above domain.max', () => {
          const onDrag = jest.fn();
          const graphProps = {
            ...getGraphProps(),
            domain: { min: -5, max: 5, step: 1 },
            range: { min: -5, max: 5, step: 1 },
          };
          graphProps.scale.x.invert = jest.fn().mockReturnValue(6); // Above max

          const props = { ...defaultProps, graphProps, onDrag };
          const bounds = jest.fn().mockReturnValue({ left: 100, top: 100, bottom: 100, right: 100 });
          const options = { ...defaultOptions, bounds };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          mockDraggableCoreProps.onDrag({}, { deltaX: -1, deltaY: 0 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('skips drag when moving up and y is above range.max', () => {
          const onDrag = jest.fn();
          const graphProps = {
            ...getGraphProps(),
            domain: { min: -5, max: 5, step: 1 },
            range: { min: -5, max: 5, step: 1 },
          };
          graphProps.scale.y.invert = jest.fn().mockReturnValue(6); // Above max

          const props = { ...defaultProps, graphProps, onDrag };
          const bounds = jest.fn().mockReturnValue({ left: 100, top: 100, bottom: 100, right: 100 });
          const options = { ...defaultOptions, bounds };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          mockDraggableCoreProps.onDrag({}, { deltaX: 0, deltaY: 1 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('skips drag when moving down and y is below range.min', () => {
          const onDrag = jest.fn();
          const graphProps = {
            ...getGraphProps(),
            domain: { min: -5, max: 5, step: 1 },
            range: { min: -5, max: 5, step: 1 },
          };
          graphProps.scale.y.invert = jest.fn().mockReturnValue(-6); // Below min

          const props = { ...defaultProps, graphProps, onDrag };
          const bounds = jest.fn().mockReturnValue({ left: 100, top: 100, bottom: 100, right: 100 });
          const options = { ...defaultOptions, bounds };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          mockDraggableCoreProps.onDrag({}, { deltaX: 0, deltaY: -1 });

          expect(onDrag).not.toHaveBeenCalled();
        });

        it('allows drag when within domain and range', () => {
          const onDrag = jest.fn();
          const graphProps = {
            ...getGraphProps(),
            domain: { min: -5, max: 5, step: 1 },
            range: { min: -5, max: 5, step: 1 },
          };
          graphProps.scale.x.invert = jest.fn().mockReturnValue(3); // Within bounds
          graphProps.scale.y.invert = jest.fn().mockReturnValue(2); // Within bounds

          const props = { ...defaultProps, graphProps, onDrag };
          const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 100, right: 100 });
          const options = { ...defaultOptions, bounds };

          const Comp = gridDraggable(options)(() => <div>Test</div>);
          render(<Comp {...props} />);

          mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
          mockDraggableCoreProps.onDrag({}, { deltaX: 1, deltaY: -1 });

          expect(onDrag).toHaveBeenCalled();
        });
      });
    });

    describe('getDelta and applyDelta', () => {
      it('calls utils.getDelta when processing drag', () => {
        getDelta.mockClear();
        const onDrag = jest.fn();
        const props = { ...defaultProps, onDrag };
        const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 100, right: 100 });
        const options = { ...defaultOptions, bounds };

        const Comp = gridDraggable(options)(() => <div>Test</div>);
        render(<Comp {...props} />);

        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
        mockDraggableCoreProps.onDrag({}, { deltaX: 10, deltaY: 10 });

        expect(getDelta).toHaveBeenCalled();
      });

      it('calls fromDelta with result from getDelta', () => {
        const fromDelta = jest.fn();
        getDelta.mockReturnValue({ x: 5, y: 5 });
        const bounds = jest.fn().mockReturnValue({ left: -100, top: -100, bottom: 100, right: 100 });
        const options = { ...defaultOptions, fromDelta, bounds };
        const props = { ...defaultProps, onDrag: jest.fn() };

        const Comp = gridDraggable(options)(() => <div>Test</div>);
        render(<Comp {...props} />);

        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
        mockDraggableCoreProps.onDrag({}, { deltaX: 10, deltaY: 10 });

        expect(fromDelta).toHaveBeenCalled();
      });
    });

    describe('onStop', () => {
      it('calls onDragStop when drag stops', () => {
        const onDragStop = jest.fn();
        const props = { ...defaultProps, onDragStop };

        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...props} />);

        // Start to set up state
        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });

        // Stop with large movement (not tiny)
        mockDraggableCoreProps.onStop({ clientX: 100, clientY: 100 }, {});

        expect(onDragStop).toHaveBeenCalled();
      });

      it('calls onClick instead of onDragStop when movement is tiny', () => {
        const onClick = jest.fn();
        const onDragStop = jest.fn();
        const props = { ...defaultProps, onClick, onDragStop };

        pointer.mockReturnValue([0, 0]);

        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...props} />);

        // Start and stop at almost the same position (tiny movement)
        // Grid is 1x1, tiny threshold is grid/10 = 0.1
        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
        mockDraggableCoreProps.onStop({ clientX: 0.05, clientY: 0.05, target: {} }, {});

        expect(onClick).toHaveBeenCalledWith({ x: 0, y: 0 });
      });

      it('calls onClick with snapped coordinates', () => {
        const onClick = jest.fn();
        const props = { ...defaultProps, onClick };
        const graphProps = getGraphProps();
        graphProps.scale.x.invert = jest.fn().mockReturnValue(1.7);
        graphProps.scale.y.invert = jest.fn().mockReturnValue(2.3);
        graphProps.snap.x = jest.fn().mockReturnValue(2);
        graphProps.snap.y = jest.fn().mockReturnValue(2);

        pointer.mockReturnValue([1.7, 2.3]);

        const propsWithGraphProps = { ...props, graphProps };
        const Comp = gridDraggable(defaultOptions)(() => <div>Test</div>);
        render(<Comp {...propsWithGraphProps} />);

        // Start and stop at almost the same position (tiny movement)
        mockDraggableCoreProps.onStart({ clientX: 0, clientY: 0 });
        mockDraggableCoreProps.onStop({ clientX: 0.05, clientY: 0.05, target: {} }, {});

        expect(graphProps.snap.x).toHaveBeenCalledWith(1.7);
        expect(graphProps.snap.y).toHaveBeenCalledWith(2.3);
        expect(onClick).toHaveBeenCalledWith({ x: 2, y: 2 });
      });
    });
  });
});
