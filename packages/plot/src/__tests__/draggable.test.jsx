import React from 'react';
import { render } from '@testing-library/react';
import Draggable from '../draggable';

describe('draggable', () => {
  it('renders with children', () => {
    const { container } = render(
      <Draggable>
        <div>hellow</div>
      </Draggable>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
