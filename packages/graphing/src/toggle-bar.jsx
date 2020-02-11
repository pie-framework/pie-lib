import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';

const buttonStyles = theme => ({
  root: {
    '&:hover': {
      backgroundColor: 'rgb(255,255,255,0.5)'
    }
  },
  selected: {
    backgroundColor: 'white',
    '& span': {
      color: theme.palette.primary.dark
    }
  },
  notSelected: {
    '& span': {
      color: theme.palette.primary.main
    },
    backgroundColor: 'white'
  },
  disabled: {
    '& span': {
      color: theme.palette.primary.main
    },
    backgroundColor: 'rgb(255,255,255,0.8)'
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
      classes={{
        disabled: cn(disabled && classes.disabled)
      }}
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

export class ToggleBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    selected: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {};

  select = e => {
    const { onChange } = this.props;
    onChange(e.target.textContent);
  };

  render() {
    const { classes, className, disabled, options, selected } = this.props;
    return (
      <div className={cn(classes.class, className)}>
        {(options || []).map(o => {
          const isSelected = o === selected;

          return (
            <MiniButton
              disableRipple={true}
              key={o}
              value={o}
              disabled={disabled}
              selected={isSelected}
              className={cn(classes.button, isSelected && classes.selected)}
              onClick={this.select}
            />
          );
        })}
      </div>
    );
  }
}
const styles = () => ({
  class: {},
  button: {
    marginRight: -1 //theme.spacing.unit
  }
});

export default withStyles(styles)(ToggleBar);
