import React from 'react';
import { htmlToValue, valueToHtml } from '../index';
import Editor from '../editor';
import { shallow, configure } from 'enzyme';
import debug from 'debug';

import { mockComponents } from './utils';
import Adapter from 'enzyme-adapter-react-15';

const log = debug('editable-html:test');

const value = htmlToValue('hi');

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

jest.mock('@pie-lib/math-input', () => {
  return {
    EditableMathInput: jest.fn()
  };
});

expect.extend({
  toEqualHtml(value, html) {
    const v = valueToHtml(value);
    const pass = v === html;
    return {
      pass,
      message: () => `expected ${html} to match ${v}`
    };
  }
});

test('onFocus/onBlur resets the value', () => {
  const wrapper = shallow(
    <Editor value={value} classes={{}} onChange={jest.fn()} />
  );

  wrapper.instance().onFocus();

  const v = htmlToValue('hi');
  expect(wrapper.state('stashedValue')).toEqualHtml('<div>hi</div>');
  wrapper.instance().onChange({ value: htmlToValue('new value') });
  expect(wrapper.state('value')).toEqualHtml('<div>new value</div>');
  return wrapper
    .instance()
    .onBlur({})
    .then(() => {
      expect(wrapper.state('value')).toEqualHtml('<div>hi</div>');
    });
});

test('onFocus stashes the value', () => {
  const wrapper = shallow(
    <Editor value={value} classes={{}} onChange={jest.fn()} />
  );

  wrapper.instance().onFocus();

  expect(wrapper.state('stashedValue')).toEqualHtml('<div>hi</div>');
});
