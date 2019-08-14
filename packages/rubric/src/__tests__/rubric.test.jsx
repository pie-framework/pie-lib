import { mount } from 'enzyme';
import React from 'react';
import Rubric from '../authoring';
import { Draggable } from 'react-beautiful-dnd';

describe('Rubric', () => {
  let w;

  const defaultProps = extras => ({
    classes: {},
    className: 'className',
    value: {
      points: ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'],
      maxPoints: 4,
      excludeZero: false,
      ...extras
    }
  });

  const wrapper = (extras, opts) => {
    const props = { ...defaultProps(extras) };

    return mount(<Rubric {...props} />, opts);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    it('renders correctly for excluded zeroes', () => {
      let w = wrapper({ excludeZero: true });
      expect(w.find(Draggable).length).toEqual(3);

      w = wrapper({ excludeZero: false });
      expect(w.find(Draggable).length).toEqual(4);
    });
  });
});
