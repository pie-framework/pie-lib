import { shallow } from 'enzyme';
import React from 'react';

import { xy } from '../__tests__/utils';

import Graph, { removeBuildingToolIfCurrentToolDiffers } from '../graph';
import { toolsArr } from '../tools';

describe('removeBuildingToolIfCurrentToolDiffers', () => {
  let marks = [
    {
      type: 'point',
      x: 2,
      y: 2,
      label: 'Point',
      showLabel: true,
    },
    {
      type: 'line',
      from: { x: 0, y: 0 },
      label: 'Line',
      building: true,
    },
  ];

  it('keeps all marks if currentTool is the same', () => {
    expect(removeBuildingToolIfCurrentToolDiffers({ marks, currentTool: { type: 'line' } })).toEqual(marks);
  });

  it('removes building marks if currentTool is different', () => {
    expect(removeBuildingToolIfCurrentToolDiffers({ marks, currentTool: { type: 'different' } })).toEqual([marks[0]]);
  });
});

describe('Graph', () => {
  let onChangeMarks = jest.fn();
  let wrapper;

  const complete = jest.fn();
  const addPoint = jest.fn();
  const currentTool = toolsArr[0];
  currentTool.complete = complete;
  currentTool.addPoint = addPoint;

  const props = {
    classes: {},
    className: 'className',
    onChangeMarks,
    tools: toolsArr,
    domain: { min: 0, max: 1, step: 1 },
    range: { min: 0, max: 1, step: 1 },
    size: { width: 400, height: 400 },
    currentTool,
  };

  beforeEach(() => {
    wrapper = (extras, opts) => {
      const properties = {
        ...props,
        marks: [
          {
            type: 'point',
            x: 2,
            y: 2,
            label: 'Point',
            showLabel: true,
          },
          {
            type: 'line',
            from: { x: 0, y: 0 },
            label: 'Line',
            building: true,
          },
        ],
        ...extras,
      };
      console.log('props', props.marks);
      return shallow(<Graph {...properties} />, opts);
    };
  });

  describe('snapshot', () => {
    it('renders', () => {
      jest.spyOn(Graph.prototype, 'generateMaskId').mockReturnValue('graph-1618');
      let w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('componentDidMount', () => {
      it('sets the labelNode to state', () => {
        let w = shallow(<Graph {...props} />, { disableLifecycleMethods: true });

        w.instance().labelNode = {};
        w.instance().componentDidMount();
        expect(w.state('labelNode')).toEqual(w.instance().labelNode);
      });
    });

    describe('changeMark', () => {
      it('does not call onChangeMarks', () => {
        const newMark = { type: 'mark', x: 2, y: 2 };

        let w = wrapper();
        w.instance().changeMark(newMark, newMark);
        expect(onChangeMarks).not.toBeCalled();
      });

      it('calls onChangeMarks', () => {
        const newMark = { type: 'mark', x: 2, y: 2 };

        let w = wrapper();
        let marks = w.instance().props.marks;

        console.log('w model', w.instance().props.marks);
        w.instance().changeMark(marks[0], newMark);
        expect(onChangeMarks).toHaveBeenCalledWith([newMark, marks[1]]);
      });
    });

    describe('completeMark', () => {
      it('does not call updateMarks if no building mark', () => {
        const updateMarks = jest.fn();
        let w = wrapper({ marks: [{ type: 'point', x: 1, y: 1 }] });

        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).not.toBeCalled();
        expect(updateMarks).not.toBeCalled();
      });

      it('does not call updateMarks if no current tool', () => {
        const updateMarks = jest.fn();
        let w = wrapper({ currentTool: null });

        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).not.toBeCalled();
        expect(updateMarks).not.toBeCalled();
      });

      it('calls updateMarks', () => {
        const updateMarks = jest.fn();
        let w = wrapper();

        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).toHaveBeenCalled();
        expect(updateMarks).toHaveBeenCalled();
      });
    });

    describe('updateMarks', () => {
      it('calls onChangeMarks', () => {
        const marks = [{ type: 'mark', ...xy(2, 2) }];
        const update = { type: 'mark', ...xy(4, 4) };

        wrapper({ marks })
          .instance()
          .updateMarks(marks[0], update, false);
      });

      it('calls onChangeMarks with added mark', () => {
        const marks = [];
        const update = { type: 'mark', ...xy(4, 4) };

        wrapper({ marks })
          .instance()
          .updateMarks(marks[0], [update], true);
      });
    });

    describe('getComponent', () => {
      let compMock = jest.fn();

      it('returns null if no mark', () => {
        let w = wrapper();

        expect(w.instance().getComponent()).toEqual(null);
        expect(w.instance().getComponent(undefined)).toEqual(null);
        expect(w.instance().getComponent(null)).toEqual(null);
      });

      it('returns the component', () => {
        let w = wrapper();
        w.instance().props.tools[0].Component = compMock;

        const Comp = w.instance().getComponent({ type: toolsArr[0].type });
        expect(Comp).toEqual(compMock);
      });

      it('returns null if there is no tool', () => {
        let w = wrapper();
        expect(w.instance().getComponent({ type: 'mark' })).toEqual(null);
      });

      it('returns null if there is no tool.Component', () => {
        let w = wrapper();
        w.instance().props.tools[0].Component = undefined;

        expect(w.instance().getComponent({ type: toolsArr[0].type })).toEqual(null);
      });
    });

    describe('onBgClick', () => {
      it('calls updateMarks', () => {
        const buildingMark = { type: 'mark', building: true, x: 1, y: 1 };
        const marks = [{ type: 'mark' }, buildingMark];

        const updateMarks = jest.fn();

        let w = wrapper({ marks });
        w.instance().updateMarks = updateMarks;
        w.instance().onBgClick({ x: 3, y: 3 });
        expect(w.instance().updateMarks).toHaveBeenCalled();
      });

      it('returns early of labelModeEnabled', () => {
        let w = wrapper({ labelModeEnabled: true });
        w.instance().updateMarks = jest.fn();
        w.instance().onBgClick({ x: 3, y: 3 });
        expect(w.instance().updateMarks).not.toHaveBeenCalled();
      });
    });
  });
});
