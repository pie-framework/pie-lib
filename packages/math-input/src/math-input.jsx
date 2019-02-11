import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import * as mq from './mq';
import { baseSet } from './keys';
import KeyPad from './keypad';
import debug from 'debug';

const log = debug('pie-lib:math-input');

export class MathInput extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    keyset: PropTypes.array,
    displayMode: PropTypes.oneOf(['block', 'block-on-focus']),
    latex: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    keyset: [],
    displayMode: 'block'
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
  }

  keypadPress = key => {
    log('[keypadPress] key:', key);

    if (!this.input) {
      return;
    }

    if (key.latex && !key.command) {
      this.input.write(key.latex);
    } else if (key.write) {
      this.input.write(key.write);
    } else if (key.command) {
      this.input.command(key.command);
    } else if (key.keystroke) {
      this.input.keystroke(key.keystroke);
    }
  };

  inputFocus = () => {
    this.setState({ focused: true });
  };

  inputBlur = () => {
    this.setState({ focused: false });
  };

  changeLatex = l => {
    const { onChange } = this.props;

    if (onChange && l !== this.props.latex) {
      log('[changeLatex]', l, this.props.latex);
      onChange(l);
    }
  };

  render() {
    const { classes, className, keyset, latex } = this.props;
    const { focused } = this.state;

    const showKeypad = true; // TODO: add support for different displayModes - displayMode === 'block' || focused;

    return (
      <div
        className={classNames(
          classes.mathInput,
          className,
          focused && classes.focused
        )}
      >
        <mq.Input
          className={classes.mqInput}
          innerRef={r => (this.input = r)}
          onFocus={this.inputFocus}
          onBlur={this.inputBlur}
          latex={latex}
          onChange={this.changeLatex}
        />
        {showKeypad && (
          <div className={classes.pad}>
            <KeyPad
              baseSet={baseSet}
              additionalKeys={keyset}
              onPress={this.keypadPress}
            />
          </div>
        )}
      </div>
    );
  }
}

const grey = 'rgba(0, 0, 0, 0.23)';
const styles = theme => ({
  formGroup: {
    display: 'flex',
    textAlign: 'right',
    float: 'right'
  },
  pad: {
    width: '100%',
    display: 'flex'
  },
  mathInput: {
    borderRadius: '4px',
    border: `solid 1px ${grey}`,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    transition: 'border 200ms linear'
  },
  focused: {
    border: `solid 1px ${theme.palette.primary.main}`
  },
  mqInput: {
    width: '100%',
    border: `solid 0px ${theme.palette.primary.light}`,
    transition: 'border 200ms linear',
    padding: theme.spacing.unit,
    '&.mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `solid 0px ${theme.palette.primary.dark}`
    }
  }
});
export default withStyles(styles)(MathInput);
