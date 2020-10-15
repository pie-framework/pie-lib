import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';
import { color } from '@pie-lib/render-ui';

const buttonStyles = () => ({
  root: {
    color: color.text(),
    '&:hover': {
      backgroundColor: color.primary()
    }
  },
  selected: {
    backgroundColor: color.background(),
    border: `1px solid ${color.secondary()}`
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

export class ToggleBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    selectedToolType: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
  };

  static defaultProps = {};

  select = e => this.props.onChange(e.target.textContent);

  render() {
    const { classes, className, disabled, options, selectedToolType } = this.props;
    return (
      <div className={cn(className)}>
        {(options || []).map(option => {
          const isSelected = option === selectedToolType;

          return (
            <MiniButton
              key={option}
              className={cn(classes.button, isSelected && classes.selected)}
              disabled={disabled}
              disableRipple={true}
              onClick={this.select}
              value={option}
              selected={isSelected}
            />
          );
        })}
      </div>
    );
  }
}

const styles = theme => ({
  button: {
    marginRight: theme.spacing.unit / 2,
    color: color.text(),
    backgroundColor: color.background()
  }
});

export default withStyles(styles)(ToggleBar);
