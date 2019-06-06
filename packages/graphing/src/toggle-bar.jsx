import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Button from '@material-ui/core/Button';

const buttonStyles = theme => ({
  selected: {
    backgroundColor: 'white'
  },
  disabled: {
    '& span': {
      color: theme.palette.primary.dark
    },
    backgroundColor: 'white'
  }
});
export const MiniButton = withStyles(buttonStyles)(props => {
  const { disabled, classes, className, disabledClassName, selected, value, onClick } = props;
  return (
    <Button
      size="small"
      disabled={disabled}
      color={selected ? 'secondary' : 'default'}
      className={cn(selected && classes.selected, className)}
      classes={{
        disabled: cn(classes.disabled, disabledClassName)
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
    const { classes, className, options, selected } = this.props;
    return (
      <div className={cn(classes.class, className)}>
        {(options || []).map(o => {
          const isSelected = o === selected;
          return (
            <MiniButton
              key={o}
              value={o}
              disabled={isSelected}
              className={cn(classes.button, isSelected && classes.selected)}
              disabledClassName={classes.disabled}
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
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(ToggleBar);
