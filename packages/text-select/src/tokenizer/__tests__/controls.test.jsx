import { Controls } from '../controls';
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('controls', () => {
  describe('snapshot', () => {
    it('renders', () => {
      const w = shallow(
        <Controls
          classes={{ button: 'button' }}
          onClear={jest.fn()}
          onWords={jest.fn()}
          onSentences={jest.fn()}
          onParagraphs={jest.fn()}
          setCorrectMode={false}
          onToggleCorrectMode={jest.fn()}
        />
      );
      expect(w).toMatchSnapshot();
    });
  });
});
