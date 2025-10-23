//import EditableHTML from '@pie-lib/editable-html';
import { InputContainer } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import Group from './group';


// - mathquill error window not defined
let EditableHtml;
let StyledEditableHTML;
if (typeof window !== 'undefined') {
  EditableHtml = require('@pie-lib/editable-html')['default'];
  StyledEditableHTML = styled(EditableHtml)(({ theme }) => ({
    fontFamily: theme.typography.fontFamily,
  }));
}

const feedbackLabels = {
  default: 'Simple Feedback',
  none: 'No Feedback',
  custom: 'Customized Feedback',
};

const StyledFeedbackSelector = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledInputContainer = styled(InputContainer)(() => ({
  paddingBottom: 0,
}));

const StyledCustomHolder = styled('div')(({ theme }) => ({
  marginTop: '0px',
  background: theme.palette.grey[300],
  padding: 0,
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
}));

const StyledDefaultHolder = styled('div')(({ theme }) => ({
  marginTop: '0px',
  background: theme.palette.grey[300],
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
  fontFamily: theme.typography.fontFamily,
  cursor: 'default',
}));

const StyledGroup = styled(Group)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

export const FeedbackType = {
  type: PropTypes.oneOf(['default', 'custom', 'none']),
  default: PropTypes.string,
  custom: PropTypes.string,
};

export class FeedbackSelector extends React.Component {
  static propTypes = {
    keys: PropTypes.arrayOf(PropTypes.string),
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
    const { keys, label, feedback, toolbarOpts, mathMlOptions = {} } = this.props;

    const feedbackKeys = keys || Object.keys(feedbackLabels);

    return (
      <StyledFeedbackSelector>
        <StyledInputContainer
          label={label}
          extraClasses={{ label: { transform: 'translateY(-20%)' } }}
        >
          <StyledGroup
            keys={feedbackKeys}
            label={label}
            value={feedback.type}
            onChange={this.changeType}
            feedbackLabels={feedbackLabels}
          />
        </StyledInputContainer>

        {feedback.type === 'custom' && (
          <StyledCustomHolder>
            <StyledEditableHTML
              onChange={this.changeCustom}
              markup={feedback.custom || ''}
              toolbarOpts={toolbarOpts}
              languageCharactersProps={[{ language: 'spanish' }, { language: 'special' }]}
              mathMlOptions={mathMlOptions}
            />
          </StyledCustomHolder>
        )}

        {feedback.type === 'default' && <StyledDefaultHolder> {feedback.default}</StyledDefaultHolder>}
      </StyledFeedbackSelector>
    );
  }
}

export default FeedbackSelector;
