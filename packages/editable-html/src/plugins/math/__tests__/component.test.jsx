import React from 'react';
import renderer from 'react-test-renderer';
import { classObject, mockMathInput } from '../../../__tests__/utils';
import debug from 'debug';
const log = debug('editable-html:test:math');

import { mount } from 'enzyme';

mockMathInput();

describe('component', () => {
  let mod, MathComponent, node, editor, classes, mathWrapper;

  mathWrapper = {
    change: jest.fn()
  };

  beforeEach(() => {
    try {
      mod = require('../component.jsx');
    } catch (e) {
      log(e);
    }

    MathComponent = mod.MathComponent;
    classes = classObject('root', 'selected');
    editor = {
      value: {
        isFocused: true
      },
      change: jest.fn()
    };

    node = {
      data: {
        get: jest.fn(() => 'latex')
      }
    };
  });

  test('snapshot', () => {
    const tree = renderer.create(
      <MathComponent classes={classes} editor={editor} node={node} />
    );

    expect(tree).toMatchSnapshot();
  });

  xdescribe('componentDidUpdate', () => {
    //TODO: Testing components w/ refs is a pain in the ....
    //Isolate the use of refs to only the wrapper arount the MathInput
    //So that tests can be written.
  });
});
