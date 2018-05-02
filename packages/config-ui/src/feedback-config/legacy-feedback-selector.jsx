import FeedbackSelector from './feedback-selector';
import React from 'react';
import PropTypes from 'prop-types';

export const map = (legacy, defaultFb) => {
  const out = {
    type: legacy.feedbackType
  };

  out.customFeedback = out.type === 'custom' ? legacy.feedback : '';
  out.default = out.type === 'default' ? legacy.feedback || defaultFb : '';

  return out;
};

export const revert = fb => {
  const out = {
    feedbackType: fb.type
  };

  out.feedback = fb.type === 'custom' ? fb.customFeedback : fb.default;
  return out;
};

export class LegacyFeedbackSelector extends React.Component {
  static propTypes = {
    onFeedbackChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    feedback: PropTypes.object.isRequired,
    defaultFeedback: PropTypes.string.isRequired
  };

  changeFeedback = fb => {
    const legacy = revert(fb);
    this.props.onFeedbackChange(legacy);
  };

  render() {
    const { label, feedback, defaultFeedback } = this.props;
    const mappedFeedback = map(feedback, defaultFeedback);

    return (
      <FeedbackSelector
        label={label}
        feedback={mappedFeedback}
        onFeedbackChange={this.changeFeedback}
      />
    );
  }
}

export default LegacyFeedbackSelector;
