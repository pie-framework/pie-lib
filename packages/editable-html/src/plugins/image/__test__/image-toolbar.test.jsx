import React from 'react';
import Toolbar from '../image-toolbar';
import renderer from 'react-test-renderer';
import {Data} from 'slate';

it('renders correctly', () => {

  const node = { 
    data: Data.create({
    resizePercent: 100
  })};

  const classes = {holder:'holder'};

  const tree = renderer
    .create(<Toolbar node={node} classes={classes} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});