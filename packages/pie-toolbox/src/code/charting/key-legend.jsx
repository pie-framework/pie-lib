import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { color } from '../render-ui';
import Icons from './key-legend-icons';
import Translator from '../translator';

const styles = (theme) => ({
  container: {
    backgroundColor: color.defaults.WHITE,
    padding: theme.spacing.unit * 2,
    width: '355px',
    boxShadow: 'inset 0px 1px 5px 0px #9297A6',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: '700',
  },
  smallText: {
    marginLeft: '2px',
  },
});

const { translator } = Translator;

const KeyLegend = ({ classes, language }) => (
  <div className={classes.container}>
    <div className={classes.title}>Key</div>
    <div className={classes.row}>
      <Icons.IncorrectAnswerIcon />
      <div className={classes.text}>{translator.t('charting.keyLegend.incorrectAnswer', { lng: language })}</div>
    </div>
    <div className={classes.row}>
      <Icons.CorrectAnswerIcon />
      <div className={classes.text}>{translator.t('charting.keyLegend.correctAnswer', { lng: language })}</div>
    </div>
    <div className={classes.row}>
      <Icons.AnswerKeyCorrectIcon />
      <div className={classes.smallText}>{translator.t('charting.keyLegend.correctKeyAnswer', { lng: language })}</div>
    </div>
  </div>
);

KeyLegend.propTypes = {
  classes: PropTypes.object.isRequired,
  language: PropTypes.string,
};

export default withStyles(styles)(KeyLegend);
