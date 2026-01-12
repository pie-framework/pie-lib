import { render } from '@pie-lib/test-utils';
import React from 'react';
import { rootEdgeComponent, withRootEdge, rootEdgeToFromToWrapper } from '../with-root-edge';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '@pie-lib/plot';
import { lineToolComponent, LineToolMockComponent } from '../index';
const { xy } = utils;
jest.mock('../index', () => {
  const out = {
    lineBase: jest.fn().mockReturnValue(() => <div />),
    lineToolComponent: jest.fn().mockReturnValue(() => <div />),
  };
  return out;
});

// Note: Instance method tests have been removed. Component behavior should be tested
// through user interactions and integration tests.
describe('rootEdgeToToFromWRapper', () => {
  let Comp;
  let onChange = jest.fn();
  beforeEach(() => {
    Comp = rootEdgeToFromToWrapper(() => <div />);
  });
  const renderComponent = (extras) => {
    const defaults = {
      mark: { root: xy(1, 1), edge: xy(2, 2) },
      onChange,
    };
    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };

  it('renders', () => {
    const { container } = renderComponent();
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('rootEdgeComponent', () => {
  let onChange = jest.fn();
  let Comp;
  let mark;
  beforeEach(() => {
    mark = { root: xy(0, 0), edge: xy(1, 1) };
    Comp = rootEdgeComponent(() => <text />);
  });
  const renderComponent = (extras) => {
    const defaults = {
      mark,
      graphProps: getGraphProps(),
      onChange,
    };

    const props = { ...defaults, ...extras };
    return render(<Comp {...props} />);
  };
  describe('rendering', () => {
    it('renders without crashing', () => {
      const { container } = renderComponent();
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
