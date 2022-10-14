import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { InputContainer } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import { InputCheckbox, InputRadio } from '../inputs';
import FeedbackMenu from './feedback-menu';
import ActionDelete from '@material-ui/icons/Delete';
import ArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import IconButton from '@material-ui/core/IconButton';

const EditableHtmlContainer = withStyles(theme => ({
  labelContainer: {},
  editorHolder: {
    marginTop: theme.spacing.unit * 2
  }
}))(
  ({
    label,
    classes,
    onChange,
    value,
    className,
    imageSupport,
    disabled,
    spellCheck,
    nonEmpty,
    toolbarOpts,
    error,
    maxImageWidth,
    maxImageHeight,
    uploadSoundSupport
  }) => {
    const names = classNames(classes.labelContainer, className);

    return (
      <InputContainer label={label} className={names}>
        <div className={classes.editorHolder}>
          <EditableHtml
            markup={value || ''}
            disabled={disabled}
            spellCheck={spellCheck}
            nonEmpty={nonEmpty}
            onChange={onChange}
            imageSupport={imageSupport}
            className={classes.editor}
            toolbarOpts={toolbarOpts}
            error={error}
            maxImageWidth={maxImageWidth}
            maxImageHeight={maxImageHeight}
            uploadSoundSupport={uploadSoundSupport}
          />
        </div>
      </InputContainer>
    );
  }
);

const Feedback = withStyles(() => ({
  text: {
    width: '100%'
  },
  feedbackContainer: {
    position: 'relative'
  },
  arrowIcon: {
    fill: '#ccc',
    left: -56,
    position: 'absolute',
    top: 20
  }
}))(({ value, onChange, type, correct, classes, defaults, toolbarOpts }) => {
  if (!type || type === 'none') {
    return null;
  } else if (type === 'default') {
    return (
      <div className={classes.feedbackContainer}>
        <ArrowRight className={classes.arrowIcon} />
        <TextField
          className={classes.text}
          label="Feedback Text"
          value={correct ? defaults.correct : defaults.incorrect}
        />
      </div>
    );
  } else {
    return (
      <div className={classes.feedbackContainer}>
        <ArrowRight className={classes.arrowIcon} />
        <EditableHtmlContainer
          className={classes.text}
          label="Feedback Text"
          value={value}
          onChange={onChange}
          toolbarOpts={toolbarOpts}
        />
      </div>
    );
  }
});

export class ChoiceConfiguration extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    noLabels: PropTypes.bool,
    useLetterOrdering: PropTypes.bool,
    className: PropTypes.string,
    mode: PropTypes.oneOf(['checkbox', 'radio']),
    defaultFeedback: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    nonEmpty: PropTypes.bool,
    data: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      correct: PropTypes.bool,
      feedback: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.string
      })
    }),
    onDelete: PropTypes.func,
    onChange: PropTypes.func,
    index: PropTypes.number,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired
    }),
    allowFeedBack: PropTypes.bool,
    allowDelete: PropTypes.bool,
    toolbarOpts: PropTypes.object
  };

  static defaultProps = {
    index: -1,
    noLabels: false,
    useLetterOrdering: false,
    allowFeedBack: true,
    allowDelete: true
  };

  _changeFn = key => update => {
    const { data, onChange } = this.props;
    if (onChange) {
      onChange({ ...data, [key]: update });
    }
  };

  onLabelChange = this._changeFn('label');

  onCheckedChange = event => {
    const correct = event.target.checked;
    const { data, onChange } = this.props;

    if (onChange) {
      onChange({ ...data, correct });
    }
  };

  onFeedbackValueChange = v => {
    const { data, onChange } = this.props;

    if (data.feedback.type !== 'custom') {
      return;
    }

    const fb = { ...data.feedback, value: v };

    if (onChange) onChange({ ...data, feedback: fb });
  };

  onFeedbackTypeChange = t => {
    const { data, onChange } = this.props;
    const fb = { ...data.feedback, type: t };
    if (fb.type !== 'custom') {
      fb.value = undefined;
    }

    if (onChange) onChange({ ...data, feedback: fb });
  };

  render() {
    const {
      data,
      classes,
      mode,
      onDelete,
      defaultFeedback,
      index,
      className,
      noLabels,
      useLetterOrdering,
      imageSupport,
      disabled,
      spellCheck,
      nonEmpty,
      allowFeedBack,
      allowDelete,
      toolbarOpts,
      error,
      noCorrectAnswerError,
      uploadSoundSupport
    } = this.props;

    const InputToggle = mode === 'checkbox' ? InputCheckbox : InputRadio;
    const names = classNames(classes.choiceConfiguration, className);
    return (
      <div className={names}>
        <div className={classes.topRow}>
          {index > 0 && (
            <span className={classes.index} type="title">
              {useLetterOrdering ? String.fromCharCode(96 + index).toUpperCase() : index}
            </span>
          )}
          <InputToggle
            className={classes.toggle}
            onChange={this.onCheckedChange}
            label={!noLabels ? 'Correct' : ''}
            checked={!!data.correct}
            error={noCorrectAnswerError}
          />
          <div className={classes.middleColumn}>
            <EditableHtmlContainer
              label={!noLabels ? 'Label' : ''}
              value={data.label}
              onChange={this.onLabelChange}
              imageSupport={imageSupport}
              disabled={disabled}
              spellCheck={spellCheck}
              nonEmpty={nonEmpty}
              toolbarOpts={toolbarOpts}
              error={error}
              uploadSoundSupport={uploadSoundSupport}
            />
            {error && <div className={classes.errorText}>{error}</div>}

            {allowFeedBack && (
              <Feedback
                {...data.feedback}
                correct={data.correct}
                defaults={defaultFeedback}
                onChange={this.onFeedbackValueChange}
                toolbarOpts={toolbarOpts}
              />
            )}
          </div>
          {allowFeedBack && (
            <InputContainer className={classes.feedback} label={!noLabels ? 'Feedback' : ''}>
              <FeedbackMenu
                onChange={this.onFeedbackTypeChange}
                value={data.feedback}
                classes={{
                  icon: classes.feedbackIcon
                }}
              />
            </InputContainer>
          )}
          {allowDelete && (
            <InputContainer className={classes.delete} label={!noLabels ? 'Delete' : ''}>
              <IconButton aria-label="delete" className={classes.deleteIcon} onClick={onDelete}>
                <ActionDelete />
              </IconButton>
            </InputContainer>
          )}
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  index: {
    padding: '24px 10px 0 0'
  },
  choiceConfiguration: {},
  topRow: {
    display: 'flex'
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
    paddingLeft: 0,
    width: 'inherit'
  },
  deleteIcon: {
    margin: 0,
    width: 'inherit'
  },
  delete: {
    flex: '0 1 auto',
    paddingTop: theme.spacing.unit,
    paddingLeft: 0,
    marginLeft: 0
  },
  middleColumn: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  errorText: {
    fontSize: '12px',
    color: 'red'
  }
});

export default withStyles(styles)(ChoiceConfiguration);
