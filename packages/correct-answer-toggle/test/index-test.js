import { assert, stub } from 'sinon';
import { mount, shallow } from 'enzyme';

import Expander from '../src/expander';
import React from 'react';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('CorrectAnswerToggle', () => {

  let onToggle;
  let wrapper;
  let sheet;
  let CorrectAnswerToggle;

  let mkWrapper = (toggled, msgs) => {
    toggled = toggled === false ? false : true;
    msgs = msgs || {};
    return shallow(<CorrectAnswerToggle
      toggled={toggled}
      classes={{
        root: 'root',
        label: 'label'
      }}
      onToggle={onToggle}
      hideMessage={msgs.hide}
      showMessage={msgs.show}
      sheet={sheet} />, {
        context: {}
      });
  }

  beforeEach(() => {

    let iconStub = {
    };

    iconStub['@noCallThru'] = true;
    iconStub['@noCallThru'] = true;

    CorrectAnswerToggle = proxyquire('../src/index', {
      '@pie-lib/icons': iconStub
    }).CorrectAnswerToggle;

    sheet = {
      classes: {
        root: 'root',
        label: 'label'
      }
    };
    onToggle = stub();
    wrapper = mkWrapper();
  });

  describe('render', () => {

    it('has the hide message', () => {
      let holder = wrapper.find('.label');
      expect(holder.text()).to.eql('Hide correct answer');
    });

    it('has show message when toggled is false', () => {
      const w = mkWrapper(false);
      let holder = w.find(`.label`);
      expect(holder.text()).to.eql('Show correct answer');
    });

    it('sets a custom hide message', () => {
      wrapper = mkWrapper(true, { hide: 'hide!' });
      let holder = wrapper.find('.label');
      expect(holder.text()).to.eql('hide!');
    });

    it('sets a custom show message', () => {
      wrapper = mkWrapper(false, { show: 'show!' });
      let holder = wrapper.find('.label');
      expect(holder.text()).to.eql('show!');
    });

  });

  describe('onClick', () => {
    it('calls onToggle', () => {
      wrapper.find(Expander).childAt(0).simulate('click');
      assert.calledWith(onToggle, false);
    });

    it('calls onToggle with update state', () => {
      wrapper.find(Expander).childAt(0).simulate('click');
      assert.calledWith(onToggle, false);
      //simulate updating the toggled prop 
      wrapper.setProps({ toggled: false });
      wrapper.find(Expander).childAt(0).simulate('click');
      assert.calledWith(onToggle, true);
    });

  });

});