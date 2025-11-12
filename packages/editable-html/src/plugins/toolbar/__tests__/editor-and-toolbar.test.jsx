import { classObject, mockIconButton } from '../../../__tests__/utils';

import { Data, Value } from 'slate';
import { EditorAndToolbar, getClonedChildren } from '../editor-and-toolbar';
import React from 'react';
import debug from 'debug';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../toolbar', () => () => <div>---- toolbar ------ </div>);

mockIconButton();

const log = debug('@pie-lib:editable-html:test:editor-and-toolbar');

describe('toolbar', () => {
  let onDelete, classes;

  beforeEach(() => {
    onDelete = jest.fn();
    classes = classObject('root', 'editorHolder', 'editorInFocus');
  });

  it('renders EditorAndToolbar component', () => {
    const value = Value.fromJSON({});
    Object.defineProperty(value, 'isFocused', { get: jest.fn(() => true) });

    const { container } = render(
      <EditorAndToolbar classes={classes} value={value} plugins={[]} onDone={jest.fn()} onChange={jest.fn()}>
        children
      </EditorAndToolbar>,
    );

    // Verify component rendered
    expect(container.firstChild).toBeInTheDocument();
    // Verify toolbar is present
    expect(screen.getByText('---- toolbar ------')).toBeInTheDocument();
    // Verify children are rendered
    expect(screen.getByText('children')).toBeInTheDocument();
  });
});
