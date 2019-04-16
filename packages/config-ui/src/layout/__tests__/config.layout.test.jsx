import React from 'react';
import ConfigLayout from '../config-layout';
import { shallow } from 'enzyme';

describe('layout - snapshot', () => {
  it('renders correctly with a side panel', () => {
    const tree = shallow(
      <ConfigLayout
        settings={
          <div>
            <div key={0}>Foo</div>
            <div key={1}>Bar</div>
          </div>
        }
      >
        <div>
          <div>Foo</div>
          <div>Bar</div>
        </div>
      </ConfigLayout>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly without a side panel', () => {
    const tree = shallow(
      <ConfigLayout
        settings={
          <div>
            <div key={0}>Foo</div>
            <div key={1}>Bar</div>
          </div>
        }
      >
        <div>
          <div>Foo</div>
          <div>Bar</div>
        </div>
      </ConfigLayout>
    );
    expect(tree).toMatchSnapshot();
  });
});
