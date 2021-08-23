import FeedbackSelector, { FeedbackType } from './feedback-selector';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import merge from 'lodash/merge';

export { FeedbackSelector };

const style = {
  feedbackContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
};

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
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    toolbarOpts: PropTypes.object
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
    const { classes, allowPartial, feedback, toolbarOpts } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Feedback</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.feedbackContainer}>
            <FeedbackSelector
              label="If correct, show"
              feedback={feedback.correct}
              onChange={this.onCorrectChange}
              toolbarOpts={toolbarOpts}
            />
            {allowPartial && (
              <FeedbackSelector
                label="If partially correct, show"
                feedback={feedback.partial}
                onChange={this.onPartialChange}
                toolbarOpts={toolbarOpts}
              />
            )}
            <FeedbackSelector
              label="If incorrect, show"
              feedback={feedback.incorrect}
              onChange={this.onIncorrectChange}
              toolbarOpts={toolbarOpts}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(style)(FeedbackConfig);
