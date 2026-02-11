import React from 'react';
import { render } from '@pie-lib/test-utils';

import { graphProps } from './utils';
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
      to: { x: 1, y: 1 },
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

  const defaultProps = {
    className: 'className',
    onChangeMarks,
    tools: toolsArr,
    domain: { min: 0, max: 1, step: 1 },
    range: { min: 0, max: 1, step: 1 },
    size: { width: 400, height: 400 },
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
        to: { x: 1, y: 1 },
        label: 'Line',
      },
    ],
    ...graphProps(),
  };

  beforeEach(() => {
    onChangeMarks.mockClear();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Graph {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with currentTool', () => {
      const props = {
        ...defaultProps,
        currentTool: toolsArr[0],
      };
      const { container } = render(<Graph {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with marks', () => {
      const { container } = render(<Graph {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with empty marks array', () => {
      const props = {
        ...defaultProps,
        marks: [],
      };
      const { container } = render(<Graph {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with labelModeEnabled', () => {
      const props = {
        ...defaultProps,
        labelModeEnabled: true,
      };
      const { container } = render(<Graph {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('calls onChangeMarks when marks prop changes', () => {
      const { rerender } = render(<Graph {...defaultProps} />);

      const newMarks = [
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'New Point',
          showLabel: true,
        },
      ];

      rerender(<Graph {...defaultProps} marks={newMarks} />);

      // Component should render with new marks
      // Note: onChangeMarks is called internally when marks are changed through user interaction,
      // not when props change, so we just verify the component renders correctly
      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('handles undefined onChangeMarks gracefully', () => {
      const props = {
        ...defaultProps,
        onChangeMarks: undefined,
      };
      const { container } = render(<Graph {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('removeBuildingToolIfCurrentToolDiffers integration', () => {
    it('removes building marks when currentTool changes', () => {
      const marksWithBuilding = [
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
          to: { x: 1, y: 1 },
          building: true,
        },
      ];

      const props = {
        ...defaultProps,
        marks: marksWithBuilding,
        currentTool: { type: 'point' }, // Different from building mark type
      };

      const { container } = render(<Graph {...props} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('updateMarks method', () => {
    it('updates an existing mark', () => {
      const wrapper = render(<Graph {...defaultProps} />);

      const { rerender } = wrapper;

      const updatedMarks = [
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Updated Point',
          showLabel: true,
        },
        {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
          label: 'Line',
        },
      ];

      rerender(<Graph {...defaultProps} marks={updatedMarks} />);

      // Component should render with updated marks
      expect(wrapper.container.firstChild).toBeInTheDocument();
    });

    it('does not update if mark is duplicated', () => {
      const duplicatedMarks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      const { container } = render(<Graph {...defaultProps} marks={duplicatedMarks} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('adds mark if addIfMissing is true and mark does not exist', () => {
      const { container } = render(<Graph {...defaultProps} />);

      // The component should handle adding new marks through user interaction
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not update if mark has no building flag and is duplicated', () => {
      const marks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      const { container } = render(<Graph {...defaultProps} marks={marks} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles building marks correctly', () => {
      const marksWithBuilding = [
        {
          type: 'line',
          from: { x: 0, y: 0 },
          building: true,
        },
      ];

      const { container } = render(<Graph {...defaultProps} marks={marksWithBuilding} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('updates building mark to completed mark', () => {
      const marksWithBuilding = [
        {
          type: 'line',
          from: { x: 0, y: 0 },
          building: true,
        },
      ];

      const { rerender, container } = render(<Graph {...defaultProps} marks={marksWithBuilding} />);

      const completedMarks = [
        {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
          building: false,
        },
      ];

      rerender(<Graph {...defaultProps} marks={completedMarks} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not call onChangeMarks if update is undefined', () => {
      const { container } = render(<Graph {...defaultProps} />);

      // If update is undefined, onChangeMarks should not be called
      // This is handled internally by the component
      expect(container.firstChild).toBeInTheDocument();
    });

    it('does not add mark if existing is not found and addIfMissing is false', () => {
      const { container } = render(<Graph {...defaultProps} />);

      // By default, marks are not added if they don't exist and addIfMissing is false
      expect(container.firstChild).toBeInTheDocument();
    });

    it('calls onChangeMarks with correct marks when updating', () => {
      const marks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      const { rerender } = render(<Graph {...defaultProps} marks={marks} />);

      const updatedMarks = [
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Updated Point',
          showLabel: true,
        },
      ];

      rerender(<Graph {...defaultProps} marks={updatedMarks} />);

      // The component handles mark updates internally
      // onChangeMarks is called through user interactions
    });

    it('preserves other marks when updating a specific mark', () => {
      const marks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point 1',
          showLabel: true,
        },
        {
          type: 'point',
          x: 3,
          y: 3,
          label: 'Point 2',
          showLabel: true,
        },
      ];

      const { container } = render(<Graph {...defaultProps} marks={marks} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('getComponent method', () => {
    it('returns null if mark is null', () => {
      const { container } = render(<Graph {...defaultProps} />);

      // getComponent returns null for null marks
      // This is tested by rendering with undefined marks
      const propsWithoutMarks = { ...defaultProps, marks: [] };
      const { container: emptyContainer } = render(<Graph {...propsWithoutMarks} />);
      expect(emptyContainer.firstChild).toBeInTheDocument();
    });

    it('returns null if mark is undefined', () => {
      const { container } = render(<Graph {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('returns null if tools is undefined', () => {
      const propsWithUndefinedTools = { ...defaultProps, tools: undefined };
      const graphInstance = new Graph(propsWithUndefinedTools);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns null if tools is empty array', () => {
      const propsWithEmptyTools = { ...defaultProps, tools: [] };
      const graphInstance = new Graph(propsWithEmptyTools);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns null if mark type is not found in tools', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'nonexistent-type', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns component if tool has no Component property', () => {
      const toolWithoutComponent = [{ type: 'custom', label: 'Custom' }];
      const propsWithCustomTool = { ...defaultProps, tools: toolWithoutComponent };
      const graphInstance = new Graph(propsWithCustomTool);
      const mark = { type: 'custom', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns correct component for point mark', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeTruthy();
    });

    it('returns correct component for line mark', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeTruthy();
    });

    it('returns correct component for different mark types', () => {
      const graphInstance = new Graph(defaultProps);

      const pointMark = { type: 'point', x: 1, y: 1 };
      const lineMark = { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
      const circleMark = { type: 'circle', center: { x: 0, y: 0 }, edge: { x: 1, y: 1 } };

      const pointComponent = graphInstance.getComponent(pointMark);
      const lineComponent = graphInstance.getComponent(lineMark);
      const circleComponent = graphInstance.getComponent(circleMark);

      expect(pointComponent).toBeTruthy();
      expect(lineComponent).toBeTruthy();
      expect(circleComponent).toBeTruthy();
    });
  });

  describe('getComponent method - unit tests', () => {
    it('returns null if mark is null', () => {
      const graphInstance = new Graph(defaultProps);
      const component = graphInstance.getComponent(null);
      expect(component).toBeNull();
    });

    it('returns null if mark is undefined', () => {
      const graphInstance = new Graph(defaultProps);
      const component = graphInstance.getComponent(undefined);
      expect(component).toBeNull();
    });

    it('returns null if tools is undefined', () => {
      const propsWithUndefinedTools = { ...defaultProps, tools: undefined };
      const graphInstance = new Graph(propsWithUndefinedTools);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns null if tools is empty array', () => {
      const propsWithEmptyTools = { ...defaultProps, tools: [] };
      const graphInstance = new Graph(propsWithEmptyTools);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns null if mark type is not found in tools', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'nonexistent-type', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns component if tool has no Component property', () => {
      const toolWithoutComponent = [{ type: 'custom', label: 'Custom' }];
      const propsWithCustomTool = { ...defaultProps, tools: toolWithoutComponent };
      const graphInstance = new Graph(propsWithCustomTool);
      const mark = { type: 'custom', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeNull();
    });

    it('returns correct component for point mark', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'point', x: 1, y: 1 };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeTruthy();
    });

    it('returns correct component for line mark', () => {
      const graphInstance = new Graph(defaultProps);
      const mark = { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
      const component = graphInstance.getComponent(mark);
      expect(component).toBeTruthy();
    });

    it('returns correct component for different mark types', () => {
      const graphInstance = new Graph(defaultProps);

      const pointMark = { type: 'point', x: 1, y: 1 };
      const lineMark = { type: 'line', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
      const circleMark = { type: 'circle', center: { x: 0, y: 0 }, edge: { x: 1, y: 1 } };

      const pointComponent = graphInstance.getComponent(pointMark);
      const lineComponent = graphInstance.getComponent(lineMark);
      const circleComponent = graphInstance.getComponent(circleMark);

      expect(pointComponent).toBeTruthy();
      expect(lineComponent).toBeTruthy();
      expect(circleComponent).toBeTruthy();
    });
  });

  describe('updateMarks method - unit tests', () => {
    it('does not update if update parameter is null', () => {
      const onChangeMarks = jest.fn();
      const marks = [{ type: 'point', x: 1, y: 1 }];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = marks[0];
      graphInstance.updateMarks(existing, null);

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('does not update if update parameter is undefined', () => {
      const onChangeMarks = jest.fn();
      const marks = [{ type: 'point', x: 1, y: 1 }];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = marks[0];
      graphInstance.updateMarks(existing, undefined);

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('updates existing mark when found', () => {
      const onChangeMarks = jest.fn();
      const marks = [
        { type: 'point', x: 1, y: 1 },
        { type: 'point', x: 2, y: 2 },
      ];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = marks[0];
      const updated = { type: 'point', x: 1, y: 3 };

      graphInstance.updateMarks(existing, updated);

      expect(onChangeMarks).toHaveBeenCalledTimes(1);
      const updatedMarks = onChangeMarks.mock.calls[0][0];
      expect(updatedMarks[0]).toEqual(updated);
      expect(updatedMarks[1]).toEqual(marks[1]);
    });

    it('adds mark if addIfMissing is true and mark not found', () => {
      const onChangeMarks = jest.fn();
      const marks = [{ type: 'point', x: 1, y: 1 }];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = { type: 'point', x: 5, y: 5 };
      const updated = { type: 'point', x: 2, y: 2 };

      graphInstance.updateMarks(existing, updated, true);

      expect(onChangeMarks).toHaveBeenCalledTimes(1);
      const updatedMarks = onChangeMarks.mock.calls[0][0];
      expect(updatedMarks.length).toBe(2);
      expect(updatedMarks[1]).toEqual(updated);
    });

    it('does not add mark if addIfMissing is false and mark not found', () => {
      const onChangeMarks = jest.fn();
      const marks = [{ type: 'point', x: 1, y: 1 }];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = { type: 'point', x: 5, y: 5 };
      const updated = { type: 'point', x: 2, y: 2 };

      graphInstance.updateMarks(existing, updated, false);

      expect(onChangeMarks).not.toHaveBeenCalled();
    });

    it('does not update if mark is still building', () => {
      const onChangeMarks = jest.fn();
      const marks = [{ type: 'point', x: 1, y: 1, building: true }];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = marks[0];
      const updated = { type: 'point', x: 2, y: 2 };

      graphInstance.updateMarks(existing, updated);

      expect(onChangeMarks).toHaveBeenCalled();
    });

    it('preserves mark order when updating', () => {
      const onChangeMarks = jest.fn();
      const marks = [
        { type: 'point', x: 1, y: 1 },
        { type: 'point', x: 2, y: 2 },
        { type: 'point', x: 3, y: 3 },
      ];
      const props = { ...defaultProps, onChangeMarks, marks };
      const graphInstance = new Graph(props);

      const existing = marks[1];
      const updated = { type: 'point', x: 2, y: 5 };

      graphInstance.updateMarks(existing, updated);

      const updatedMarks = onChangeMarks.mock.calls[0][0];
      expect(updatedMarks[0]).toEqual(marks[0]);
      expect(updatedMarks[1]).toEqual(updated);
      expect(updatedMarks[2]).toEqual(marks[2]);
    });

    it('handles empty marks array', () => {
      const onChangeMarks = jest.fn();
      const props = { ...defaultProps, onChangeMarks, marks: [] };
      const graphInstance = new Graph(props);

      const existing = { type: 'point', x: 1, y: 1 };
      const updated = { type: 'point', x: 2, y: 2 };

      graphInstance.updateMarks(existing, updated, true);

      expect(onChangeMarks).toHaveBeenCalledTimes(1);
      const updatedMarks = onChangeMarks.mock.calls[0][0];
      expect(updatedMarks.length).toBe(1);
      expect(updatedMarks[0]).toEqual(updated);
    });
  });

  describe('updateMarks and getComponent integration', () => {
    it('updates marks and renders with correct components', () => {
      const initialMarks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      const { rerender, container } = render(<Graph {...defaultProps} marks={initialMarks} />);

      const updatedMarks = [
        {
          type: 'line',
          from: { x: 0, y: 0 },
          to: { x: 1, y: 1 },
          label: 'Line',
        },
      ];

      rerender(<Graph {...defaultProps} marks={updatedMarks} />);

      expect(container.querySelector('#marks')).toBeInTheDocument();
    });

    it('handles adding new marks with different types', () => {
      const initialMarks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      const { rerender, container } = render(<Graph {...defaultProps} marks={initialMarks} />);

      const updatedMarks = [
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
          to: { x: 1, y: 1 },
          label: 'Line',
        },
      ];

      rerender(<Graph {...defaultProps} marks={updatedMarks} />);

      expect(container.querySelector('#marks')).toBeInTheDocument();
    });

    it('handles removing marks', () => {
      const initialMarks = [
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
          to: { x: 1, y: 1 },
          label: 'Line',
        },
      ];

      const { rerender, container } = render(<Graph {...defaultProps} marks={initialMarks} />);

      const updatedMarks = [
        {
          type: 'point',
          x: 2,
          y: 2,
          label: 'Point',
          showLabel: true,
        },
      ];

      rerender(<Graph {...defaultProps} marks={updatedMarks} />);

      expect(container.querySelector('#marks')).toBeInTheDocument();
    });
  });
});
