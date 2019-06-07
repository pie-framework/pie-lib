import { shallow } from 'enzyme';
import React from 'react';
import Graph from '../graph';
import { xy } from '../__tests__/utils';

describe('Graph', () => {
  let w;
  let onChangeMarks = jest.fn();
  const wrapper = (extras, opts) => {
    const defaults = {
      classes: {},
      className: 'className',
      onChangeMarks,
      tools: [
        {
          type: 'mark',
          Component: () => <div />,
          addPoint: jest.fn((pnt, m) => ({ ...m, pnt })),
          complete: jest.fn((m, d) => ({ ...m, ...d }))
        }
      ],
      domain: { min: 0, max: 1, step: 1 },
      range: { min: 0, max: 1, step: 1 },
      size: { width: 400, height: 400 },
      marks: []
    };
    const props = { ...defaults, ...extras };

    return shallow(<Graph {...props} />, opts);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
  describe('logic', () => {
    describe('componentDidMount', () => {
      it.todo('sets the labelNode to state');
    });

    describe('getDefaultTool', () => {
      it('returns the default specified in the props', () => {
        const defaultTool = { type: 'default' };
        w = wrapper({
          tools: [{ type: 'one' }, defaultTool],
          defaultTool: defaultTool.type
        });

        const t = w.instance().getDefaultTool();

        expect(t).toEqual(defaultTool);
      });
      it('returns the first tool if not specified', () => {
        const tools = [{ type: 'one' }, { type: 'other' }],
          w = wrapper({
            tools
          });

        const t = w.instance().getDefaultTool();
        expect(t).toEqual(tools[0]);
      });
    });

    describe('changeMark', () => {
      it('calls onChangeMarks', () => {
        const marks = [{ type: 'mark', x: 1, y: 1 }];
        const newMark = { type: 'mark', x: 2, y: 2 };
        w = wrapper({
          marks
        });
        w.instance().changeMark(marks[0], newMark);
        expect(onChangeMarks).toHaveBeenCalledWith([newMark]);
      });
    });

    describe('getBuildingMark', () => {
      it('returns mark that is building', () => {
        const marks = [{ type: 'mark' }, { type: 'mark', building: true, x: 1, y: 1 }];
        w = wrapper({ marks });
        const result = w.instance().getBuildingMark();
        expect(result).toEqual(marks[1]);
      });
    });

    describe('onBgClick', () => {
      it('calls updateMarks', () => {
        const buildingMark = { type: 'mark', building: true, x: 1, y: 1 };

        const updatedMark = { type: 'mark', msg: 'updated' };
        const marks = [{ type: 'mark' }, buildingMark];

        w = wrapper({ marks });
        w.instance().props.tools[0].addPoint.mockReturnValue(updatedMark);
        w.instance().updateMarks = jest.fn();
        w.instance().onBgClick({ x: 3, y: 3 });
        expect(w.instance().updateMarks).toHaveBeenCalledWith(buildingMark, updatedMark, true);
      });

      it.todo('returns early of labelModeEnabled');
    });

    describe('completeMark', () => {
      it('calls updateMarks', () => {
        const buildingMark = { type: 'mark', building: true, x: 1, y: 1 };

        const completedMark = { type: 'mark', completed: true };
        const marks = [{ type: 'mark' }, buildingMark];

        w = wrapper({ marks });
        w.instance().props.tools[0].complete.mockReturnValue(completedMark);
        w.instance().updateMarks = jest.fn();
        w.instance().completeMark({ x: 3, y: 3 });

        expect(w.instance().props.tools[0].complete).toHaveBeenCalledWith(buildingMark, xy(3, 3));
        expect(w.instance().updateMarks).toHaveBeenCalledWith(buildingMark, completedMark);
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
      let marks, compMock;

      beforeEach(() => {
        marks = [{ type: 'mark', ...xy(1, 1) }, { type: 'mark', ...xy(3, 3) }];
        w = wrapper();
        compMock = jest.fn();
      });

      it('returns the component', () => {
        w.instance().props.tools[0].Component = compMock;
        const Comp = w.instance().getComponent(marks[1]);
        expect(Comp).toEqual(compMock);
      });

      it('throws an error if there is no tool', () => {
        w.instance().props.tools.pop();
        expect(() => w.instance().getComponent({ type: 'mark' })).toThrow(/No tool supports.*/);
      });
      it('throws an error if there is no tool.Component', () => {
        w.instance().props.tools[0].Component = undefined;
        expect(() => w.instance().getComponent({ type: 'mark' })).toThrow(/No tool supports.*/);
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

    describe('removeMark', () => {
      it('removes the mark', () => {
        const mark = { type: 'mark', ...xy(1, 1) };
        w = wrapper({ marks: [mark, { type: 'mark', ...xy(3, 3) }] });
        const result = w.instance().removeMark(mark);
        expect(result).toEqual([{ type: 'mark', ...xy(3, 3) }]);
      });
    });

    describe('componentDidUpdate', () => {
      it('removes the building mark if the tool changes', () => {
        const oldTool = { type: 'oldTool', Component: jest.fn() };
        const currentTool = { type: 'current' };
        const tools = [oldTool, currentTool];
        w = wrapper(
          {
            currentTool,
            tools,
            marks: [
              {
                type: 'oldTool',
                building: true
              }
            ]
          },
          { disableLifecycleMethods: true }
        );

        w.instance().componentDidUpdate({ currentTool: oldTool });

        expect(onChangeMarks).toHaveBeenCalledWith([]);
      });
    });
  });
});
