import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import ActionDelete from '@mui/icons-material/Delete';
import ArrowRight from '@mui/icons-material/SubdirectoryArrowRight';
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';
import { InputContainer } from '@pie-lib/render-ui';
// import EditableHtml from '@pie-lib/editable-html';
import { InputCheckbox, InputRadio } from '../inputs';
import FeedbackMenu from './feedback-menu';

// - mathquill error window not defined
let EditableHtml;
if (typeof window !== 'undefined') {
  EditableHtml = require('@pie-lib/editable-html')['default'];
}

const StyledEditorHolder = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const EditableHtmlContainer = ({
  label,
  onChange,
  value,
  className,
  imageSupport,
  disableImageAlignmentButtons,
  disabled,
  spellCheck,
  nonEmpty,
  pluginOpts,
  toolbarOpts,
  error,
  maxImageWidth,
  maxImageHeight,
  uploadSoundSupport,
  mathMlOptions = {},
}) => {
  const names = classNames(className);

  return (
    <InputContainer label={label} className={names}>
      <StyledEditorHolder>
        <EditableHtml
          markup={value || ''}
          disabled={disabled}
          spellCheck={spellCheck}
          nonEmpty={nonEmpty}
          onChange={onChange}
          imageSupport={imageSupport}
          disableImageAlignmentButtons={disableImageAlignmentButtons}
          pluginProps={pluginOpts || {}}
          toolbarOpts={toolbarOpts}
          error={error}
          maxImageWidth={maxImageWidth}
          maxImageHeight={maxImageHeight}
          uploadSoundSupport={uploadSoundSupport}
          languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
          mathMlOptions={mathMlOptions}
        />
      </StyledEditorHolder>
    </InputContainer>
  );
};

const StyledFeedbackContainer = styled('div')(() => ({
  position: 'relative',
}));

const StyledArrowIcon = styled(ArrowRight)(({ theme }) => ({
  fill: theme.palette.grey[400],
  left: -56,
  position: 'absolute',
  top: 20,
}));

const StyledTextField = styled(TextField)(() => ({
  width: '100%',
}));

const StyledEditableHtmlContainer = styled(EditableHtmlContainer)(() => ({
  width: '100%',
}));

const Feedback = ({ value, onChange, type, correct, defaults, toolbarOpts, mathMlOptions = {} }) => {
  if (!type || type === 'none') {
    return null;
  } else if (type === 'default') {
    return (
      <StyledFeedbackContainer>
        <StyledArrowIcon />
        <StyledTextField
          label="Feedback Text"
          value={correct ? defaults.correct : defaults.incorrect}
        />
      </StyledFeedbackContainer>
    );
  } else {
    return (
      <StyledFeedbackContainer>
        <StyledArrowIcon />
        <StyledEditableHtmlContainer
          label="Feedback Text"
          value={value}
          onChange={onChange}
          toolbarOpts={toolbarOpts}
          mathMlOptions={mathMlOptions}
        />
      </StyledFeedbackContainer>
    );
  }
};

const StyledIndex = styled('span')(({ theme }) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(3.5),
}));

const StyledTopRow = styled('div')(() => ({
  display: 'flex',
}));

const StyledToggle = styled('div')(({ theme }) => ({
  flex: '0 1 auto',
  paddingTop: theme.spacing(0.5),
  paddingBottom: 0,
  marginRight: 0,
  marginLeft: theme.spacing(1),
}));

const StyledFeedback = styled('div')(({ theme }) => ({
  flex: '0 1 auto',
  paddingTop: theme.spacing(2),
  paddingLeft: 0,
  marginLeft: 0,
  marginRight: theme.spacing(1),
}));

const StyledFeedbackIcon = styled('div')(() => ({
  margin: 0,
  width: 'inherit',
}));

const StyledDeleteIcon = styled('div')(() => ({
  margin: 0,
  width: 'inherit',
}));

const StyledDelete = styled('div')(({ theme }) => ({
  flex: '0 1 auto',
  paddingTop: theme.spacing(2),
  paddingLeft: 0,
  marginLeft: 0,
}));

const StyledMiddleColumn = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  marginRight: theme.spacing(1),
}));

const StyledInput = styled('div')(() => ({
  marginRight: 0,
}));

const StyledErrorText = styled('div')(({ theme }) => ({
  fontSize: theme.typography.fontSize - 2,
  color: theme.palette.error.main,
}));

