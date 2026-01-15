import { classObject, mockMathInput } from '../../../__tests__/utils';
import { Data, Value, Inline } from 'slate';
import { Toolbar } from '../toolbar';
import React from 'react';
import { render, screen } from '@testing-library/react';

mockMathInput();

jest.mock('@mui/material/IconButton', () => {
  return (props) => {
    const { children, onClick, buttonRef, ...rest } = props;
    return (
      <button onClick={onClick} {...rest}>
        {children}
      </button>
    );
  };
});

let node = Inline.fromJSON({ type: 'i' });
let parentNode = Inline.fromJSON({
  type: 'i',
});
let value;

describe('toolbar', () => {
  let onDelete, classes, document, toolbarOpts;

  beforeEach(() => {
    onDelete = jest.fn();

    toolbarOpts = {
      position: 'bottom',
      alwaysVisible: false,
    };

    value = Value.fromJSON({});
    document = {
      getClosestInline: jest.fn().mockReturnValue(node),
      getParent: jest.fn().mockReturnValue(),
    };

    Object.defineProperties(value, {
      isCollapsed: {
        get: jest.fn(() => true),
      },
      startKey: {
        get: jest.fn(() => '1'),
      },
      document: {
        get: jest.fn(() => document),
      },
    });

    classes = classObject('iconRoot', 'inline', 'toolbar', 'focused', 'shared', 'inline', 'pie-toolbar');
  });

  test('renders custom toolbar', () => {
    const plugins = [
      {
        deleteNode: () => true,
        toolbar: {
          supports: () => true,
          customToolbar: () => () => <div>custom toolbar content</div>,
        },
      },
    ];

    const { container } = render(
      <Toolbar
        toolbarOpts={toolbarOpts}
        plugins={plugins}
        classes={classes}
        value={value}
        onDone={jest.fn()}
        onChange={jest.fn()}
      />,
    );

    // Verify the custom toolbar content is rendered
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('custom toolbar content')).toBeInTheDocument();
  });

  describe('default', () => {
    let plugins;

    beforeEach(() => {
      plugins = [];
    });

    test('renders default toolbar', () => {
      const { container } = render(
        <Toolbar
          toolbarOpts={toolbarOpts}
          plugins={plugins}
          classes={classes}
          value={value}
          onDone={jest.fn()}
          onChange={jest.fn()}
        />,
      );

      // Verify the toolbar is rendered
      expect(container.firstChild).toBeInTheDocument();

      // The default toolbar should render the DefaultToolbar component
      // which includes a Done button
      expect(screen.getByLabelText('Done')).toBeInTheDocument();
    });
  });
});
