import React from 'react';
import Toolbar from '../image-toolbar';
import renderer from 'react-test-renderer';
import { Data, Block, Value } from 'slate';

it('renders correctly', () => {
  const classes = { holder: 'holder' };

  const tree = renderer
    .create(<Toolbar percent={50} classes={classes} onChange={jest.fn()} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
