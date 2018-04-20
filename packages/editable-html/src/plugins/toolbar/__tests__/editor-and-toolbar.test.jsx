import { classObject, mockIconButton } from '../../../__tests__/utils';

import { Data } from 'slate';
import { RawEditorAndToolbar } from '../editor-and-toolbar';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';

jest.mock('../toolbar', () => () => <div>---- toolbar ------ </div>);

mockIconButton();

const log = debug('editable-html:test:editor-and-toolbar');

describe('toolbar', () => {
  let onDelete, classes;

  beforeEach(() => {
    onDelete = jest.fn();
    classes = classObject('root', 'editorHolder', 'editorInFocus');
  });

  it('renders', () => {
    log(RawEditorAndToolbar);

    const value = {
      isFocused: true
    };
    const tree = renderer
      .create(
        <RawEditorAndToolbar
          classes={classes}
          value={value}
          onDone={() => ({})}
        />
      )
      .toJSON();
    log('tree: ', JSON.stringify(tree, null, '  '));
    expect(tree).toMatchSnapshot();
  });
});
