import Radio, { RadioGroup } from 'material-ui/Radio';

import EditableHTML from '@pie-lib/editable-html';
import InputContainer from '../input-container';
import PropTypes from 'prop-types';
import RadioWithLabel from '../radio-with-label';
import React from 'react';
import Typography from 'material-ui/Typography';
import debug from 'debug';
import { withStyles } from 'material-ui/styles';

const log = debug('config-ui:feedback-config:feedback-selector');

const feedbackLabels = {
  default: 'Simple Feedback',
  none: 'No Feedback',
  custom: 'Customized Feedback'
};

const style = theme => ({
  feedbackSelector: {
    marginBottom: '20px'
  },
  label: {
    cursor: 'pointer',
  },
  inputContainerLabel: {
    paddingBottom: '10px;'
  },
  choice: {
    display: 'flex',
    alignItems: 'center'
  },
  choiceHolder: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit
  },
  feedbackHolder: {
    marginTop: '0px',
    background: '#e0dee0',
    padding: '13px'
  },
  feedbackInputContainer: {
    paddingBottom: 0
  },
  defaultHolder: {
    fontFamily: theme.typography.fontFamily,
    marginTop: '0px',
    background: '#e0dee0',
    padding: '20px',
    cursor: 'default'
  },
  editor: {
    fontFamily: theme.typography.fontFamily,
  }
});

const Group = ({ feedbackLabels, label, value, classes, handleChange, keys }) => (
  <div className={classes.choiceHolder}>
    {keys.map((key) => {
      return (<div className={classes.choice} key={key}>
        <RadioWithLabel
          value={key}
          checked={value === key}
          onChange={(e) => handleChange(e.currentTarget.value)}
          label={feedbackLabels[key]} />
      </div>);
    })}
  </div>
)

class FeedbackSelector extends React.Component {

  constructor(props) {
    super(props);

    this.onTypeChange = (type) => {
      log('onTypeChange:', type);
      this.props.onFeedbackChange(
        Object.assign(this.props.feedback, { type })
      );
    }

    this.onCustomFeedbackChange = (customFeedback) => {
      log('onCustomFeedbackChange:', customFeedback);
      this.props.onFeedbackChange(
        Object.assign(this.props.feedback, { customFeedback })
      );
    }
  }

  render() {
    const { keys, classes, label, feedback } = this.props;

    let feedbackKeys = keys || Object.keys(feedbackLabels);

    return <div className={classes.feedbackSelector}>
      <InputContainer label={label}
        className={classes.feedbackInputContainer}
        extraClasses={{ label: classes.inputContainerLabel }}>
        <Group
          classes={classes}
          keys={feedbackKeys}
          label={label}
          value={feedback.type}
          handleChange={this.onTypeChange}
          feedbackLabels={feedbackLabels} />
      </InputContainer>
      {feedback.type === 'custom' && <div className={classes.feedbackHolder}>
        <EditableHTML
          className={classes.editor}
          onChange={this.onCustomFeedbackChange}
          markup={feedback.customFeedback || ''} />
      </div>}
      {feedback.type === 'default' &&
        <div className={classes.defaultHolder}> {feedback.default}</div>}
    </div>;
  }
}

FeedbackSelector.propTypes = {
  label: PropTypes.string.isRequired,
  feedback: PropTypes.shape({
    type: PropTypes.oneOf(['default', 'none', 'custom']).isRequired,
    customFeedback: PropTypes.string,
    default: PropTypes.string.isRequired
  }),
  onFeedbackChange: PropTypes.func.isRequired
}

export default withStyles(style, { name: 'FeedbackSelector' })(FeedbackSelector);