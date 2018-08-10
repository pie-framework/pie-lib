import HtmlAndMath from '../html-and-math';
import { shallow } from 'enzyme';
import React from 'react';
import renderMath from '../render-math';

jest.mock('../render-math', () => jest.fn());

describe('html-and-math', () => {
  const mkWrapper = extras => {
    const props = {
      html: '<p>hi</p>',
      ...extras
    };

    return shallow(<HtmlAndMath {...props} />, {
      disableLifecycleMethods: true
    });
  };

  describe('render', () => {
    it('renders', () => {
      const w = mkWrapper();

      expect(w).toMatchSnapshot();
    });
  });

  describe('componentDidMount', () => {
    it('calls renderMath', () => {
      const w = mkWrapper();
      //mock the ref
      w.instance().node = { node: true };
      w.instance().componentDidMount();
      expect(renderMath).toHaveBeenCalled();
    });
  });
  describe('componentDidUpdate', () => {
    it('calls renderMath', () => {
      const w = mkWrapper();
      //mock the ref
      w.instance().node = { node: true };
      w.instance().componentDidUpdate();
      expect(renderMath).toHaveBeenCalled();
    });
  });
});
