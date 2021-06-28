import EditableHTML from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Group from './group';

const feedbackLabels = {
  default: 'Simple Feedback',
  none: 'No Feedback',
  custom: 'Customized Feedback'
};

const holder = (theme, extras) => ({
  marginTop: '0px',
  background: '#e0dee0',
  padding: theme.spacing.unit * 0.9,
  marginBottom: theme.spacing.unit * 2,
  ...extras
});

const style = theme => ({
  feedbackSelector: {
    marginBottom: theme.spacing.unit
  },
  label: {
    cursor: 'pointer'
  },
  inputContainerLabel: {
    transform: 'translateY(-20%)'
  },
  feedbackInputContainer: {
    paddingBottom: 0
  },
  customHolder: holder(theme, {
    background: '#e0dee0',
    padding: 0
  }),
  defaultHolder: holder(theme, {
    fontFamily: theme.typography.fontFamily,
    cursor: 'default'
  }),
  editor: {
    fontFamily: theme.typography.fontFamily
  },
  group: {
    paddingTop: theme.spacing.unit
  }
});

export const FeedbackType = {
  type: PropTypes.oneOf(['default', 'custom', 'none']),
  default: PropTypes.string,
  custom: PropTypes.string
};

export class FeedbackSelector extends React.Component {
  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string),
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    feedback: PropTypes.shape(FeedbackType).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarOpts: PropTypes.object
  };

  changeType = type => {
    const { onChange, feedback } = this.props;
    onChange({ ...feedback, type });
  };

  changeCustom = custom => {
    const { onChange, feedback } = this.props;
    onChange({ ...feedback, type: 'custom', custom });
  };

  render() {
    const { keys, classes, label, feedback, toolbarOpts } = this.props;

    const feedbackKeys = keys || Object.keys(feedbackLabels);

    return (
      <div className={classes.feedbackSelector}>
        <InputContainer
          label={label}
          className={classes.feedbackInputContainer}
          extraClasses={{ label: classes.inputContainerLabel }}
        >
          <Group
            className={classes.group}
            keys={feedbackKeys}
            label={label}
            value={feedback.type}
            onChange={this.changeType}
            feedbackLabels={feedbackLabels}
          />
        </InputContainer>
        {feedback.type === 'custom' && (
          <div className={classes.customHolder}>
            <EditableHTML
              className={classes.editor}
              onChange={this.changeCustom}
              markup={feedback.custom || ''}
              toolbarOpts={toolbarOpts}
            />
          </div>
        )}
        {feedback.type === 'default' && (
          <div className={classes.defaultHolder}> {feedback.default}</div>
        )}
      </div>
    );
  }
}

export default withStyles(style)(FeedbackSelector);
