import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

export class Controls extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClear: PropTypes.func.isRequired,
    onWords: PropTypes.func.isRequired,
    onSentences: PropTypes.func.isRequired
  };

  static defaultProps = {};

  render() {
    const { classes, onClear, onWords, onSentences } = this.props;
    return (
      <div>
        <Button
          onClick={onWords}
          className={classes.button}
          size="small"
          color="primary"
          variant={'raised'}
        >
          Words
        </Button>
        <Button
          onClick={onSentences}
          className={classes.button}
          size="small"
          color="primary"
          variant={'raised'}
        >
          Sentences
        </Button>
        <Button
          className={classes.button}
          size="small"
          color="secondary"
          variant={'raised'}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    );
  }
}
export default withStyles(theme => ({
  button: {
    marginRight: theme.spacing.unit
  }
}))(Controls);
