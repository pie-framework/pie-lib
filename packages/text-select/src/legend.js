import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';
import classNames from 'classnames';

const { translator } = Translator;

export const Legend = withStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: `${2 * theme.spacing.unit}px`,
    borderBottom: '1px solid lightgrey',
    borderTop: '1px solid lightgrey',
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  key: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: color.black(),
    marginLeft: theme.spacing.unit,
  },
  container: {
    position: 'relative',
    padding: '4px',
    fontSize: '14px',
    borderRadius: '4px',
  },
  correct: {
    border: `${color.correctTertiary()} solid 2px`,
  },
  incorrect: {
    border: `${color.incorrectWithIcon()} solid 2px`,
  },
  missing: {
    border: `${color.incorrectWithIcon()} dashed 2px`,
  },
  incorrectIcon: {
    backgroundColor: color.incorrectWithIcon(),
  },
  correctIcon: {
    backgroundColor: color.correctTertiary(),
  },
  icon: {
    color: color.white(),
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    borderRadius: '50%',
    fontSize: '12px',
    padding: '2px',
  },
}))(({ classes, language, showOnlyCorrect }) => {
  const legendItems = [
    {
      Icon: Check,
      label: translator.t('selectText.correctAnswerSelected', { lng: language }),
      containerClass: classNames(classes.correct, classes.container),
      iconClass: classNames(classes.correctIcon, classes.icon),
    },
    {
      Icon: Close,
      label: translator.t('selectText.incorrectSelection', { lng: language }),
      containerClass: classNames(classes.incorrect, classes.container),
      iconClass: classNames(classes.incorrectIcon, classes.icon),
    },
    {
      Icon: Close,
      label: translator.t('selectText.correctAnswerNotSelected', { lng: language }),
      containerClass: classNames(classes.missing, classes.container),
      iconClass: classNames(classes.incorrectIcon, classes.icon),
    },
  ];

  if (showOnlyCorrect) {
    legendItems.splice(1, 2);
  }

  return (
    <div className={classes.flexContainer}>
      <span className={classes.key}>{translator.t('selectText.key', { lng: language })}</span>
      {legendItems.map(({ Icon, label, containerClass, iconClass }, idx) => (
        <div key={idx} className={containerClass}>
          <Icon className={iconClass} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
});
