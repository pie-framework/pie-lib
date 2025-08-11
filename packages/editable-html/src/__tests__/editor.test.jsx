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
      message: () => `expected ${html} to match ${v}`,
    };
  },
});

describe('logic', () => {
  test('onFocus/onBlur saves the value', async () => {
    const wrapper = shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
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

test('onFocus does not change focus if related target is a button from language keypad', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  const event = {
    relatedTarget: {
      tagName: 'button',
    },
  };

  const change = {
    focus: jest.fn(),
  };

  wrapper.instance().keypadInteractionDetected = true;

  await wrapper.instance().onFocus(event, change);

  expect(change.focus).not.toHaveBeenCalled();
});

test('onFocus changes focus if related target is not a button from language keypad', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  const event = {
    relatedTarget: {
      tagName: 'div',
    },
  };

  const change = {
    focus: jest.fn(),
  };

  await wrapper.instance().onFocus(event, change);

  expect(change.focus).toHaveBeenCalled();
});

test('onFocus stashes the value', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  await wrapper.instance().onFocus();

  expect(wrapper.state('stashedValue')).toEqualHtml('<div>hi</div>');
});

test('onBlur does not set focusToolbar if related target is RawDoneButton', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  const toolbarElement = document.createElement('div');
  const relatedTarget = document.createElement('button');
  relatedTarget.className = 'RawDoneButton';
  toolbarElement.className = 'toolbar';
  toolbarElement.appendChild(relatedTarget);

  wrapper.instance().toolbarRef = toolbarElement;
  wrapper.instance().doneButtonRef.current = relatedTarget;

  const event = { relatedTarget };

  await wrapper.instance().onBlur(event);

  expect(wrapper.state('focusToolbar')).toBe(false);
});

test('handleToolbarFocus sets focusToolbar to true', () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  wrapper.instance().handleToolbarFocus();
  expect(wrapper.state('focusToolbar')).toBe(true);
});

test('handleToolbarBlur sets focusToolbar to false if toolbar does not contain focus', (done) => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  wrapper.instance().toolbarContainsFocus = jest.fn().mockReturnValue(false);

  wrapper.instance().handleToolbarBlur();

  setTimeout(() => {
    expect(wrapper.state('focusToolbar')).toBe(false);
    done();
  }, 20);
});

test('handleToolbarBlur does not set focusToolbar to false if toolbar contains focus', (done) => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  wrapper.instance().toolbarContainsFocus = jest.fn().mockReturnValue(true);

  wrapper.setState({ focusToolbar: true });

  wrapper.instance().handleToolbarBlur();

  setTimeout(() => {
    expect(wrapper.state('focusToolbar')).toBe(true);
    done();
  }, 20);
});

test('toolbarContainsFocus correctly detects focus within toolbar', () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  const toolbarElement = document.createElement('div');
  const activeElement = document.createElement('button');
  toolbarElement.appendChild(activeElement);

  Object.defineProperty(document, 'activeElement', {
    value: activeElement,
    configurable: true,
  });

  wrapper.instance().toolbarRef = toolbarElement;

  expect(wrapper.instance().toolbarContainsFocus()).toBe(true);

  Object.defineProperty(document, 'activeElement', {
    value: document.createElement('div'),
    configurable: true,
  });

  expect(wrapper.instance().toolbarContainsFocus()).toBe(false);
});

test('onBlur sets focusToolbar to true if related target is within toolbar', async () => {
  const wrapper = shallow(
    <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
  );

  const toolbarElement = document.createElement('div');
  const relatedTarget = document.createElement('button');
  toolbarElement.className = 'toolbar';
  toolbarElement.appendChild(relatedTarget);

  wrapper.instance().toolbarRef = toolbarElement;

  const event = { relatedTarget };

  await wrapper.instance().onBlur(event);

  expect(wrapper.state('focusToolbar')).toBe(true);
});

describe('buildSizeStyle', () => {
  const wrapper = (extras) => {
    const props = Object.assign({}, extras);
    return shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} {...props} />,
    );
  };

  it('builds width with px', () => {
    const w = wrapper({ width: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: '100px',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });

  it('returns undefined for % ', () => {
    const w = wrapper({ height: '100%', width: '100%' });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });

  it('builds height', () => {
    const w = wrapper({ height: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: '100px',
      minHeight: undefined,
      maxHeight: undefined,
    });
  });

  it('builds minHeight', () => {
    const w = wrapper({ minHeight: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: '100px',
      maxHeight: undefined,
    });
  });

  it('builds maxHeight', () => {
    const w = wrapper({ maxHeight: 100 });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: '100px',
    });
  });

  it('builds width with calc()', () => {
    const w = wrapper({ width: 'calc(10em + 42px)' });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: 'calc(10em + 42px)',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });

  it('builds width with ch', () => {
    const w = wrapper({ width: '9ch' });
    expect(w.instance().buildSizeStyle()).toEqual({
      width: '9ch',
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });

  it('builds', () => {
    const w = wrapper({});
    expect(w.instance().buildSizeStyle()).toEqual({
      width: undefined,
      height: undefined,
      minHeight: undefined,
      maxHeight: undefined,
    });
  });
});

describe('onResize', () => {
  it('should display html of current state on Resize', () => {
    const wrapper = shallow(
      <Editor editorRef={jest.fn()} value={value} classes={{}} onChange={jest.fn()} onRef={jest.fn()} />,
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

describe('MathMl', () => {
  beforeEach(() => {});

  it('should not call runSerializationOnMarkup if mathMl props are not there', () => {
    const runSerializationOnMarkup = jest.fn();

    const wrapper = shallow(
      <Editor
        editorRef={jest.fn()}
        value={value}
        classes={{}}
        onChange={jest.fn()}
        onRef={jest.fn()}
        runSerializationOnMarkup={runSerializationOnMarkup}
      />,
    );

    expect(runSerializationOnMarkup).not.toHaveBeenCalled();
  });

  it('should call runSerializationOnMarkup if mmlEditing or mmlOutput are true', () => {
    const runSerializationOnMarkup = jest.fn();

    const wrapper = shallow(
      <Editor
        editorRef={jest.fn()}
        value={value}
        classes={{}}
        onChange={jest.fn()}
        onRef={jest.fn()}
        runSerializationOnMarkup={runSerializationOnMarkup}
        mathMlOptions={{ mmlOutput: true }}
      />,
    );

    expect(runSerializationOnMarkup).toHaveBeenCalled();
  });
});
