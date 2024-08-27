import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';
import { color } from '../render-ui';

export const PlaceHolder = (props) => {
  const { children, classes, className, isOver, type, grid, disabled, choiceBoard, isCategorize } = props;
  const names = classNames(
    classes.placeholder,
    disabled && classes.disabled,
    isOver && classes.over,
    classes[type],
    className,
  );

  const style = {};

  if (grid && grid.columns) {
    style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
  }

  if (grid && grid.rows) {
    const repeatValue = grid.rowsRepeatValue || '1fr';

    style.gridTemplateRows = `repeat(${grid.rows}, ${repeatValue})`;
  }

  // The "type" is only sent through placement-ordering / placeholder
  // It can be "choice" or "target"
  // We apply a different style for the "choice" type
  // For any other type, use a dashed black border and a white fill
  if (type === 'choice') {
    style.border = `1px solid ${color.borderLight()}`;
    style.background = color.backgroundDark();
  }

  const boardStyle = isCategorize ? classes.categorizeBoard : classes.board;

  return (
    <div style={style} className={choiceBoard ? boardStyle : names}>
      {children}
    </div>
  );
};

PlaceHolder.propTypes = {
  classes: PropTypes.object.isRequired,
  choiceBoard: PropTypes.bool,
  grid: PropTypes.shape({
    columns: PropTypes.number,
    rows: PropTypes.number,
    // if a different value then 1fr is wanted
    rowsRepeatValue: PropTypes.string,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  isOver: PropTypes.bool,
  index: PropTypes.number,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isCategorize: PropTypes.bool,
};

const styles = (theme) => ({
  placeholder: {
    width: '100%',
    height: '100%',
    background: color.white(),
    transition: 'background-color 200ms linear, border-color 200ms linear',
    boxSizing: 'border-box',
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`,
    padding: theme.spacing.unit * 1,
    border: `2px dashed ${color.black()}`,
  },
  disabled: {
    boxShadow: 'none',
    background: theme.palette.background.paper,
  },
  over: {
    border: `1px solid ${grey[500]}`,
    backgroundColor: `${grey[300]}`,
  },
  board: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: '100px',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'none',
    backgroundColor: color.backgroundDark(),
  },
  categorizeBoard: {
    padding: theme.spacing.unit / 2,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: '100px',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'none',
    backgroundColor: color.backgroundDark(),
  },
});

export default withStyles(styles)(PlaceHolder);
