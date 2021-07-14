import React from 'react';
import { htmlToValue, valueToHtml } from '../index';
import { Editor } from '../editor';
import { shallow, configure } from 'enzyme';
import debug from 'debug';

import { mockComponents } from './utils';

const log = debug('@pie-lib:editable-html:test');

const value = htmlToValue('hi');

const resizeWindow = (width, height) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};

jest.mock('@pie-lib/math-toolbar', () => ({}));
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

describe('logic', () => {
  test('onFocus/onBlur saves the value', async () => {
    const wrapper = shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()}/>
    );

    await wrapper.instance().onFocus();

    const v = htmlToValue('hi');

    expect(wrapper.state('stashedValue')).toEqualHtml('<div>hi</div>');

    wrapper.instance().onChange({ value: htmlToValue('new value') });

    expect(wrapper.state('value')).toEqualHtml('<div>new value</div>');

    return wrapper
      .instance()
      .onBlur({})
      .then(() => {
        expect(wrapper.state('value')).toEqualHtml('<div>new value</div>');
      });
  });
});

test('onFocus stashes the value', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />
  );

  await wrapper.instance().onFocus();

  expect(wrapper.state('stashedValue')).toEqualHtml('<div>hi</div>');
});

describe('buildSizeStyle', () => {
  const wrapper = extras => {
    const props = Object.assign({}, extras);
    return shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} {...props} />
    );
  };

  it('builds width', () => {
    const w = wrapper({ width: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: '100px',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined
    });
  });

  it('returns undefined for % ', () => {
    const w = wrapper({ height: '100%', width: '100%' });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined
    });
  });

  it('builds height', () => {
    const w = wrapper({ height: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: '100px',
      minHeight: undefined,
      maxHeight: undefined
    });
  });

  it('builds minHeight', () => {
    const w = wrapper({ minHeight: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: '100px',
      maxHeight: undefined
    });
  });

  it('builds maxHeight', () => {
    const w = wrapper({ maxHeight: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: '100px'
    });
  });

  it('builds width', () => {
    const w = wrapper({ width: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: '100px',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined
    });
  });

  it('builds', () => {
    const w = wrapper({});
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined
    });
  });
});

describe('onResize ', () => {
  it('should display html of current state on Resize', () => {
    const wrapper = shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />
    );

    resizeWindow(500, 300);
    expect(wrapper.state('value')).toEqualHtml('<div>hi</div>');

    wrapper.instance().onChange({ value: htmlToValue('new value') });
    resizeWindow(1024, 768);
    expect(wrapper.state('value')).toEqualHtml('<div>new value</div>');

    resizeWindow(500, 300);
    expect(wrapper.state('value')).toEqualHtml('<div>new value</div>');
  });
});
