import React from 'react';
import renderer from 'react-test-renderer';
import { classObject } from '../../../__tests__/utils';
import debug from 'debug';
const log = debug('editable-html:test:math');
import MathPreview from '../math-preview';
import { mount } from 'enzyme';
import { Data, Block, Value } from 'slate';

jest.mock('../mathquill/static', () => () => <div>Static</div>);

describe('MathPreview', () => {
  let value, classes, node;
  beforeEach(() => {
    value = Value.fromJSON({});
    classes = classObject('root', 'selected');

    node = Block.fromJSON({
      type: 'math',
      data: { latex: 'latex' }
    });
  });

  test('snapshot', () => {
    const tree = renderer.create(
      <MathPreview
        classes={classes}
        node={node}
        value={value}
        onClick={jest.fn()}
      />
    );

    expect(tree).toMatchSnapshot();
  });

  xdescribe('componentDidUpdate', () => {
    //TODO: Testing components w/ refs is a pain in the ....
    //Isolate the use of refs to only the wrapper arount the MathInput
    //So that tests can be written.
  });
});
