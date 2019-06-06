import React from 'react';
import { shallow } from 'enzyme';
import { Chevron, GripIcon, ToolbarIcon } from '../index';

describe('icons', () => {
  const mkWrapper = (Component, props) => {
    return shallow(<Component {...props} />);
  };
  describe('snapshot', () => {
    describe('GripIcon', () => {
      it('renders correctly without props', () => {
        const w = mkWrapper(GripIcon);

        expect(w).toMatchSnapshot();
      });

      it('renders correctly with style props', () => {
        const w = mkWrapper(GripIcon, {
          style: {
            position: 'absolute',
            top: '6px',
            left: '15px',
            color: '#9B9B9B'
          }
        });

        expect(w).toMatchSnapshot();
      });
    });

    describe('Chevron', () => {
      it('renders arrow right as default', () => {
        const w = mkWrapper(Chevron);

        expect(w).toMatchSnapshot();
      });

      it('renders arrow right with transform when prop is given', () => {
        const w = mkWrapper(Chevron, {
          direction: 'left'
        });

        expect(w).toMatchSnapshot();
      });

      it('renders with style when prop is given', () => {
        const w = mkWrapper(Chevron, {
          style: {
            position: 'absolute',
            top: '5px',
            right: '5px'
          }
        });

        expect(w).toMatchSnapshot();
      });
    });

    describe('ToolbarIcon', () => {
      it('renders correctly', () => {
        const w = mkWrapper(ToolbarIcon);
        expect(w).toMatchSnapshot();
      });
    });
  });
});
