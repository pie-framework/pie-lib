import * as React from 'react';
import { shallowChild } from '../index';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('test-utils', () => {
  describe('shallowChild', () => {
    function simpleHoC(WrappedComponent) {
      return class extends React.Component {
        render() {
          return (
            <div>
              <WrappedComponent oneMoreProp="hello" {...this.props} />
            </div>
          );
        }
      };
    }

    class SimpleComponent extends React.Component {
      render() {
        return <span>My simple component will get wrapped</span>;
      }
    }

    it('moves past HoC and returns shallow rendered component using enzyme', () => {
      const wrapper = shallowChild(simpleHoC(SimpleComponent), null, 1);
      const shallowComponent = wrapper();

      expect(shallowComponent.find(SimpleComponent).length).toEqual(1);
      expect(shallowComponent.props().children.props.oneMoreProp).toEqual('hello');
      expect(shallowComponent.html().includes('span')).toEqual(true);
    });

    it('overwrites specific props when passed into the closure', () => {
      const wrapper = shallowChild(simpleHoC(SimpleComponent), null, 1);
      const shallowComponent = wrapper({ oneMoreProp: 'helloToo' });

      expect(shallowComponent.find(SimpleComponent).length).toEqual(1);
      expect(shallowComponent.props().children.props.oneMoreProp).toEqual('helloToo');
    });
  });
});
