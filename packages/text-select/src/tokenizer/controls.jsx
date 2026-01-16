import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { color } from '@pie-lib/render-ui';

const StyledControls = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const StyledSwitch = styled(Switch)(() => ({
  '& .MuiSwitch-thumb': {
    '&.Mui-checked': {
      color: `${color.tertiary()} !important`,
    },
  },
  '& .MuiSwitch-track': {
    '&.Mui-checked': {
      backgroundColor: `${color.tertiaryLight()} !important`,
    },
  },
}));

export class Controls extends React.Component {
  static propTypes = {
    onClear: PropTypes.func.isRequired,
    onWords: PropTypes.func.isRequired,
    onSentences: PropTypes.func.isRequired,
    onParagraphs: PropTypes.func.isRequired,
    setCorrectMode: PropTypes.bool.isRequired,
    onToggleCorrectMode: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { onClear, onWords, onSentences, onParagraphs, setCorrectMode, onToggleCorrectMode } = this.props;

    return (
      <StyledControls>
        <div>
          <StyledButton onClick={onWords} size="small" color="primary" disabled={setCorrectMode}>
            Words
          </StyledButton>
          <StyledButton
            onClick={onSentences}
            size="small"
            color="primary"
            disabled={setCorrectMode}
          >
            Sentences
          </StyledButton>
          <StyledButton
            onClick={onParagraphs}
            size="small"
            color="primary"
            disabled={setCorrectMode}
          >
            Paragraphs
          </StyledButton>
          <StyledButton size="small" color="secondary" onClick={onClear} disabled={setCorrectMode}>
            Clear
          </StyledButton>
        </div>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={setCorrectMode}
              onChange={onToggleCorrectMode}
            />
          }
          label="Set correct answers"
        />
      </StyledControls>
    );
  }
}
export default Controls;
