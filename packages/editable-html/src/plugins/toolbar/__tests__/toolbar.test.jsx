import {
  classObject,
  mockIconButton,
  mockMathInput
} from '../../../__tests__/utils';
import { shallow } from 'enzyme';

import { Data, Value, Inline } from 'slate';
import { Toolbar } from '../toolbar';
import React from 'react';
import debug from 'debug';
import renderer from 'react-test-renderer';

mockMathInput();

jest.mock('@material-ui/core/IconButton', () => {
  return props => (
    <div
      className={props.className}
      style={props.style}
      ariaLabel={props['aria-label']}
    />
  );
});

let node = Inline.fromJSON({ type: 'i' });
let value;
const log = debug('@pie-lib:editable-html:test:toolbar');

describe('toolbar', () => {
  let onDelete, classes, document;

  beforeEach(() => {
    onDelete = jest.fn();

    value = Value.fromJSON({});
    document = {
      getClosestInline: jest.fn().mockReturnValue(node)
    };

    Object.defineProperties(value, {
      isCollapsed: {
        get: jest.fn(() => true)
      },
      startKey: {
        get: jest.fn(() => '1')
      },
      document: {
        get: jest.fn(() => document)
      }
    });

    classes = classObject(
      'iconRoot',
      'inline',
      'toolbar',
      'focused',
      'shared',
      'inline'
    );
  });

  test('renders custom toolbar', () => {
    const plugins = [
      {
        deleteNode: () => true,
        toolbar: {
          supports: () => true,
          customToolbar: () => () => (
            <div> --------- custom toolbar ----------- </div>
          )
        }
      }
    ];

    const tree = renderer
      .create(
        <Toolbar
          plugins={plugins}
          classes={classes}
          value={value}
          onDone={jest.fn()}
          onChange={jest.fn()}
        />
      )
      .toJSON();

    log('tree: ', JSON.stringify(tree, null, '  '));
    expect(tree).toMatchSnapshot();
  });

  it('does not render disabled plugins', () => {
    const plugins = [
      {
        deleteNode: () => true,
        toolbar: {
          supports: () => true,
          customToolbar: () => () => (
            <div> --------- custom toolbar ----------- </div>
          )
        },
      },
      {
        deleteNode: () => true,
        toolbar: {},
        name: 'image'
      }
    ];

    const wrapper = shallow(
      <Toolbar
        plugins={plugins}
        classes={classes}
        value={value}
        onDone={jest.fn()}
        onChange={jest.fn()}
      />
    );

    const toolbarPluginsLength = wrapper.instance().filterDefaultToolbarPlugins().length;

    wrapper.setProps({ pluginProps: {
      image: {
        disabled: true
      }
    }});

    expect(wrapper.instance().filterDefaultToolbarPlugins().length).toEqual(toolbarPluginsLength - 1);

    wrapper.setProps({ pluginProps: {
      image: {
        disabled: false
      }
    }});

    expect(wrapper.instance().filterDefaultToolbarPlugins().length).toEqual(toolbarPluginsLength);

  });

  describe('default', () => {
    let plugins;

    beforeEach(() => {
      plugins = [];
    });

    test('renders default toolbar', () => {
      const tree = renderer
        .create(
          <Toolbar
            plugins={plugins}
            classes={classes}
            value={value}
            onDone={jest.fn()}
            onChange={jest.fn()}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
