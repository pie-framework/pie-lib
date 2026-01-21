import React from 'react';
import Toolbar from '../image-toolbar';
import { render } from '@testing-library/react';
import { Data, Block, Value } from 'slate';

it('renders image toolbar', () => {
  const classes = { holder: 'holder' };

  const { container } = render(<Toolbar percent={50} classes={classes} onChange={jest.fn()} />);

  // Verify the toolbar is rendered
  expect(container.firstChild).toBeInTheDocument();
});
