import { shallow, mount } from 'enzyme';
import React from 'react';
import { RawAuthoring } from '../authoring';
import { Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';

describe('Rubric', () => {
  let w;

  const points = ['nothing right', 'a teeny bit right', 'mostly right', 'bingo'];
  const sampleAnswers = [undefined, 'just right', 'not left', undefined];
  const wrapper = (value, opts) => {
    const props = {
      classes: {},
      onChange: jest.fn(),
      className: 'className',
      value: {
        excludeZero: false,
        points,
        sampleAnswers,
        ...value
      }
    };
    const fn = opts && opts.mount ? mount : shallow;
    return fn(<RawAuthoring {...props} />, opts);
  };

  describe('render', () => {
    it('snapshot', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });

    describe('draggable', () => {
      it('renders correctly for excluded zeroes', () => {
        let w = wrapper({ excludeZero: true }, { mount: true });
        expect(w.find(Draggable).length).toEqual(3);
      });
      it('renders correctly for excluded zeroes', () => {
        let w = wrapper({ excludeZero: false }, { mount: true });
        expect(w.find(Draggable).length).toEqual(4);
      });
    });
  });

  describe('logic', () => {
    describe('rendering', () => {});

    describe('changeMaxPoints', () => {
      const assertChangeMax = (points, excludeZero, expectedPoints, expectedSampleAnswers) => {
        it(`${points} calls onChange with: ${expectedPoints} and ${expectedSampleAnswers}`, () => {
          let w = wrapper({ excludeZero });
          w.instance().changeMaxPoints(points);
          expect(w.instance().props.onChange).toHaveBeenCalledWith({
            excludeZero,
            points: expectedPoints,
            sampleAnswers: expectedSampleAnswers
          });
        });
      };

      assertChangeMax(1, false, _.takeRight(points, 2), _.takeRight(sampleAnswers, 2));
      assertChangeMax(1, true, _.takeRight(points, 2), _.takeRight(sampleAnswers, 2));
      assertChangeMax(2, true, _.takeRight(points, 3), _.takeRight(sampleAnswers, 3));
      assertChangeMax(2, false, _.takeRight(points, 3), _.takeRight(sampleAnswers, 3));
      assertChangeMax(
        5,
        false,
        ['', ''].concat(points),
        [undefined, undefined].concat(sampleAnswers)
      );
    });

    describe('changeSampleResponse', () => {
      const assertChangeSample = (
        index,
        clickedItem,
        excludeZero,
        expectedPoints,
        expectedSampleAnswers
      ) => {
        it(`Point ${index} calls onChange with: ${expectedPoints} and ${expectedSampleAnswers}`, () => {
          let w = wrapper({ excludeZero });
          w.instance().onPointMenuChange(index, clickedItem);
          expect(w.instance().props.onChange).toHaveBeenCalledWith({
            excludeZero,
            points: expectedPoints,
            sampleAnswers: expectedSampleAnswers
          });
        });
      };

      assertChangeSample(0, 'sample', false, points, ['', 'just right', 'not left', undefined]);
      assertChangeSample(3, 'sample', false, points, [undefined, 'just right', 'not left', '']);
      assertChangeSample(1, 'sample', true, points, [undefined, undefined, 'not left', undefined]);
      assertChangeSample(3, 'sample', true, points, [undefined, 'just right', 'not left', '']);
    });

    describe('useDefaultText', () => {
      const assertUseDefaultText = (
        index,
        clickedItem,
        excludeZero,
        expectedPoints,
        expectedSampleAnswers
      ) => {
        it(`Point ${index} calls onChange with: ${expectedPoints} and ${expectedSampleAnswers}`, () => {
          let w = wrapper({ excludeZero });
          w.instance().onPointMenuChange(index, clickedItem);
          expect(w.instance().props.onChange).toHaveBeenCalledWith({
            excludeZero,
            points: expectedPoints,
            sampleAnswers: expectedSampleAnswers
          });
        });
      };

      assertUseDefaultText(
        0,
        'text',
        false,
        ['', 'a teeny bit right', 'mostly right', 'bingo'],
        sampleAnswers
      );
      assertUseDefaultText(
        1,
        'text',
        true,
        ['nothing right', '', 'mostly right', 'bingo'],
        sampleAnswers
      );
    });
  });
});
