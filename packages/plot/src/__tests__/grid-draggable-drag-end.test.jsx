import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { scaleLinear } from 'd3-scale';
import { gridDraggable } from '../grid-draggable';

/**
 * react-draggable v4 honours the value returned from DraggableCore's `onStop` and bails
 * out of handleDragStop before it detaches the document mousemove/mouseup listeners.
 * v3 ignored that return value and always detached them. If gridDraggable's onStop
 * returns false, every dragged handle stays subscribed to document mousemove forever,
 * so later pointer movement keeps dragging marks that the user is no longer holding.
 */

const Handle = ({ onMouseDown, onMouseUp, onTouchStart, onTouchEnd, style, testid }) => (
  <div
    data-testid={testid}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    style={style}
  />
);

const Draggable = gridDraggable({
  anchorPoint: (props) => ({ x: props.x, y: props.y }),
  fromDelta: (props, delta) => ({ x: props.x + delta.x, y: props.y + delta.y }),
  bounds: () => ({ left: -1000, right: 1000, top: -1000, bottom: 1000 }),
})(Handle);

const graphProps = (rootNode) => ({
  scale: {
    x: scaleLinear().domain([0, 10]).range([0, 400]),
    y: scaleLinear().domain([0, 10]).range([400, 0]),
  },
  snap: { x: (n) => n, y: (n) => n },
  domain: { min: 0, max: 10, step: 1 },
  range: { min: 0, max: 10, step: 1 },
  size: { width: 400, height: 400 },
  getRootNode: () => rootNode,
});

// grid() resolves to [40, -40] for these scales, so a move must clear 20px to register.
const drag = (node, to) => {
  fireEvent.mouseDown(node, { clientX: 0, clientY: 0, button: 0 });
  fireEvent.mouseMove(document, { clientX: to, clientY: 0 });
  fireEvent.mouseUp(document, { clientX: to, clientY: 0 });
};

describe('gridDraggable drag end', () => {
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.removeChild(root);
  });

  it('stops dragging a handle once the mouse is released', () => {
    const onDrag = jest.fn();
    const { getByTestId } = render(
      <Draggable testid="a" x={2} y={2} graphProps={graphProps(root)} onDrag={onDrag} />,
    );

    drag(getByTestId('a'), 40);
    expect(onDrag).toHaveBeenCalled();

    const callsAtRelease = onDrag.mock.calls.length;
    fireEvent.mouseMove(document, { clientX: 240, clientY: 120 });
    expect(onDrag).toHaveBeenCalledTimes(callsAtRelease);
  });

  it('does not drag a previously released handle when another one is dragged', () => {
    const onDragA = jest.fn();
    const onDragB = jest.fn();
    const { getByTestId } = render(
      <>
        <Draggable testid="a" x={2} y={2} graphProps={graphProps(root)} onDrag={onDragA} />
        <Draggable testid="b" x={6} y={6} graphProps={graphProps(root)} onDragB onDrag={onDragB} />
      </>,
    );

    drag(getByTestId('a'), 40);
    expect(onDragA).toHaveBeenCalled();
    onDragA.mockClear();

    // Now drag b. a has been released, so it must not move with it.
    fireEvent.mouseDown(getByTestId('b'), { clientX: 0, clientY: 0, button: 0 });
    fireEvent.mouseMove(document, { clientX: 80, clientY: 0 });

    expect(onDragB).toHaveBeenCalled();
    expect(onDragA).not.toHaveBeenCalled();
  });
});
