import React from 'react';
import PlotPoints from '../plot-points';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Domain } from 'domain';

configure({ adapter: new Adapter() });

const domain = {
  min: -10,
  max: 10,
  padding: 0,
  step: 1
};

const range = {
  min: -10,
  max: 10,
  padding: 0,
  step: 1
};

describe('logic', () => {
  let onAddPoint, onSelectionChange, onMovePoint;

  const mkWrapper = (points, selection) => {
    points = points || [];
    selection = selection || [];
    onAddPoint = jest.fn();
    onSelectionChange = jest.fn();
    onMovePoint = jest.fn();
    return shallow(
      <PlotPoints
        domain={domain}
        onAddPoint={onAddPoint}
        onSelectionChange={onSelectionChange}
        onMovePoint={onMovePoint}
        range={range}
        width={500}
        height={500}
        classes={{}}
        points={points}
        selection={selection}
        disabled={false}
      />
    );
  };

  describe('onDomainClick', () => {
    it('calls onAddPoint', () => {
      const w = mkWrapper();
      w.instance().onDomainClick({ x: 0.1, y: 0.1 });
      expect(onAddPoint.mock.calls[0][0]).toEqual({ x: 0, y: 0 });
    });
  });

  describe('toggleSelectPoint', () => {
    it('calls onSelectionChange', () => {
      const w = mkWrapper();
      w.instance().toggleSelectPoint({ x: 0, y: 0 });
      expect(onSelectionChange.mock.calls[0][0]).toEqual([{ x: 0, y: 0 }]);
    });

    it('calls onSelectionChange with point removed', () => {
      const w = mkWrapper([], [{ x: 0, y: 0 }]);
      w.instance().toggleSelectPoint({ x: 0, y: 0 });
      expect(onSelectionChange.mock.calls[0][0]).toEqual([]);
    });
  });

  describe('movePoint', () => {
    it('calls onMovePoint', () => {
      const w = mkWrapper([{ x: 0, y: 0 }]);
      w.instance().movePoint({ x: 0, y: 0 }, { x: 1, y: 1 });
      expect(onMovePoint.mock.calls[0][0]).toEqual(
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      );
    });
  });
});

describe('snapshot', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <PlotPoints
          domain={domain}
          onAddPoint={jest.fn()}
          onSelectionChange={jest.fn()}
          onMovePoint={jest.fn()}
          range={range}
          width={500}
          height={500}
          classes={{}}
          points={[]}
          disabled={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
