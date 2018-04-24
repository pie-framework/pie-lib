import React from 'react';
import FeedbackMenu from '../feedback-menu';
import renderer from 'react-test-renderer';

describe('feedback-menu', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<FeedbackMenu onChange={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
