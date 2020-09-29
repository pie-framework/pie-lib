import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { color } from '@pie-lib/render-ui';

import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';

const buttonStyles = () => ({
  root: {
    '&:hover': {
      backgroundColor: 'rgb(255,255,255,0.5)'
    }
  },
  selected: {
    backgroundColor: color.background(),
    '& span': {
      color: color.primaryDark()
    }
  },
  notSelected: {
    '& span': {
      color: color.primary()
    },
    backgroundColor: color.background()
  },
  disabled: {
    '& span': {
      color: color.primary()
    },
    backgroundColor: color.disabled()
  }
});

export const MiniButton = withStyles(buttonStyles)(props => {
  const { disabled, classes, className, selected, value, onClick } = props;
  return (
    <Button
      size="small"
      disabled={disabled}
      color={selected ? 'secondary' : 'default'}
      className={cn(classes.root, selected && classes.selected, className)}
      classes={{ disabled: cn(disabled && classes.disabled) }}
      value={value}
      key={value}
      variant="outlined"
      onClick={onClick}
    >
      {value}
    </Button>
  );
});
MiniButton.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClassName: PropTypes.string,
  selected: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func
};

export class ToolMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    addCategory: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {};

  render() {
    const { className, disabled, addCategory } = this.props;

    return (
      <div className={classNames(className)}>
        {!disabled && <MiniButton value={'Add Category'} onClick={addCategory} />}
      </div>
    );
  }
}

export default ToolMenu;
