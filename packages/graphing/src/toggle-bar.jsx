import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

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
      <div className={classNames(classes.class, className)}>
        {(options || []).map(o => {
          const isSelected = o === selected;
          return (
            <Button
              size="small"
              disabled={isSelected}
              className={classNames(
                classes.button,
                isSelected && classes.selected
              )}
              classes={{
                disabled: classes.disabled
              }}
              value={o}
              key={o}
              variant="outlined"
              onClick={this.select}
            >
              {o}
            </Button>
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
  },
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

export default withStyles(styles)(ToggleBar);
