import { Controls } from '../controls';
import React from 'react';
import { shallow } from 'enzyme';

describe('controls', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <Controls
          classes={{ button: 'button' }}
          onClear={jest.fn()}
          onWords={jest.fn()}
          onSentences={jest.fn()}
          setCorrectMode={false}
          onToggleCorrectMode={jest.fn()}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });
});
