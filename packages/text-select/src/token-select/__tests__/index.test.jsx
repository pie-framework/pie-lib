import { TokenSelect } from '../index';
import React from 'react';
import { shallow } from 'enzyme';

describe('token-select', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <TokenSelect
          tokens={[]}
          classes={{}}
          onChange={jest.fn()}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });

  describe('logic', () => {
    let w, onChange;
    beforeEach(() => {
      onChange = jest.fn();
      w = shallow(
        <TokenSelect
          tokens={[{ selectable: true, text: 'foo' }]}
          classes={{}}
          onChange={onChange}
        />
      );
    });
    describe('selectedCount', () => {
      it('returns the correct count', () => {
        expect(w.instance().selectedCount()).toEqual(0);
      });

      it('returns the correct count for 1 selected', () => {
        w.setProps({ tokens: [{ selected: true }] });
        expect(w.instance().selectedCount()).toEqual(1);
      });
    });

    describe('canSelectMore', () => {
      it('returns true for undefined max selections', () => {
        w.setProps({ maxNoOfSelections: undefined });
        expect(w.instance().canSelectMore(10)).toEqual(true);
      });
      it('returns true for 0 max selections', () => {
        w.setProps({ maxNoOfSelections: 0 });
        expect(w.instance().canSelectMore(10)).toEqual(true);
      });
      it('returns true for -1 max selections', () => {
        w.setProps({ maxNoOfSelections: -1 });
        expect(w.instance().canSelectMore(10)).toEqual(true);
      });
      it('returns true for 5 max selections and count 4', () => {
        w.setProps({ maxNoOfSelections: 5 });
        expect(w.instance().canSelectMore(4)).toEqual(true);
      });

      it('returns true for 5 max selections and count 5', () => {
        w.setProps({ maxNoOfSelections: 5 });
        expect(w.instance().canSelectMore(5)).toEqual(false);
      });

      it('returns false for 5 max selections and count 6', () => {
        w.setProps({ maxNoOfSelections: 5 });
        expect(w.instance().canSelectMore(6)).toEqual(false);
      });
    });

    describe('toggleToken', () => {
      it('return if clicked target is not selectable', () => {
        w.setProps({ maxNoOfSelections: 1, tokens: [{ selected: true }] });

        const closest = jest.fn().mockReturnValue(null);
        const mockedEvent = { target: { closest } };

        w.instance().toggleToken(mockedEvent);

        expect(onChange).not.toBeCalled();
      });

      it('calls onChange', () => {
        w.setProps({ maxNoOfSelections: 0, tokens: [{ selected: true }] });

        const closest = jest.fn().mockReturnValue({
          dataset: {
            indexkey: '0'
          }
        });
        const mockedEvent = { target: { closest } };

        w.instance().toggleToken(mockedEvent);

        expect(onChange).toBeCalled();
      });

      it('returns if max tokens have been selected', () => {
        w.setProps({ maxNoOfSelections: 0, tokens: [{ selected: true }] });

        const closest = jest.fn().mockReturnValue({
          dataset: {
            indexkey: '0'
          }
        });
        const mockedEvent = { target: { closest } };

        w.instance().toggleToken(mockedEvent);

        expect(onChange).not.toBeCalledWith([{ selected: true }]);
      });
    });
  });
});
