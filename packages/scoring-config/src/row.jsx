import React from 'react';
import { NumberTextField } from '@pie-lib/config-ui';
import IconButton from 'material-ui/IconButton';
import ActionDelete from '@material-ui/icons/Delete';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

const Row = ({
  classes,
  scorePercentage,
  numberOfCorrect,
  onRowChange,
  deletable,
  onDelete,
  maxAnswers
}) => {
  const onScoreChange = (event, scorePercentage) =>
    onRowChange({ scorePercentage, numberOfCorrect });
  const onNumberOfCorrectChange = (event, numberOfCorrect) =>
    onRowChange({ scorePercentage, numberOfCorrect });

  return (
    <div className={classes.row}>
      Award
      <NumberTextField
        className={classes.percent}
        min={1}
        max={99}
        value={scorePercentage}
        onChange={onScoreChange}
        suffix={'%'}
      />{' '}
      for&nbsp;
      <NumberTextField
        className={classes.field}
        min={1}
        max={maxAnswers}
        value={numberOfCorrect}
        onChange={onNumberOfCorrectChange}
      />
      correct answer{numberOfCorrect > 1 ? 's' : ''}.
      {deletable && (
        <IconButton className={classes.delete} onClick={onDelete}>
          <ActionDelete />
        </IconButton>
      )}
    </div>
  );
};

const styles = theme => ({
  row: {
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    alignItems: 'baseline'
  },
  percent: {
    width: '60px',
    paddingLeft: theme.spacing.unit
  },
  field: {
    width: '50px',
    paddingLeft: theme.spacing.unit
  },
  delete: {
    position: 'relative',
    top: '6px'
  }
});

export default withStyles(styles)(Row);

Row.propTypes = {
  classes: PropTypes.object.isRequired,
  numberOfCorrect: PropTypes.number.isRequired,
  scorePercentage: PropTypes.number.isRequired,
  onRowChange: PropTypes.func.isRequired,
  deletable: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  maxAnswers: PropTypes.number.isRequired
};
