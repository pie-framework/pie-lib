import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Remove from '@material-ui/icons/Remove';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

export const Legend = withStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: `${2 * theme.spacing.unit}px`,
    borderBottom: '1px solid lightgrey',
    borderTop: '1px solid lightgrey',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: `${theme.spacing.unit / 2}px`,
    alignItems: 'center',
  },
  correct: {
    fontSize: 'larger',
    color: color.correct(),
    backgroundColor: color.correctSecondary(),
    border: `2px solid ${color.correct()}`,
  },
  incorrect: {
    fontSize: 'larger',
    color: color.missing(),
    backgroundColor: color.incorrectSecondary(),
    border: `2px solid ${color.missing()}`,
  },
  missing: {
    fontSize: 'larger',
    color: color.missing(),
    backgroundColor: color.incorrectSecondary(),
    border: `2px dashed ${color.missing()}`,
  },
}))(({ classes, language }) => {
  const icons = [
    {
      iconName: Check,
      label: translator.t('selectText.correctAnswerSelected', { lng: language }),
      className: classes.correct,
    },
    {
      iconName: Remove,
      label: translator.t('selectText.correctAnswerNotSelected', { lng: language }),
      className: classes.missing,
    },
    {
      iconName: Close,
      label: translator.t('selectText.incorrectSelection', { lng: language }),
      className: classes.incorrect,
    },
  ];

  return (
    <div className={classes.flexContainer}>
      {icons.map((icon, index) => {
        const Icon = icon.iconName;
        return (
          <div key={index} className={classes.container}>
            <Icon className={icon.className} width={'19px'} height={'19px'}></Icon>
            <span>{icon.label}</span>
          </div>
        );
      })}
    </div>
  );
});
