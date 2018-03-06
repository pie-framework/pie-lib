import { classObject, mockIconButton } from '../../../__test__/utils';

import { Data } from 'slate';
import { RawMarkButton, RawButton } from '../toolbar-buttons';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';
import { stub } from 'sinon';

mockIconButton();

const log = debug('editable-html:test:editor-and-toolbar');

describe('Button', () => {

  it('renders', () => {
    const classes = classObject('root');
    const tree = renderer.create(<RawButton classes={classes} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('MarkButton', () => {

  const classes = classObject('button', 'root', 'active');

  it('renders not active', () => {
    const tree = renderer.create(<RawMarkButton
      active={false}
      classes={classes} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders active', () => {
    const tree = renderer.create(<RawMarkButton
      active={true}
      classes={classes} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
