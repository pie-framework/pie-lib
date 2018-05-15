import React from 'react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export const PlaceHolder = ({
  children,
  classes,
  className,
  isOver,
  type,
  grid,
  disabled
}) => {
  const names = classNames(
    classes.placeholder,
    disabled && classes.disabled,
    isOver && classes.over,
    classes[type],
    className
  );

  const style = {};

  if (grid && grid.columns) {
    style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
  }
  if (grid && grid.rows) {
    style.gridTemplateRows = `repeat(${grid.rows}, 1fr)`;
  }
  return (
    <div style={style} className={names}>
      {children}
    </div>
  );
};

PlaceHolder.propTypes = {
  classes: PropTypes.object.isRequired,
  grid: PropTypes.shape({
    columns: PropTypes.number,
    rows: PropTypes.number
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  className: PropTypes.string,
  isOver: PropTypes.bool,
  index: PropTypes.number,
  type: PropTypes.string,
  disabled: PropTypes.bool
};

const styles = theme => ({
  placeholder: {
    width: '100%',
    height: '100%',
    background: '#f8f6f6',
    boxShadow: 'inset 3px 4px 2px 0 rgba(0,0,0,0.08)',
    border: '1px solid #c2c2c2',
    transition: 'background-color 200ms linear',
    boxSizing: 'border-box',
    display: 'grid',
    gridRowGap: `${theme.spacing.unit}px`,
    gridColumnGap: `${theme.spacing.unit}px`,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.unit * 0.5
  },
  disabled: {
    boxShadow: 'none',
    background: 'white'
  },
  over: {
    backgroundColor: '#ddd'
  },
  number: {
    width: '100%',
    fontSize: '30px',
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)'
  }
});

export default withStyles(styles)(PlaceHolder);