export class ChoiceConfiguration extends React.Component {
  static propTypes = {
    noLabels: PropTypes.bool,
    useLetterOrdering: PropTypes.bool,
    className: PropTypes.string,
    error: PropTypes.string,
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
        value: PropTypes.string,
      }),
    }),
    onDelete: PropTypes.func,
    onChange: PropTypes.func,
    index: PropTypes.number,
    imageSupport: PropTypes.shape({
      add: PropTypes.func.isRequired,
      delete: PropTypes.func.isRequired,
    }),
    disableImageAlignmentButtons: PropTypes.bool,
    allowFeedBack: PropTypes.bool,
    allowDelete: PropTypes.bool,
    noCorrectAnswerError: PropTypes.string,
    spellCheck: PropTypes.bool,
    pluginOpts: PropTypes.object,
    toolbarOpts: PropTypes.object,
    uploadSoundSupport: PropTypes.object,
    maxImageWidth: PropTypes.number,
    maxImageHeight: PropTypes.number,
  };

  static defaultProps = {
    index: -1,
    noLabels: false,
    useLetterOrdering: false,
    allowFeedBack: true,
    allowDelete: true,
  };

  _changeFn = (key) => (update) => {
    const { data, onChange } = this.props;

    if (onChange) {
      onChange({ ...data, [key]: update });
    }
  };

  onLabelChange = this._changeFn('label');

  onCheckedChange = (event) => {
    const correct = event.target.checked;
    const { data, onChange } = this.props;

    if (onChange) {
      onChange({ ...data, correct });
    }
  };

  onFeedbackValueChange = (v) => {
    const { data, onChange } = this.props;

    if (data.feedback.type !== 'custom') {
      return;
    }

    const fb = { ...data.feedback, value: v };

    if (onChange) onChange({ ...data, feedback: fb });
  };

  onFeedbackTypeChange = (t) => {
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
      mode,
      onDelete,
      defaultFeedback,
      index,
      className,
      noLabels,
      useLetterOrdering,
      imageSupport,
      disableImageAlignmentButtons,
      disabled,
      spellCheck,
      nonEmpty,
      allowFeedBack,
      allowDelete,
      pluginOpts,
      toolbarOpts,
      error,
      noCorrectAnswerError,
      uploadSoundSupport,
      maxImageWidth,
      maxImageHeight,
      mathMlOptions = {},
    } = this.props;

    const InputToggle = mode === 'checkbox' ? InputCheckbox : InputRadio;
    const names = classNames(className);

    return (
      <div className={names}>
        <StyledTopRow>
          {index > 0 && (
            <StyledIndex type="title">
              {useLetterOrdering ? String.fromCharCode(96 + index).toUpperCase() : index}
            </StyledIndex>
          )}

          <StyledToggle>
            <InputToggle
              onChange={this.onCheckedChange}
              label={!noLabels ? 'Correct' : ''}
              checked={!!data.correct}
              error={noCorrectAnswerError}
            />
          </StyledToggle>

          <StyledMiddleColumn>
            <StyledInput>
              <EditableHtmlContainer
                label={!noLabels ? 'Label' : ''}
                value={data.label}
                onChange={this.onLabelChange}
                imageSupport={imageSupport}
                disableImageAlignmentButtons={disableImageAlignmentButtons}
                disabled={disabled}
                spellCheck={spellCheck}
                nonEmpty={nonEmpty}
                pluginOpts={pluginOpts}
                toolbarOpts={toolbarOpts}
                error={error}
                uploadSoundSupport={uploadSoundSupport}
                mathMlOptions={mathMlOptions}
                maxImageWidth={maxImageWidth}
                maxImageHeight={maxImageHeight}
              />
            </StyledInput>
            {error && <StyledErrorText>{error}</StyledErrorText>}

            {allowFeedBack && (
              <Feedback
                {...data.feedback}
                correct={data.correct}
                defaults={defaultFeedback}
                onChange={this.onFeedbackValueChange}
                toolbarOpts={toolbarOpts}
              />
            )}
          </StyledMiddleColumn>

          {allowFeedBack && (
            <StyledFeedback>
              <InputContainer label={!noLabels ? 'Feedback' : ''}>
                <StyledFeedbackIcon>
                  <FeedbackMenu
                    onChange={this.onFeedbackTypeChange}
                    value={data.feedback}
                  />
                </StyledFeedbackIcon>
              </InputContainer>
            </StyledFeedback>
          )}

          {allowDelete && (
            <StyledDelete>
              <InputContainer label={!noLabels ? 'Delete' : ''}>
                <StyledDeleteIcon>
                  <IconButton
                    aria-label="delete"
                    onClick={onDelete}
                    size="large">
                    <ActionDelete />
                  </IconButton>
                </StyledDeleteIcon>
              </InputContainer>
            </StyledDelete>
          )}
        </StyledTopRow>
      </div>
    );
  }
}

export default ChoiceConfiguration;
