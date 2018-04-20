import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';
import { Correct } from '../response-indicators';

describe('response-indicators', () => {

  it('snapshot  - no feedback ', () => {
    const tree = renderer
      .create(<Correct />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('snapshot  - with feedback ', () => {
    const tree = renderer
      .create(<Correct feedback="hi" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});