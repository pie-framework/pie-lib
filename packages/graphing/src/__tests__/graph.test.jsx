import { shallow } from 'enzyme';
import React from 'react';

import { xy } from '../__tests__/utils';

import Graph, { removeBuildingToolIfCurrentToolDiffers } from '../graph';
import { toolsArr } from '../tools';

const marks = [
  {
    type: 'point',
    x: 2,
    y: 2,
    label: 'Point',
    showLabel: true
  },
  {
    type: 'line',
    from: { x: 0, y: 0 },
    label: 'Line',
    building: true
  },
];

describe('removeBuildingToolIfCurrentToolDiffers', () => {
  it('keeps all marks if currentTool is the same', () => {
    const currentTool = toolsArr[0];

    expect(removeBuildingToolIfCurrentToolDiffers({ marks, currentTool, state: { currentTool } })).toEqual(marks)
  });

  it('removes building marks if currentTool is different', () => {
    const currentTool = toolsArr[0];
    const stateCurrentTool = toolsArr[1];

    expect(removeBuildingToolIfCurrentToolDiffers({
      marks: [...marks],
      currentTool,
      state: { currentTool: stateCurrentTool }
    })).toEqual([marks[0]]);
  });
});

describe('Graph', () => {
  let w;
  let onChangeMarks = jest.fn();
  const defaultProps = () => ({
    classes: {},
    className: 'className',
    onChangeMarks,
    tools: toolsArr,
    domain: { min: 0, max: 1, step: 1 },
    range: { min: 0, max: 1, step: 1 },
    size: { width: 400, height: 400 },
    marks,
    currentTool: toolsArr[0]
  });
  const initialProps = defaultProps();

  const wrapper = (extras, opts) => {
    const props = { ...initialProps, ...extras };

    return shallow(<Graph {...props} />, opts);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    describe('getDerivedStateFromProps', () => {
      it('removes the building mark if currentTool is different', () => {
        const result = Graph.getDerivedStateFromProps(initialProps);

        expect(result.marks).toEqual([marks[0]]);
      });

      it('keeps all marks if currentTool is the same', () => {
        const result = Graph.getDerivedStateFromProps(initialProps, { currentTool: initialProps.currentTool });

        expect(result.marks).toEqual(marks);
      });
    });

    describe('componentDidMount', () => {
      it('sets the labelNode to state', () => {
        w = shallow(<Graph {...defaultProps()} />, { disableLifecycleMethods: true });
        w.instance().labelNode = {};
        w.instance().componentDidMount();
        expect(w.state('labelNode')).toEqual(w.instance().labelNode);
      });
    });

    describe('changeMark', () => {
      const newMark = { type: 'mark', x: 2, y: 2 };

      it('does not call onChangeMarks', () => {
        w = wrapper();
        w.instance().changeMark(newMark, newMark);
        expect(onChangeMarks).not.toBeCalled();
      });

      it('calls onChangeMarks', () => {
        w = wrapper();
        w.instance().changeMark(marks[0], newMark);
        expect(onChangeMarks).toHaveBeenCalledWith([newMark, marks[1]]);
      });
    });

    describe('completeMark', () => {
      it('calls updateMarks', () => {
        const completedMark = { ...marks[1], completed: true };

        const complete = jest.fn().mockReturnValue(completedMark);
        const updateMarks = jest.fn();

        w.instance().state.marks = [...marks];
        w.instance().state.currentTool.complete = complete;
        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).toHaveBeenCalledWith(marks[1], xy(3, 3));
        expect(updateMarks).toHaveBeenCalledWith(marks[1], completedMark);
      });

      it('does not call updateMarks if no building mark', () => {
        const completedMark = { type: 'mark', completed: true };

        const complete = jest.fn().mockReturnValue(completedMark);
        const updateMarks = jest.fn();

        w.instance().state.marks = [marks[0]];
        w.instance().state.currentTool.complete = complete;
        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).not.toBeCalled();
        expect(updateMarks).not.toBeCalled();
      });

      it('does not call updateMarks if no current tool', () => {
        const completedMark = { type: 'mark', completed: true };

        const complete = jest.fn().mockReturnValue(completedMark);
        const updateMarks = jest.fn();

        w.instance().state.currentTool = null;
        w.instance().state.marks = [...marks];
        w.instance().updateMarks = updateMarks;
        w.instance().completeMark({ x: 3, y: 3 });

        expect(complete).not.toBeCalled();
        expect(updateMarks).not.toBeCalled();
      });
    });

    describe('updateMarks', () => {
      it('calls onChangeMarks', () => {
        const marks = [{ type: 'mark', ...xy(2, 2) }];
        const update = { type: 'mark', ...xy(4, 4) };
        w = wrapper({ marks });
        w.instance().updateMarks(marks[0], update, false);
      });

      it('calls onChangeMarks with added mark', () => {
        const marks = [];
        const update = { type: 'mark', ...xy(4, 4) };
        w = wrapper({ marks });
        w.instance().updateMarks(marks[0], [update], true);
      });
    });

    describe('getComponent', () => {
      let compMock = jest.fn();

      it('returns null if no mark', () => {
        expect(w.instance().getComponent()).toEqual(null);
        expect(w.instance().getComponent(undefined)).toEqual(null);
        expect(w.instance().getComponent(null)).toEqual(null);
      });

      it('returns the component', () => {
        w.instance().props.tools[0].Component = compMock;

        const Comp = w.instance().getComponent({ type: toolsArr[0].type });
        expect(Comp).toEqual(compMock);
      });

      it('returns null if there is no tool', () => {
        expect(w.instance().getComponent({ type: 'mark' })).toEqual(null);
      });

      it('returns null if there is no tool.Component', () => {
        w.instance().props.tools[0].Component = undefined;

        expect(w.instance().getComponent({ type: toolsArr[0].type })).toEqual(null);
      });
    });

    describe('mouseMove', () => {
      it('updates state if there is a buildingMark and !dragging', () => {
        const marks = [{ type: 'mark' }];
        w = wrapper({ marks });
        w.setState({ buildingMark: { type: 'mark' } });
        w.instance().mouseMove(xy(3, 3));
        expect(w.state().hoverPoint).toEqual(xy(3, 3));
      });

      it('does not update state if there is no buildingMark', () => {
        const marks = [{ type: 'mark' }];
        w = wrapper({ marks });
        w.instance().mouseMove(xy(3, 3));
        expect(w.state().hoverPoint).toBeUndefined();
      });

      it('does not update state if dragging', () => {
        const marks = [{ type: 'mark' }];
        w = wrapper({ marks });
        w.setState({ dragging: true });
        w.instance().mouseMove(xy(3, 3));
        expect(w.state().hoverPoint).toBeUndefined();
      });
    });

    describe('onBgClick', () => {
      it('calls updateMarks', () => {
        const buildingMark = { type: 'mark', building: true, x: 1, y: 1 };

        const updatedMark = { type: 'mark', msg: 'updated' };
        const marks = [{ type: 'mark' }, buildingMark];

        const addPoint = jest.fn().mockReturnValue(updatedMark);
        const updateMarks = jest.fn();

        w = wrapper({ marks });
        w.instance().state.currentTool.addPoint = addPoint;
        w.instance().updateMarks = updateMarks;
        w.instance().onBgClick({ x: 3, y: 3 });
        expect(w.instance().updateMarks).toHaveBeenCalledWith(buildingMark, updatedMark, true);
      });

      it('returns early of labelModeEnabled', () => {
        w = wrapper({ labelModeEnabled: true });
        w.instance().updateMarks = jest.fn();
        w.instance().onBgClick({ x: 3, y: 3 });
        expect(w.instance().updateMarks).not.toHaveBeenCalled();
      });
    });
  });
});
