import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

const StyledContainer = styled('div')(({ theme }) => ({
  backgroundColor: color.defaults.WHITE,
  padding: theme.spacing(2),
  width: '355px',
  boxShadow: 'inset 0px 1px 5px 0px #9297A6',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const StyledRow = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const StyledTitle = styled('div')(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: '700',
}));

const StyledSmallText = styled('div')(() => ({
  marginLeft: '2px',
}));

const StyledCorrectIcon = styled(Check)(({ theme }) => ({
  backgroundColor: color.correct(),
  borderRadius: theme.spacing(2),
  color: color.defaults.WHITE,
}));

const StyledIncorrectIcon = styled(Close)(({ theme }) => ({
  backgroundColor: color.incorrectWithIcon(),
  borderRadius: theme.spacing(2),
  color: color.defaults.WHITE,
}));

const StyledLastRow = styled('div')(() => ({
  marginLeft: '3px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const { translator } = Translator;

const KeyLegend = ({ language }) => (
  <StyledContainer>
    <StyledTitle>Key</StyledTitle>
    <StyledRow>
      <StyledIncorrectIcon />
      <div>{translator.t('charting.keyLegend.incorrectAnswer', { lng: language })}</div>
    </StyledRow>
    <StyledRow>
      <StyledCorrectIcon />
      <div>{translator.t('charting.keyLegend.correctAnswer', { lng: language })}</div>
    </StyledRow>
    <StyledLastRow>
      <StyledCorrectIcon fontSize={'small'} />
      <StyledSmallText>{translator.t('charting.keyLegend.correctKeyAnswer', { lng: language })}</StyledSmallText>
    </StyledLastRow>
  </StyledContainer>
);

KeyLegend.propTypes = {
  language: PropTypes.string,
};

export default KeyLegend;
