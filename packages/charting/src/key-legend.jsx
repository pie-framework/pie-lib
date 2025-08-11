import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { color } from '@pie-lib/render-ui';
import Translator from '@pie-lib/translator';

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
  correctIcon: {
    backgroundColor: color.correct(),
    borderRadius: theme.spacing.unit * 2,
    color: color.defaults.WHITE,
  },
  incorrectIcon: {
    backgroundColor: color.incorrectWithIcon(),
    borderRadius: theme.spacing.unit * 2,
    color: color.defaults.WHITE,
  },

  lastRow: {
    marginLeft: '3px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
});

const { translator } = Translator;

const KeyLegend = ({ classes, language }) => (
  <div className={classes.container}>
    <div className={classes.title}>Key</div>
    <div className={classes.row}>
      <Close className={classes.incorrectIcon} />
      <div className={classes.text}>{translator.t('charting.keyLegend.incorrectAnswer', { lng: language })}</div>
    </div>
    <div className={classes.row}>
      <Check className={classes.correctIcon} />
      <div className={classes.text}>{translator.t('charting.keyLegend.correctAnswer', { lng: language })}</div>
    </div>
    <div className={classes.lastRow}>
      <Check className={classes.correctIcon} fontSize={'small'} />
      <div className={classes.smallText}>{translator.t('charting.keyLegend.correctKeyAnswer', { lng: language })}</div>
    </div>
  </div>
);

KeyLegend.propTypes = {
  classes: PropTypes.object.isRequired,
  language: PropTypes.string,
};

export default withStyles(styles)(KeyLegend);
