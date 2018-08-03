import { classObject, mockIconButton } from '../../../__tests__/utils';

import { Data } from 'slate';
import { RawMarkButton, RawButton } from '../toolbar-buttons';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';

mockIconButton();

const log = debug('@pie-lib:editable-html:test:editor-and-toolbar');

describe('Button', () => {
  it('renders', () => {
    const classes = classObject('root');
    const tree = renderer
      .create(
        <RawButton onClick={jest.fn()} classes={classes}>
          children
        </RawButton>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('MarkButton', () => {
  const classes = classObject('button', 'root', 'active');

  it('renders not active', () => {
    const tree = renderer
      .create(
        <RawMarkButton
          mark={'i'}
          onToggle={jest.fn()}
          active={false}
          classes={classes}
        >
          children
        </RawMarkButton>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders active', () => {
    const tree = renderer
      .create(
        <RawMarkButton
          mark={'i'}
          onToggle={jest.fn()}
          active={true}
          classes={classes}
        >
          children
        </RawMarkButton>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
