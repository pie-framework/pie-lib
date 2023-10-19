import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { color } from '../render-ui';
import Translator from '@pie-lib/translator';

const { translator } = Translator;

export class UndoRedo extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    language: PropTypes.string,
  };
  static defaultProps = {};

  render() {
    const { classes, className, onUndo, onRedo, onReset, language } = this.props;
    return (
      <div className={classNames(className)}>
        <Button classes={{ root: classes.button }} onClick={() => onUndo(true)}>
          {translator.t('common:undo', { lng: language })}
        </Button>
        <Button classes={{ root: classes.button }} onClick={() => onRedo(true)}>
          {translator.t('graphing.redo', { lng: language })}
        </Button>
        <Button classes={{ root: classes.button }} onClick={() => onReset()}>
          {translator.t('graphing.reset', { lng: language })}
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
  },
});

export default withStyles(styles)(UndoRedo);
