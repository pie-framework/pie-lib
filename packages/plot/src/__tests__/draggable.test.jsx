import React from 'react';
import { shallow } from 'enzyme';
import Draggable from '../draggable';

const wrapper = () => {
  return shallow(
    <Draggable>
      <div>hellow</div>
    </Draggable>,
    { disableLifecycleMethods: true },
  );
};

describe('draggable', () => {
  describe('local', () => {
    it('resets x/y in state', () => {
      const w = wrapper();
      w.setState({ x: 1, y: 1 });
      w.instance().componentWillReceiveProps({});
      expect(w.state()).toMatchObject({ x: 0, y: 0 });
    });
  });
});
