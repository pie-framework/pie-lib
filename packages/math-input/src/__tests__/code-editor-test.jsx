import CodeEditor from '../code-editor';
import React from 'react';
import renderer from 'react-test-renderer';

test('CodeEditor', () => {
  const notReadOnly = renderer.create(<CodeEditor />);
  let tree = notReadOnly.toJSON();
  expect(tree).toMatchSnapshot();
});
