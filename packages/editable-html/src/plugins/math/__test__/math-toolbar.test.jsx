import { assert, match, stub } from 'sinon';
import { configure, shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-15';
import { Data } from 'slate';
import MathToolbar from '../math-toolbar';
import MockChange from '../../image/__test__/mock-change';
import React from 'react';
import debug from 'debug';

jest.mock('@pie-lib/math-input', () => {
  return {
    HorizontalKeypad: () => <div>HorizontalKeypad</div>,
    MathQuillInput: () => <div>MathQuillInput</div>
  }
});


beforeAll(() => {
  configure({ adapter: new Adapter() });
});

const log = debug('editable-html:test:editor-and-toolbar');

describe('math-toolbar', () => {

  describe('click', () => {

    let node, change, value, onChange, toolbar;
    beforeEach(() => {

      node = {
        key: '1',
        data: Data.create({})
      }

      change = new MockChange();

      value = {
        change: stub().returns(change)
      }

      onChange = stub();
      toolbar = shallow(<MathToolbar
        node={node}
        onChange={onChange}
        value={value}
      />);
    });

    const assertTypeValue = (type, value, expected) => {

      expected = expected || { type, value };
      test(`${type} -> ${value}`, () => {
        toolbar.simulate('click', { type, value });
        const changeData = { type }
        assert.calledWith(change.setNodeByKey, '1', {
          data: {
            change: expected
          }
        });
      });
    }

    assertTypeValue('write', '1');
    assertTypeValue('write', '2');
    assertTypeValue('command', 'C');
    assertTypeValue(undefined, 'clear', { type: 'clear' });
    assertTypeValue('cursor', 'up');

  });
});