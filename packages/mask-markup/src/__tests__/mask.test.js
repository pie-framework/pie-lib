import * as React from 'react';
import { shallow } from 'enzyme';
import Mask from '../mask';

describe('Mask', () => {
  const renderChildren = jest.fn();
  const onChange = jest.fn();
  const defaultProps = {
    renderChildren,
    onChange,
    layout: {
      nodes: [
        {
          object: 'text',
          leaves: [
            {
              text: 'Foo'
            }
          ]
        }
      ]
    },
    value: {}
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Mask {...defaultProps} />);
  });

  describe('render', () => {
    it('renders correctly with default props', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly a paragraph', () => {
      wrapper.setProps({
        layout: {
          nodes: [
            {
              type: 'p',
              nodes: [
                {
                  object: 'text',
                  leaves: [
                    {
                      text: 'Foo'
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly a div', () => {
      wrapper.setProps({
        layout: {
          nodes: [
            {
              type: 'div',
              data: {
                attributes: {}
              },
              nodes: [
                {
                  type: 'p',
                  data: {
                    attributes: {}
                  },
                  nodes: [
                    {
                      object: 'text',
                      leaves: [
                        {
                          text: 'Foo'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    const da = () => ({ data: { attributes: {} } });
    it('renders without space under tbody', () => {
      wrapper.setProps({
        layout: {
          nodes: [
            {
              type: 'tbody',
              ...da(),
              nodes: [
                {
                  object: 'text',
                  leaves: [{ text: ' ' }]
                },
                { type: 'tr', ...da(), nodes: [] }
              ]
            }
          ]
        }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
