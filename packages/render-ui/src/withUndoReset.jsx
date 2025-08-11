import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Restore from '@material-ui/icons/Restore';
import Undo from '@material-ui/icons/Undo';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  resetUndoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: 'gray',
    marginRight: theme.spacing.unit,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
});

/**
 * HOC that adds undo and reset functionality for session values
 */
const withUndoReset = (WrappedComponent) => {
  class WithUndoReset extends React.Component {
    static propTypes = {
      classes: PropTypes.object,
      session: PropTypes.object,
      onSessionChange: PropTypes.func,
    };

    constructor(props) {
      super(props);

      this.state = {
        sessionInitialValues: JSON.parse(JSON.stringify(props.session)),
        session: props.session,
        changes: [],
      };
    }

    onSessionChange = (session) => {
      this.setState(
        (state) => ({ session, changes: [...state.changes, session] }),
        () => this.props.onSessionChange(session),
      );
    };

    onUndo = () => {
      this.setState(
        (state) => {
          const newChanges = [...state.changes];

          newChanges.pop();

          return {
            changes: newChanges,
            session: newChanges.length ? newChanges[newChanges.length - 1] : state.sessionInitialValues,
          };
        },
        () => this.props.onSessionChange(this.state.session),
      );
    };

    onReset = () => {
      this.setState(
        (state) => ({ session: state.sessionInitialValues, changes: [] }),
        () => this.props.onSessionChange(this.state.sessionInitialValues),
      );
    };

    render() {
      const { classes, ...rest } = this.props;
      const { changes, session } = this.state;

      return (
        <div className={classes.wrapper}>
          <div className={classes.resetUndoContainer}>
            <Button
              className={classes.buttonContainer}
              color="primary"
              disabled={changes.length === 0}
              onClick={this.onUndo}
            >
              <Undo className={classes.icon} /> Undo
            </Button>
            <Button
              className={classes.buttonContainer}
              color="primary"
              disabled={changes.length === 0}
              onClick={this.onReset}
            >
              <Restore className={classes.icon} /> Start Over
            </Button>
          </div>
          <WrappedComponent {...rest} session={session} onSessionChange={this.onSessionChange} />
        </div>
      );
    }
  }

  return withStyles(styles)(WithUndoReset);
};

export default withUndoReset;
