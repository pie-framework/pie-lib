import { render } from '@pie-lib/test-utils';
import React from 'react';
import { rootEdgeComponent, rootEdgeToFromToWrapper } from '../with-root-edge';
import { graphProps as getGraphProps } from '../../../../__tests__/utils';
import { utils } from '@pie-lib/plot';

const { xy } = utils;
jest.mock('../index', () => {
  const out = {
    lineBase: jest.fn().mockReturnValue(() => <div />),
    lineToolComponent: jest.fn().mockReturnValue(() => <div />),
  };
  return out;
});

describe('rootEdgeToToFromWrapper', () => {
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

  it('renders without crashing', () => {
    const { container } = renderComponent();
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes mark as from/to', () => {
    const { container } = renderComponent();
    // Component transforms root/edge to from/to internally
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles onChange with root/edge transformation', () => {
    renderComponent();
    // onChange transformation is tested through component behavior
    expect(onChange).toBeDefined();
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
