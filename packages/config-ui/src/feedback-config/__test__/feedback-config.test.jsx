import React, { PropTypes } from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { FeedbackConfig } from '../index';
import FeedbackSelector from '../feedback-selector';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter() });

describe('FeedbackConfig', () => {
  describe('render', () => {
    let component, selectors;
    let feedback = {
      correctFeedback: undefined,
      correctFeedbackType: 'default',
      incorrectFeedback: undefined,
      incorrectFeedbackType: 'default'
    };

    let defaults = {
      correct: 'Correct',
      incorrect: 'Incorrect',
      partial: 'Nearly'
    };

    describe('Feedback Config Component', () => {
      it('should exist', () => {
        component = shallow(
          <FeedbackConfig
            feedback={feedback}
            defaults={defaults}
            onChange={jest.fn()}
          />
        );

        selectors = component.find(FeedbackSelector);

        expect(selectors.length).toEqual(3);
      });

      describe('props', () => {
        it('should not render optionally correct if optional is not needed', () => {
          component = shallow(
            <FeedbackConfig
              allowPartial={false}
              feedback={feedback}
              defaults={defaults}
              onChange={jest.fn()}
            />
          );

          selectors = component.find(FeedbackSelector);

          expect(selectors.length).toEqual(2);
        });
      });
    });
  });
});
