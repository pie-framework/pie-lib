import React from 'react';
import { htmlToValue, valueToHtml } from '../index';
import { Editor } from '../editor';
import { shallow, configure } from 'enzyme';
import debug from 'debug';

import { mockComponents } from './utils';

const log = debug('@pie-lib:editable-html:test');

const value = htmlToValue('hi');

jest.mock('@pie-lib/math-input', () => {
  HorizontalKeypad: () => <div>HorizontalKeypad</div>;
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

describe('buildSizeStyle', () => {
  const wrapper = extras => {
    const props = Object.assign({}, extras);
    return shallow(
      <Editor value={value} classes={{}} onChange={jest.fn()} {...props} />
    );
  };

  it('builds width', () => {
    const w = wrapper({ width: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: '100px',
      height: undefined
    });
  });

  it('returns undefined for % ', () => {
    const w = wrapper({ height: '100%', width: '100%' });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined
    });
  });

  it('builds height', () => {
    const w = wrapper({ height: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: '100px'
    });
  });

  it('builds', () => {
    const w = wrapper({});
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined
    });
  });
});
