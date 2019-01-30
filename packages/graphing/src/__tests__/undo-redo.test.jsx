import { shallow } from 'enzyme';
import React from 'react';
import UndoRedo from '../undo-redo';

describe('UndoRedo', () => {
  let w;
  let onUndo = jest.fn();
  let onRedo = jest.fn();
  let onReset = jest.fn();
  const wrapper = extras => {
    const defaults = {
      onUndo,
      onRedo,
      onReset
    };
    const props = { ...defaults, ...extras };
    return shallow(<UndoRedo {...props} />);
  };
  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
