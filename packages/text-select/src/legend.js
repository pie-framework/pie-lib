import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Remove from '@material-ui/icons/Remove';
import { Typography } from '@material-ui/core';
import { color } from '@pie-lib/render-ui';

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
}))(({ classes }) => {
  const icons = [
    { iconName: Check, label: 'Correct answer selected', className: classes.correct },
    { iconName: Remove, label: 'Correct answer not selected', className: classes.missing },
    { iconName: Close, label: 'Incorrect selection', className: classes.incorrect },
  ];
  return (
    <div className={classes.flexContainer}>
      {icons.map((icon, index) => {
        const Icon = icon.iconName;
        return (
          <div key={index} className={classes.container}>
            <Icon className={icon.className} width={'19px'} height={'19px'}></Icon>
            <Typography variant={'subtitle1'}>{icon.label}</Typography>
          </div>
        );
      })}
    </div>
  );
});
