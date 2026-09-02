import React from 'react';
import { render } from '@testing-library/react';
import RD, { DraggableCore as RDCore } from 'react-draggable';
import Draggable, { DraggableCore } from '../draggable';

describe('draggable', () => {
  it('renders with children', () => {
    const { container } = render(
      <Draggable>
        <div>hellow</div>
      </Draggable>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('re-exports react-draggable unchanged', () => {
    expect(Draggable).toBe(RD);
    expect(DraggableCore).toBe(RDCore);
  });

  it('applies a transform from the controlled position prop', () => {
    const Wrap = ({ x, y }) => (
      <Draggable position={{ x, y }}>
        <div data-testid="draggable-child">content</div>
      </Draggable>
    );

    const { rerender, getByTestId } = render(<Wrap x={100} y={100} />);
    const child = getByTestId('draggable-child');
    expect(child.style.transform).toBe('translate(100px,100px)');

    rerender(<Wrap x={200} y={200} />);
    expect(child.style.transform).toBe('translate(200px,200px)');

    rerender(<Wrap x={0} y={0} />);
    expect(child.style.transform).toBe('translate(0px,0px)');
  });
});
