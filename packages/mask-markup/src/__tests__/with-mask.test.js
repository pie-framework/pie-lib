import * as React from 'react';
import { shallow } from 'enzyme';
import { withMask } from '../with-mask';

describe('WithMask', () => {
  const onChange = jest.fn();
  const defaultProps = {
    markup: '<p>Foo bar {{0}} over the moon;</p>',
    value: {
      0: 'blank',
    },
    onChange,
  };
  const Masked = withMask('foo', (props) => (node) => {
    const dataset = node.data ? node.data.dataset || {} : {};

    if (dataset.component === 'foo') {
      return <input type="text" value="Foo" />;
    }
  });

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Masked {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onChange', () => {
    const event = (value) => ({
      target: { value },
    });

    it('should call the function', () => {
      const e = event('ceva');

      wrapper.simulate('change', e);

      expect(onChange).toHaveBeenCalledWith({
        target: {
          value: 'ceva',
        },
      });
    });
  });
});
