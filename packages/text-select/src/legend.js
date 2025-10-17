import React from 'react';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';
import classNames from 'classnames';

const { translator } = Translator;

const StyledFlexContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: '1px solid lightgrey',
  borderTop: '1px solid lightgrey',
  paddingBottom: theme.spacing(1),
  paddingTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StyledKey = styled('span')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 'bold',
  color: color.black(),
  marginLeft: theme.spacing(1),
}));

const StyledContainer = styled('div')(() => ({
  position: 'relative',
  padding: '4px',
  fontSize: '14px',
  borderRadius: '4px',
}));

const StyledCorrectContainer = styled(StyledContainer)(() => ({
  border: `${color.correctTertiary()} solid 2px`,
}));

const StyledIncorrectContainer = styled(StyledContainer)(() => ({
  border: `${color.incorrectWithIcon()} solid 2px`,
}));

const StyledMissingContainer = styled(StyledContainer)(() => ({
  border: `${color.incorrectWithIcon()} dashed 2px`,
}));

const StyledIcon = styled('div')(() => ({
  color: color.white(),
  position: 'absolute',
  top: '-8px',
  left: '-8px',
  borderRadius: '50%',
  fontSize: '12px',
  padding: '2px',
}));

const StyledCorrectIcon = styled(StyledIcon)(() => ({
  backgroundColor: color.correctTertiary(),
}));

const StyledIncorrectIcon = styled(StyledIcon)(() => ({
  backgroundColor: color.incorrectWithIcon(),
}));

export const Legend = ({ language, showOnlyCorrect }) => {
  const legendItems = [
    {
      Icon: Check,
      label: translator.t('selectText.correctAnswerSelected', { lng: language }),
      Container: StyledCorrectContainer,
      IconComponent: StyledCorrectIcon,
    },
    {
      Icon: Close,
      label: translator.t('selectText.incorrectSelection', { lng: language }),
      Container: StyledIncorrectContainer,
      IconComponent: StyledIncorrectIcon,
    },
    {
      Icon: Close,
      label: translator.t('selectText.correctAnswerNotSelected', { lng: language }),
      Container: StyledMissingContainer,
      IconComponent: StyledIncorrectIcon,
    },
  ];

  if (showOnlyCorrect) {
    legendItems.splice(1, 2);
  }

  return (
    <StyledFlexContainer>
      <StyledKey>{translator.t('selectText.key', { lng: language })}</StyledKey>
      {legendItems.map(({ Icon, label, Container, IconComponent }, idx) => (
        <Container key={idx}>
          <IconComponent>
            <Icon />
          </IconComponent>
          <span>{label}</span>
        </Container>
      ))}
    </StyledFlexContainer>
  );
};
