import React from 'react';
import ConfigLayout from '../config-layout';
import renderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('layout - snapshot', () => {
  it('renders correctly with a side panel', () => {
    const tree = renderer
      .create(
        <ConfigLayout
          settings={
            <div>
              <div key={0}>Foo</div>
              <div key={1}>Bar</div>
            </div>
          }
          disableSidePanel={false}
        >
          <div>
            <div>Foo</div>
            <div>Bar</div>
          </div>
        </ConfigLayout>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly without a side panel', () => {
    const tree = renderer
      .create(
        <ConfigLayout
          settings={
            <div>
              <div key={0}>Foo</div>
              <div key={1}>Bar</div>
            </div>
          }
          disableSidePanel={true}
        >
          <div>
            <div>Foo</div>
            <div>Bar</div>
          </div>
        </ConfigLayout>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
