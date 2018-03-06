import Keypad from '../keypad';
import React from 'react';
import renderer from 'react-test-renderer';

test('Keypad', () => {
  const notReadOnly = renderer.create(<Keypad />);
  let tree = notReadOnly.toJSON();
  expect(tree).toMatchSnapshot();
});
