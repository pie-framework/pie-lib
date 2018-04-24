import { Data, Block } from 'slate';
import { Component } from '../component';
import React from 'react';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const node = Block.fromJSON({
    type: 'image',
    data: Data.create({
      resizePercent: 50,
      width: 50,
      height: 50,
      percent: 50
    })
  });

  const editor = {
    value: {},
    change: jest.fn()
  };

  const onDelete = jest.fn();

  const classes = {
    active: 'active',
    loading: 'loading',
    pendingDelete: 'pendingDelete'
  };

  const tree = renderer
    .create(
      <Component
        node={node}
        editor={editor}
        classes={classes}
        onDelete={onDelete}
      />,
      {
        createNodeMock: el => {
          if (el.type === 'img') {
            return {
              naturalWidth: 100,
              naturalHeight: 100
            };
          }
        }
      }
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
