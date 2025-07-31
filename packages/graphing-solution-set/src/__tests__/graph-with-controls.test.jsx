import { shallow } from 'enzyme';
import React from 'react';

import {
  GraphWithControls,
  setToolbarAvailability,
  toolIsAvailable,
  getAvailableTool,
  filterByValidToolTypes,
  filterByVisibleToolTypes,
} from '../graph-with-controls';
import { toolsArr, allTools, line as lineTool } from '../tools';

const line = {
  type: 'line',
  from: { x: 0, y: 0 },
  to: { x: 1, y: 1 },
  label: 'Line',
  building: true,
};

const polygon = {
  type: 'polygon',
  points: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ],
};

const marks = [line, polygon];

describe('setToolbarAvailability', () => {
  it('sets `toolbar: true` if tool should be displayed in toolbar - all tools', () => {
    const result = setToolbarAvailability(allTools);
    const allTrue = new Array(toolsArr.length).fill(true);

    expect(result.map((r) => r.toolbar)).toEqual(allTrue);
  });

  it('sets `toolbar: true` if tool should be displayed in toolbar - few tools', () => {
    const result = setToolbarAvailability(['line', 'polygon']);
    const allOthersFalse = new Array(toolsArr.length - 2).fill(false);

    expect(result.filter((r) => r.type === 'line' || r.type === 'polygon').map((r) => r.toolbar)).toEqual([true, true]);
    expect(result.filter((r) => r.type !== 'line' && r.type !== 'polygon').map((r) => r.toolbar)).toEqual(
      allOthersFalse,
    );
  });
});

describe('toolIsAvailable', () => {
  const tools = setToolbarAvailability(['line', 'polygon']);

  it('returns true if tool is available', () => {
    expect(toolIsAvailable(tools, lineTool())).toEqual(true);
  });
});

describe('getAvailableTool', () => {
  it('returns the first available tool in list if there is any', () => {
    const tools = setToolbarAvailability(['line', 'polygon']);

    expect(getAvailableTool(tools).toolbar).toEqual(true);
  });

  it('returns undefined list if there is no available tool', () => {
    const tools = setToolbarAvailability([]);

    expect(getAvailableTool(tools)).toEqual(undefined);
  });
});

describe('filterByValidToolTypes', () => {
  it('filters marks by valid types', () => {
    const marks = [{ type: 'polygon' }, { type: 'a' }, { type: 'b' }, { type: 'line' }, { type: 'c' }];

    expect(filterByValidToolTypes(marks)).toEqual([{ type: 'polygon' }, { type: 'line' }]);
  });
});

describe('filterByVisibleToolTypes', () => {
  it('filters marks by the types that should be visible', () => {
    expect(
      filterByVisibleToolTypes(['line', 'polygon'], [{ type: 'point' }, { type: 'line' }, { type: 'polygon' }]),
    ).toEqual([{ type: 'line' }, { type: 'polygon' }]);

    expect(filterByVisibleToolTypes(['line'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }])).toEqual([
      { type: 'line' },
    ]);

    expect(filterByVisibleToolTypes(['segment'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }])).toEqual(
      [],
    );
  });
});

describe('GraphWithControls', () => {
  let w;
  let onChangeMarks = jest.fn();

  const defaultProps = () => ({
    axesSettings: { includeArrows: true },
    classes: {},
    className: '',
    coordinatesOnHover: false,
    domain: { min: 0, max: 10, step: 1 },
    labels: { top: 'a', left: 'b', right: 'c', bottom: 'd' },
    labelModeEnabled: true,
    marks,
    onChangeMarks,
    range: { min: 0, max: 10, step: 1 },
    size: { width: 500, height: 500 },
    title: 'Title',
    toolbarTools: allTools,
  });
  const initialProps = defaultProps();

  const wrapper = (extras, opts) => {
    const props = { ...initialProps, ...extras };

    return shallow(<GraphWithControls {...props} />, opts);
  };

  describe('snapshot', () => {
    it('renders', () => {
      w = wrapper();
      expect(w).toMatchSnapshot();
    });
  });
});
