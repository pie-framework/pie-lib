import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { color } from '@pie-lib/render-ui';

export class UndoRedo extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };
  static defaultProps = {};
  render() {
    const { classes, className, onUndo, onRedo, onReset } = this.props;
    return (
      <div className={classNames(className)}>
        <Button classes={{ root: classes.button }} onClick={onUndo}>
          Undo
        </Button>
        <Button classes={{ root: classes.button }} onClick={onRedo}>
          Redo
        </Button>
        <Button classes={{ root: classes.button }} onClick={onReset}>
          Reset
        </Button>
      </div>
    );
  }
}

const styles = (theme) => ({
  button: {
    color: color.text(),
    backgroundColor: color.background(),
    marginBottom: theme.spacing.unit / 2,
    '&:not(:last-of-type)': {
      marginRight: theme.spacing.unit / 2,
    },
    '&:hover': {
      backgroundColor: color.primary(),
    },
  },
});

export default withStyles(styles)(UndoRedo);
