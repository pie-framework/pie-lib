import EditableHTML from '../../editable-html';
import { InputContainer } from '../../render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Group from './group';

const feedbackLabels = {
  default: 'Simple Feedback',
  none: 'No Feedback',
  custom: 'Customized Feedback',
};

const holder = (theme, extras) => ({
  marginTop: '0px',
  background: theme.palette.grey[300],
  padding: theme.spacing.unit,
  marginBottom: theme.spacing.unit * 2,
  borderRadius: '4px',
  ...extras,
});

const style = (theme) => ({
  feedbackSelector: {
    marginBottom: theme.spacing.unit,
  },
  label: {
    cursor: 'pointer',
  },
  inputContainerLabel: {
    transform: 'translateY(-20%)',
  },
  feedbackInputContainer: {
    paddingBottom: 0,
  },
  customHolder: holder(theme, {
    background: theme.palette.grey[300],
    padding: 0,
  }),
  defaultHolder: holder(theme, {
    fontFamily: theme.typography.fontFamily,
    padding: theme.spacing.unit * 2,
    cursor: 'default',
  }),
  editor: {
    fontFamily: theme.typography.fontFamily,
  },
  group: {
    paddingTop: theme.spacing.unit,
  },
});

export const FeedbackType = {
  type: PropTypes.oneOf(['default', 'custom', 'none']),
  default: PropTypes.string,
  custom: PropTypes.string,
};

export class FeedbackSelector extends React.Component {
  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string),
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    feedback: PropTypes.shape(FeedbackType).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbarOpts: PropTypes.object,
  };

  changeType = (type) => {
    const { onChange, feedback } = this.props;

    onChange({ ...feedback, type });
  };

  changeCustom = (custom) => {
    const { onChange, feedback } = this.props;

    onChange({ ...feedback, type: 'custom', custom });
  };

  render() {
    const { keys, classes, label, feedback, toolbarOpts, mathMlOptions = {} } = this.props;

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
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </div>
        )}

        {feedback.type === 'default' && <div className={classes.defaultHolder}> {feedback.default}</div>}
      </div>
    );
  }
}

export default withStyles(style)(FeedbackSelector);
