import * as React from 'react';
import withUndoReset from '../withUndoReset';
import { mount, shallow } from 'enzyme';

describe('withUndoReset', () => {
  let wrapper;
  let defaultProps;
  const WrappedClass = class WrappedComponent extends React.Component {
    onSessionChange = session => {
      this.props.onSessionChange(session);
    }

    onAddItem = item => {
      this.onSessionChange({
        ...this.props.session,
        items: this.props.session.items.concat(item),
      });
    }

    onRemoveLastItem = () => {
      const newItems = [...this.props.session.items];

      newItems.pop();

      this.onSessionChange({
        ...this.props.session,
        items: newItems,
      });
    }

    render() {
      const { session } = this.props;
      const items = session.items || {};

      return (
        <div>
          {items.map(item => (
            <span key={item.id}>
              {item.id}
            </span>
          ))}
        </div>
      );
    }
  }

  const Component = withUndoReset(WrappedClass);

  describe('retains internal component functionality', () => {
    beforeEach(() => {
      defaultProps = {
        session: {
          items: []
        },
        onSessionChange: jest.fn()
      };
    })

    it('moves past HoC and returns the rendered component using enzyme', () => {
      wrapper = mount(<Component {...defaultProps} />);
      expect(wrapper.find(WrappedClass).length).toEqual(1);
      expect(wrapper.find(WrappedClass).props()).toEqual(expect.objectContaining({
        session: { items: [] }
      }));
    });

    it('contains the reset logic container', () => {
      wrapper = mount(<Component {...defaultProps} />);
      expect(wrapper.html().includes('Start Over')).toEqual(true);
      expect(wrapper.html().includes('Undo')).toEqual(true);
    });

    it('can interact with session', () => {
      wrapper = mount(<Component {...defaultProps} />);

      expect(wrapper.find('span').length).toEqual(2);

      wrapper.find(WrappedClass).instance().onAddItem({ id: 1 });

      expect(wrapper.find(WrappedClass).html().includes('span')).toEqual(true);

      wrapper.find(WrappedClass).instance().onRemoveLastItem();

      expect(wrapper.find(WrappedClass).html().includes('span')).toEqual(false);
    });
  })
})
