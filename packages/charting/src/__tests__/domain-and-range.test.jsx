import React from 'react';
import DomainAndRange, { DomainAndRange as Inner } from '../domain-and-range';
import renderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { Domain } from 'domain';

configure({ adapter: new Adapter() });

jest.mock('d3-selection', () => ({
  mouse: jest.fn().mockReturnValue([0, 0]),
  select: jest.fn().mockReturnValue({ on: jest.fn() })
}));

const domain = {
  min: -10,
  max: 10,
  padding: 0
};

const range = {
  min: -10,
  max: 10,
  padding: 0
};

describe('logic', () => {
  describe('onRectClick', () => {
    it('calls onClick with scaled x,y', () => {
      const onClick = jest.fn();
      const w = shallow(
        <Inner
          domain={domain}
          range={range}
          width={500}
          height={500}
          classes={{}}
          disabled={false}
          onClick={onClick}
        >
          foo
        </Inner>
      );
      w.instance().onRectClick({ _groups: [[0, 0]] });
      expect(onClick.mock.calls[0][0]).toEqual({ x: -10, y: 10 });
    });
  });
});

describe('snapshot', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <DomainAndRange
          domain={domain}
          range={range}
          width={500}
          height={500}
          classes={{}}
          disabled={false}
        >
          foo
        </DomainAndRange>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
