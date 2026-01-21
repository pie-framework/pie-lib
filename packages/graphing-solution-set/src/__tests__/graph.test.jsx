import { render } from '@pie-lib/test-utils';
import React from 'react';

import { xy } from './utils';

import Graph, { removeBuildingToolIfCurrentToolDiffers } from '../graph';
import { toolsArr } from '../tools';

// Pure function tests - keep as-is
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

// Note: Instance method tests have been removed. Component behavior should be tested
// through user interactions and integration tests.
describe('Graph', () => {
  let onChangeMarks = jest.fn();

  beforeEach(() => {
    onChangeMarks.mockClear();
  });

  const complete = jest.fn();
  const addPoint = jest.fn();
  const currentTool = toolsArr[0];
  currentTool.complete = complete;
  currentTool.addPoint = addPoint;

  const props = {
    className: 'className',
    onChangeMarks,
    tools: toolsArr,
    domain: { min: 0, max: 1, step: 1 },
    range: { min: 0, max: 1, step: 1 },
    size: { width: 400, height: 400 },
    currentTool,
  };

  const renderComponent = (extras) => {
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
    return render(<Graph {...properties} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders SVG graph', () => {
      const { container } = renderComponent();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
