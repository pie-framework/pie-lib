import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { Root } from '../root';
import { select, pointer } from 'd3-selection';

jest.mock('d3-selection', () => ({
  select: jest.fn(),
  pointer: jest.fn(),
}));

const scaleMock = () => {
  const fn = jest.fn((n) => n);
  fn.invert = jest.fn((n) => n);
  return fn;
};

const graphProps = () => ({
  scale: {
    x: scaleMock(),
    y: scaleMock(),
  },
  snap: {
    x: jest.fn((n) => n),
    y: jest.fn((n) => n),
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
    width: 400,
    height: 400,
  },
});

describe('root', () => {
  let mockOn;
  let defaultProps;

  beforeEach(() => {
    mockOn = jest.fn();
    select.mockReturnValue({
      on: mockOn,
    });
    pointer.mockReturnValue([0, 0]);

    defaultProps = {
      classes: {},
      graphProps: graphProps(),
    };
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders with children', () => {
    const { container, getByText } = render(<Root {...defaultProps}>hi</Root>);
    expect(container.firstChild).toBeInTheDocument();
    expect(getByText('hi')).toBeInTheDocument();
  });

  describe('logic', () => {
    describe('mousemove', () => {
      describe('mount/unmount', () => {
        it('adds mousemove listener on componentDidMount', () => {
          render(<Root {...defaultProps}>hi</Root>);

          // Verify that select was called with the g element
          expect(select).toHaveBeenCalled();

          // Verify that on() was called with 'mousemove' and a function
          expect(mockOn).toHaveBeenCalledWith('mousemove', expect.any(Function));
        });

        it('removes mousemove listener on componentWillUnmount', () => {
          const { unmount } = render(<Root {...defaultProps}>hi</Root>);

          // Clear previous calls to isolate unmount behavior
          mockOn.mockClear();
          select.mockClear();

          unmount();

          // Verify that select was called during unmount
          expect(select).toHaveBeenCalled();

          // Verify that on() was called with 'mousemove' and null to remove the listener
          expect(mockOn).toHaveBeenCalledWith('mousemove', null);
        });
      });

      describe('mouseMove function', () => {
        it('calls pointer with correct arguments', () => {
          const onMouseMove = jest.fn();
          const gp = graphProps();
          const props = {
            ...defaultProps,
            onMouseMove,
            graphProps: gp,
          };

          const mockNode = document.createElement('div');
          const mockEvent = { clientX: 10, clientY: 20 };
          const mockSelection = {
            _groups: [[mockNode]],
            node: () => mockNode,
          };

          // Mock select to return our mockSelection
          select.mockReturnValue({
            ...mockSelection,
            on: (event, handler) => {
              mockOn(event, handler);
              // When 'mousemove' is registered, immediately test it
              if (event === 'mousemove' && handler) {
                pointer.mockReturnValue([10, 20]);
                // Handler is bound with mockSelection as first arg, so call with event
                handler(mockEvent);
              }
            },
          });

          render(<Root {...props}>hi</Root>);

          // Verify pointer was called with the event and node
          expect(pointer).toHaveBeenCalledWith(mockEvent, mockNode);
        });

        it('calls scale.x.invert and scale.y.invert', () => {
          const onMouseMove = jest.fn();
          const gp = graphProps();
          const props = {
            ...defaultProps,
            onMouseMove,
            graphProps: gp,
          };

          const mockNode = document.createElement('div');
          const mockEvent = { clientX: 15, clientY: 25 };
          const mockSelection = {
            _groups: [[mockNode]],
            node: () => mockNode,
          };

          select.mockReturnValue({
            ...mockSelection,
            on: (event, handler) => {
              mockOn(event, handler);
              if (event === 'mousemove' && handler) {
                pointer.mockReturnValue([15, 25]);
                handler(mockEvent);
              }
            },
          });

          render(<Root {...props}>hi</Root>);

          expect(gp.scale.x.invert).toHaveBeenCalledWith(15);
          expect(gp.scale.y.invert).toHaveBeenCalledWith(25);
        });

        it('calls snap.x and snap.y with inverted coordinates', () => {
          const onMouseMove = jest.fn();
          const gp = graphProps();
          gp.scale.x.invert = jest.fn().mockReturnValue(5);
          gp.scale.y.invert = jest.fn().mockReturnValue(10);
          const props = {
            ...defaultProps,
            onMouseMove,
            graphProps: gp,
          };

          const mockNode = document.createElement('div');
          const mockEvent = { clientX: 15, clientY: 25 };
          const mockSelection = {
            _groups: [[mockNode]],
            node: () => mockNode,
          };

          select.mockReturnValue({
            ...mockSelection,
            on: (event, handler) => {
              mockOn(event, handler);
              if (event === 'mousemove' && handler) {
                pointer.mockReturnValue([15, 25]);
                handler(mockEvent);
              }
            },
          });

          render(<Root {...props}>hi</Root>);

          expect(gp.snap.x).toHaveBeenCalledWith(5);
          expect(gp.snap.y).toHaveBeenCalledWith(10);
        });

        it('calls onMouseMove handler with snapped coordinates', () => {
          const onMouseMove = jest.fn();
          const gp = graphProps();
          gp.scale.x.invert = jest.fn().mockReturnValue(7);
          gp.scale.y.invert = jest.fn().mockReturnValue(14);
          gp.snap.x = jest.fn().mockReturnValue(10);
          gp.snap.y = jest.fn().mockReturnValue(15);

          const props = {
            ...defaultProps,
            onMouseMove,
            graphProps: gp,
          };

          const mockNode = document.createElement('div');
          const mockEvent = { clientX: 100, clientY: 200 };
          const mockSelection = {
            _groups: [[mockNode]],
            node: () => mockNode,
          };

          select.mockReturnValue({
            ...mockSelection,
            on: (event, handler) => {
              mockOn(event, handler);
              if (event === 'mousemove' && handler) {
                pointer.mockReturnValue([100, 200]);
                handler(mockEvent);
              }
            },
          });

          render(<Root {...props}>hi</Root>);

          expect(onMouseMove).toHaveBeenCalledWith({ x: 10, y: 15 });
        });

        it('does not call onMouseMove when handler is not provided', () => {
          const gp = graphProps();
          const props = {
            ...defaultProps,
            graphProps: gp,
          };

          const mockNode = document.createElement('div');
          const mockEvent = { clientX: 100, clientY: 200 };
          const mockSelection = {
            _groups: [[mockNode]],
            node: () => mockNode,
          };

          select.mockReturnValue({
            ...mockSelection,
            on: (event, handler) => {
              mockOn(event, handler);
              if (event === 'mousemove' && handler) {
                pointer.mockReturnValue([100, 200]);
                // Should not throw error when onMouseMove is not provided
                expect(() => handler(mockEvent)).not.toThrow();
              }
            },
          });

          render(<Root {...props}>hi</Root>);

          // Verify scale methods were not called (early return in mouseMove)
          expect(gp.scale.x.invert).not.toHaveBeenCalled();
          expect(gp.scale.y.invert).not.toHaveBeenCalled();
        });
      });
    });
  });
});
