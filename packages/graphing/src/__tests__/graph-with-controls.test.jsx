import { render } from '@pie-lib/test-utils';
import React from 'react';

jest.mock('@pie-lib/drag', () => ({
  DragProvider: ({ children }) => <div data-testid="drag-provider">{children}</div>,
}));

jest.mock('@dnd-kit/core', () => ({
  useDraggable: jest.fn(() => ({
    attributes: {
      role: 'button',
      tabIndex: 0,
    },
    listeners: {
      onPointerDown: jest.fn(),
    },
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  })),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn((transform) => (transform ? 'translate3d(0, 0, 0)' : '')),
    },
  },
}));

jest.mock('@dnd-kit/sortable', () => ({
  arrayMove: jest.fn((array, from, to) => {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
  }),
}));

import {
  GraphWithControls,
  setToolbarAvailability,
  toolIsAvailable,
  getAvailableTool,
  filterByValidToolTypes,
  filterByVisibleToolTypes,
} from '../graph-with-controls';
import { toolsArr, allTools, line as lineTool, point as pointTool } from '../tools';

const point = {
  type: 'point',
  x: 2,
  y: 2,
  label: 'Point',
  showLabel: true,
};

const line = {
  type: 'line',
  from: { x: 0, y: 0 },
  to: { x: 1, y: 1 },
  label: 'Line',
};

const circle = {
  type: 'circle',
  edge: { x: 0, y: 0 },
  root: { x: 2, y: 2 },
};

const marks = [point, line, circle];

describe('setToolbarAvailability', () => {
  it('sets `toolbar: true` if tool should be displayed in toolbar - all tools', () => {
    const result = setToolbarAvailability(allTools);
    const allTrue = new Array(toolsArr.length).fill(true);

    expect(result.map((r) => r.toolbar)).toEqual(allTrue);
  });

  it('sets `toolbar: true` if tool should be displayed in toolbar - few tools', () => {
    const result = setToolbarAvailability(['line', 'circle']);
    const allOthersFalse = new Array(toolsArr.length - 2).fill(false);

    expect(result.filter((r) => r.type === 'line' || r.type === 'circle').map((r) => r.toolbar)).toEqual([true, true]);
    expect(result.filter((r) => r.type !== 'line' && r.type !== 'circle').map((r) => r.toolbar)).toEqual(
      allOthersFalse,
    );
  });
});

describe('toolIsAvailable', () => {
  const tools = setToolbarAvailability(['line', 'circle']);

  it('returns true if tool is available', () => {
    expect(toolIsAvailable(tools, lineTool())).toEqual(true);
  });

  it('returns false if tool is not available', () => {
    expect(toolIsAvailable(tools, pointTool())).toEqual(false);
  });
});

describe('getAvailableTool', () => {
  it('returns the first available tool in list if there is any', () => {
    const tools = setToolbarAvailability(['line', 'circle']);

    expect(getAvailableTool(tools).toolbar).toEqual(true);
  });

  it('returns undefined list if there is no available tool', () => {
    const tools = setToolbarAvailability([]);

    expect(getAvailableTool(tools)).toEqual(undefined);
  });
});

describe('filterByValidToolTypes', () => {
  it('filters marks by valid types', () => {
    const marks = [{ type: 'point' }, { type: 'a' }, { type: 'b' }, { type: 'line' }, { type: 'c' }];

    expect(filterByValidToolTypes(marks)).toEqual([{ type: 'point' }, { type: 'line' }]);
  });
});

describe('filterByVisibleToolTypes', () => {
  it('filters marks by the types that should be visible', () => {
    expect(
      filterByVisibleToolTypes(['line', 'circle'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }]),
    ).toEqual([{ type: 'line' }, { type: 'circle' }]);

    expect(
      filterByVisibleToolTypes(['line', 'circle', 'point'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }]),
    ).toEqual([{ type: 'point' }, { type: 'line' }, { type: 'circle' }]);

    expect(filterByVisibleToolTypes(['line'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }])).toEqual([
      { type: 'line' },
    ]);

    expect(filterByVisibleToolTypes(['segment'], [{ type: 'point' }, { type: 'line' }, { type: 'circle' }])).toEqual(
      [],
    );
  });
});

describe('GraphWithControls', () => {
  let onChangeMarks = jest.fn();

  beforeEach(() => {
    onChangeMarks.mockClear();
  });

  const defaultProps = () => ({
    axesSettings: { includeArrows: true },
    backgroundMarks: [point, line, circle],
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
    language: 'en',
  });
  const initialProps = defaultProps();

  const renderComponent = (extras) => {
    const props = { ...initialProps, ...extras };

    return render(<GraphWithControls {...props} />);
  };

  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders ToolMenu with toolbar tools', () => {
      const { container } = renderComponent({ toolbarTools: ['point', 'line'] });
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders Graph component', () => {
      const { container } = renderComponent();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
