import TextSelect from '../text-select';
import { shallow } from 'enzyme';
import React from 'react';
import toJson from 'enzyme-to-json';
describe('text-select', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <TextSelect
          text="foo"
          tokens={[]}
          selectedTokens={[]}
          onChange={jest.fn()}
          maxNoOfSelections={4}
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
        <TextSelect
          text="foo"
          tokens={[]}
          selectedTokens={[]}
          onChange={onChange}
        />
      );
    });

    describe('change', () => {
      it('calls onChange', () => {
        const changeArgs = [
          { start: 0, end: 1, selected: true },
          { start: 1, end: 2 }
        ];

        w.instance().change(changeArgs);
        expect(onChange).toBeCalledWith([{ start: 0, end: 1 }]);
      });
    });
  });
});
