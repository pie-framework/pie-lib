import { mount, shallow, configure } from 'enzyme';

import Expander from '../expander';
import React from 'react';
import { CorrectAnswerToggle } from '../index';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('CorrectAnswerToggle', () => {
  let onToggle;
  let wrapper;
  let sheet;

  let mkWrapper = (toggled, msgs) => {
    toggled = toggled === false ? false : true;
    msgs = msgs || {};
    return shallow(
      <CorrectAnswerToggle
        toggled={toggled}
        classes={{
          root: 'root',
          label: 'label'
        }}
        onToggle={onToggle}
        hideMessage={msgs.hide}
        showMessage={msgs.show}
        sheet={sheet}
      />,
      {
        context: {}
      }
    );
  };

  beforeEach(() => {
    let iconStub = {};

    sheet = {
      classes: {
        root: 'root',
        label: 'label'
      }
    };
    onToggle = jest.fn();
    wrapper = mkWrapper();
  });

  describe('render', () => {
    it('has the hide message', () => {
      let holder = wrapper.find('.label');
      expect(holder.text()).toEqual('Hide correct answer');
    });

    it('has show message when toggled is false', () => {
      const w = mkWrapper(false);
      let holder = w.find(`.label`);
      expect(holder.text()).toEqual('Show correct answer');
    });

    it('sets a custom hide message', () => {
      wrapper = mkWrapper(true, { hide: 'hide!' });
      let holder = wrapper.find('.label');
      expect(holder.text()).toEqual('hide!');
    });

    it('sets a custom show message', () => {
      wrapper = mkWrapper(false, { show: 'show!' });
      let holder = wrapper.find('.label');
      expect(holder.text()).toEqual('show!');
    });
  });

  describe('onClick', () => {
    it('calls onToggle', () => {
      wrapper
        .find(Expander)
        .childAt(0)
        .simulate('click');
      expect(onToggle.mock.calls[0][0]).toEqual(false);
    });

    it('calls onToggle with update state', () => {
      onToggle.mockReset();
      wrapper
        .find(Expander)
        .childAt(0)
        .simulate('click');
      expect(onToggle.mock.calls[0][0]).toEqual(false);
      //simulate updating the toggled prop
      wrapper.setProps({ toggled: false });
      wrapper
        .find(Expander)
        .childAt(0)
        .simulate('click');
      expect(onToggle.mock.calls[1][0]).toEqual(true);
    });
  });
});
