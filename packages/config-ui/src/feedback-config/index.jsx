import FeedbackSelector, { FeedbackType } from './feedback-selector';
import FormSection from '../form-section';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import merge from 'lodash/merge';

export { FeedbackSelector };

const style = {};

export const buildDefaults = input => {
  return merge(
    {},
    {
      correct: { type: 'default', default: 'Correct' },
      incorrect: { type: 'default', default: 'Incorrect' },
      partial: { type: 'default', default: 'Nearly' }
    },
    input
  );
};

export class FeedbackConfig extends React.Component {
  static propTypes = {
    allowPartial: PropTypes.bool,
    feedback: PropTypes.shape({
      correct: PropTypes.shape(FeedbackType),
      incorrect: PropTypes.shape(FeedbackType),
      partial: PropTypes.shape(FeedbackType)
    }),
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    allowPartial: true,
    feedback: buildDefaults()
  };

  onChange(key, config) {
    const { feedback, onChange } = this.props;
    const update = { ...feedback, [key]: config };
    onChange(update);
  }

  onCorrectChange = this.onChange.bind(this, 'correct');
  onIncorrectChange = this.onChange.bind(this, 'incorrect');
  onPartialChange = this.onChange.bind(this, 'partial');

  render() {
    const { allowPartial, feedback } = this.props;
    return (
      <FormSection label="Feedback">
        <FeedbackSelector
          label="If correct, show"
          feedback={feedback.correct}
          onChange={this.onCorrectChange}
        />
        {allowPartial && (
          <FeedbackSelector
            label="If partially correct, show"
            feedback={feedback.partial}
            onChange={this.onPartialChange}
          />
        )}
        <FeedbackSelector
          label="If incorrect, show"
          feedback={feedback.incorrect}
          onChange={this.onIncorrectChange}
        />
      </FormSection>
    );
  }
}

export default withStyles(style)(FeedbackConfig);
