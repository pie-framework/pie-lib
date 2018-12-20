import React from 'react';
import Layout from '../index';
import renderer from 'react-test-renderer';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('index - snapshot', () => {
  it('renders correctly with a side panel', () => {
    const tree = renderer
      .create(
        <Layout
          sideMenuItems={[
            {
              items: [
                <div key={0}>
                  Foo
                </div>,
                <div key={1}>
                  Bar
                </div>
              ]
            },
            {
              items: [
                <div key={2}>
                  Foo
                </div>,
                <div key={3}>
                  Bar
                </div>
              ]
            }
          ]}
          regularItems={
            <div>
              <div>
                Foo
              </div>
              <div>
                Bar
              </div>
            </div>
          }
          disableSidePanel={false}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('renders correctly without a side panel', () => {
    const tree = renderer
      .create(
        <Layout
          sideMenuItems={[
            {
              items: [
                <div key={0}>
                  Foo
                </div>,
                <div key={1}>
                  Bar
                </div>
              ]
            },
            {
              items: [
                <div key={2}>
                  Foo
                </div>,
                <div key={3}>
                  Bar
                </div>
              ]
            }
          ]}
          regularItems={
            <div>
              <div>
                Foo
              </div>
              <div>
                Bar
              </div>
            </div>
          }
          disableSidePanel={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
