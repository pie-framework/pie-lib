import { classObject, mockIconButton } from '../../../__tests__/utils';

import { Data, Value } from 'slate';
import { EditorAndToolbar, getClonedChildren } from '../editor-and-toolbar';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';

jest.mock('../toolbar', () => () => <div>---- toolbar ------ </div>);

mockIconButton();

const log = debug('@pie-lib:editable-html:test:editor-and-toolbar');

describe('toolbar', () => {
  let onDelete, classes;

  beforeEach(() => {
    onDelete = jest.fn();
    classes = classObject('root', 'editorHolder', 'editorInFocus');
  });

  it('renders', () => {
    const value = Value.fromJSON({});
    Object.defineProperty(value, 'isFocused', { get: jest.fn(() => true) });

    const tree = renderer
      .create(
        <EditorAndToolbar
          classes={classes}
          value={value}
          plugins={[]}
          onDone={jest.fn()}
          onChange={jest.fn()}
        >
          children
        </EditorAndToolbar>
      )
      .toJSON();
    log('tree: ', JSON.stringify(tree, null, '  '));
    expect(tree).toMatchSnapshot();
  });
});
