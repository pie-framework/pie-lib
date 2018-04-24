import React from 'react';
import Toolbar from '../image-toolbar';
import renderer from 'react-test-renderer';
import { Data, Block, Value } from 'slate';

it('renders correctly', () => {
  const node = Block.fromJSON({
    type: 'image',
    data: Data.create({
      resizePercent: 100
    })
  });

  const classes = { holder: 'holder' };

  const tree = renderer
    .create(
      <Toolbar
        node={node}
        classes={classes}
        value={Value.fromJSON({})}
        onChange={jest.fn()}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
