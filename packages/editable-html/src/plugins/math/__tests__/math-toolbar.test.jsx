import { configure, shallow } from 'enzyme';

import { Data, Block, Value } from 'slate';
import { MathToolbar } from '../math-toolbar';
import MockChange from '../../image/__tests__/mock-change';
import React from 'react';
import debug from 'debug';

jest.mock('@pie-lib/math-input', () => {
  return {
    HorizontalKeypad: () => <div>HorizontalKeypad</div>
  };
});

jest.mock('../editor-and-pad', () => () => <div>EditorAndPad</div>);

const log = debug('editable-html:test:editor-and-toolbar');

describe('math-toolbar', () => {
  let onDone;

  beforeEach(() => {
    onDone = jest.fn();
  });

  const mkWrapper = extras => {
    const props = {
      latex: 'foo',
      onDone,
      ...extras
    };

    return shallow(<MathToolbar {...props} />);
  };

  describe('snapshot', () => {
    it('renders', () => {
      const w = mkWrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('done', () => {
      it('calls onDone', () => {
        const w = mkWrapper();
        w.instance().done();
        expect(onDone).toHaveBeenCalled();
      });
    });
  });
});
