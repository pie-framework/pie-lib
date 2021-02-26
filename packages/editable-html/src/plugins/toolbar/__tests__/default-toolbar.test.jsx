import { classObject, mockIconButton, mockMathInput } from '../../../__tests__/utils';
import { shallow } from 'enzyme';
import React from 'react';

import { Data, Value, Inline } from 'slate';
import { DefaultToolbar, ToolbarButton } from '../default-toolbar';
import { DoneButton } from '../done-button';
import debug from 'debug';
import renderer from 'react-test-renderer';

mockMathInput();

jest.mock('@material-ui/core/IconButton', () => {
  return props => (
    <div className={props.className} style={props.style} ariaLabel={props['aria-label']} />
  );
});

let node = Inline.fromJSON({ type: 'i' });
let value;
const log = debug('@pie-lib:editable-html:test:toolbar');

describe('default-toolbar', () => {
  let w;
  let onDone = jest.fn();
  let onChange = jest.fn();
  const wrapper = extras => {
    const defaults = {
      classes: {},
      value: Value.fromJSON({}),
      plugins: [],
      className: 'className',
      onDone,
      onChange,
      deletable: false,
      showDone: true
    };
    const props = { ...defaults, ...extras };
    return shallow(<DefaultToolbar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      expect(w).toMatchSnapshot();
    });
    it('renders 1 plugins', () => {
      w = wrapper({
        plugins: [{ toolbar: {}, name: 'plugin-one' }]
      });
      expect(w).toMatchSnapshot();
      expect(w.find(ToolbarButton)).toHaveLength(1);
    });
    it('renders 2 plugins', () => {
      w = wrapper({
        plugins: [{ toolbar: {}, name: 'plugin-one' }, { toolbar: {}, name: 'plugin-two' }]
      });
      expect(w).toMatchSnapshot();
      expect(w.find(ToolbarButton)).toHaveLength(2);
    });
    it('renders 1 plugins, 1 is disabled', () => {
      w = wrapper({
        pluginProps: {
          'plugin-one': {
            disabled: true
          }
        },
        plugins: [{ toolbar: {}, name: 'plugin-one' }, { toolbar: {}, name: 'plugin-two' }]
      });
      expect(w).toMatchSnapshot();
      expect(w.find(ToolbarButton)).toHaveLength(1);
    });
    it('renders without done button', () => {
      w = wrapper({
        deletable: false
      });

      expect(w).toMatchSnapshot();
      expect(w.find(DoneButton)).toHaveLength(1);
    });
    it('renders with done button', () => {
      w = wrapper({
        deletable: true
      });

      expect(w).toMatchSnapshot();
      expect(w.find(DoneButton)).toHaveLength(0);
    });
  });
  describe('logic', () => {});
});
