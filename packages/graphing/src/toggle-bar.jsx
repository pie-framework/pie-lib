import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';

const buttonStyles = theme => ({
  root: {},
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
    backgroundColor: 'rgb(255,255,255,0.2)'
  }
});

export const MiniButton = withStyles(buttonStyles)(props => {
  const { disabled, classes, className, selected, value, onClick } = props;
  return (
    <Button
      size="small"
      disabled={disabled}
      color={selected ? 'secondary' : 'default'}
      className={cn(selected && classes.selected, className)}
      classes={{
        root: cn(classes.root),
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
const styles = theme => ({
  class: {},
  button: {
    marginRight: -1 //theme.spacing.unit
  }
});

export default withStyles(styles)(ToggleBar);
