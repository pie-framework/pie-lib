import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';
import InputContainer from '../input-container';
import EditableHtml from '@pie-lib/editable-html';
import { InputCheckbox, InputRadio } from '../inputs';
import FeedbackMenu from './feedback-menu';
import ActionDelete from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

const EditableHtmlContainer = withStyles(theme => ({
  labelContainer: {

  },
  editorHolder: {
    marginTop: theme.spacing.unit * 2
  }
}))(({ label, classes, onChange, value, className, imageSupport }) => {

  const names = classNames(classes.labelContainer, className);
  return (
    <InputContainer label={label} className={names}>
      <div className={classes.editorHolder}>
        <EditableHtml
          markup={value || ''}
          onChange={onChange}
          imageSupport={imageSupport}
          className={classes.editor} />
      </div>
    </InputContainer>
  )
});

const Feedback = withStyles(theme => ({
  text: {
    width: '100%'
  }
}))(({ value, onChange, type, correct, classes, defaults }) => {
  if (!type || type === 'none') {
    return null;
  } else if (type === 'default') {
    return <TextField
      className={classes.text}
      label="Feedback Text"
      value={correct ? defaults.correct : defaults.incorrect} />;
  } else {
    return <EditableHtmlContainer
      className={classes.text}
      label="Feedback Text"
      value={value}
      onChange={onChange} />
  }
});

export class RawChoiceConfiguration extends React.Component {


  _changeFn = (key) => (update) => {
    const { data, onChange } = this.props;
    if (onChange) {
      onChange({ ...data, [key]: update });
    }
  }

  onLabelChange = this._changeFn('label');

  onValueChange = (event) => {
    const { onChange, data } = this.props;
    const value = event.target.value;
    if (onChange) {
      onChange({ ...data, value });
    }
  }

  onCheckedChange = (event) => {
    const correct = event.target.checked;
    const { data, onChange } = this.props;

    if (onChange) {
      onChange({ ...data, correct });
    }
  }

  onFeedbackValueChange = (v) => {
    const { data, onChange } = this.props;

    if (data.feedback.type !== 'custom') {
      return;
    }

    const fb = { ...data.feedback, value: v };

    if (onChange) (
      onChange({ ...data, feedback: fb })
    );
  }

  onFeedbackTypeChange = (t) => {
    const { data, onChange } = this.props;
    const fb = { ...data.feedback, type: t };
    if (fb.type !== 'custom') {
      fb.value = undefined;
    }

    if (onChange) (
      onChange({ ...data, feedback: fb })
    );
  }

  render() {

    const { data, classes, mode, onDelete, defaultFeedback, index, className, imageSupport } = this.props;

    const InputToggle = mode === 'checkbox' ? InputCheckbox : InputRadio;
    const names = classNames(classes.choiceConfiguration, className);
    return (
      <div className={names}>
        <div className={classes.topRow}>
          {index > 0 && <Typography
            className={classes.index}
            type="title">{index}</Typography>}
          <InputToggle
            className={classes.toggle}
            onChange={this.onCheckedChange}
            label={'Correct'}
            checked={!!data.correct} />
          <TextField
            label={'Value'}
            value={data.value}
            className={classes.value}
            onChange={this.onValueChange} />
          <EditableHtmlContainer
            label={'Label'}
            value={data.label}
            onChange={this.onLabelChange}
            imageSupport={imageSupport} />
          <InputContainer
            className={classes.feedback}
            label="Feedback">
            <FeedbackMenu
              onChange={this.onFeedbackTypeChange}
              value={data.feedback}
              classes={{
                icon: classes.feedbackIcon
              }} />
          </InputContainer>
          <InputContainer
            className={classes.delete}
            label="Delete">
            <IconButton
              aria-label="delete"
              className={classes.deleteIcon}
              onClick={onDelete}>
              <ActionDelete />
            </IconButton>
          </InputContainer>
        </div>
        <Feedback
          {...data.feedback}
          correct={data.correct}
          defaults={defaultFeedback}
          onChange={this.onFeedbackValueChange} />
      </div>
    );
  }
}

RawChoiceConfiguration.propTypes = {
  mode: PropTypes.oneOf(['checkbox', 'radio']),
  defaultFeedback: PropTypes.object.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    correct: PropTypes.bool,
    feedback: PropTypes.shape({ type: PropTypes.string, value: PropTypes.string })
  }),
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
  index: PropTypes.number,
  imageSupport: PropTypes.shape({
    add: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired
  })
}

RawChoiceConfiguration.defaultProps = {
  index: -1
}

const styles = theme => ({
  index: {
    transform: 'translate(-60%, 35%)'
  },
  choiceConfiguration: {
  },
  topRow: {
    display: 'flex',
  },
  value: {
    flex: '0.5',
    paddingRight: theme.spacing.unit
  },
  editorHolder: {
    marginTop: theme.spacing.unit * 2
  },
  toggle: {
    flex: '0 1 auto'
  },
  feedback: {
    flex: '0 1 auto',
    paddingTop: theme.spacing.unit,
    paddingLeft: 0,
    marginLeft: 0,
    paddingRight: theme.spacing.unit * 3
  },
  feedbackIcon: {
    margin: 0,
    padding: 0,
    width: 'inherit'
  },
  deleteIcon: {
    margin: 0,
    padding: 0,
    width: 'inherit'
  },
  delete: {
    flex: '0 1 auto',
    paddingTop: theme.spacing.unit,
    paddingLeft: 0,
    marginLeft: 0
  }
});

const ChoiceConfiguration = withStyles(styles)(RawChoiceConfiguration);
export default ChoiceConfiguration;