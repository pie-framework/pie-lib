import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import * as mq from './mq';
import { baseSet } from './keys';
import KeyPad from './keypad';
import debug from 'debug';

const log = debug('pie-lib:math-input');

const grey = 'rgba(0, 0, 0, 0.23)';

const MathInputContainer = styled('div')(({ theme, focused }) => ({
  borderRadius: '4px',
  border: `solid 1px ${focused ? theme.palette.primary.main : grey}`,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  transition: 'border 200ms linear',
}));

const PadContainer = styled('div')({
  width: '100%',
  display: 'flex',
});

const StyledMqInput = styled(mq.Input)(({ theme }) => ({
  width: '100%',
  border: `solid 0px ${theme.palette.primary.light}`,
  transition: 'border 200ms linear',
  padding: theme.spacing(1),
  '&.mq-focused': {
    outline: 'none',
    boxShadow: 'none',
    border: `solid 0px ${theme.palette.primary.dark}`,
  },
}));

export class MathInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    keyset: PropTypes.array,
    displayMode: PropTypes.oneOf(['block', 'block-on-focus']),
    latex: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    keyset: [],
    displayMode: 'block',
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  keypadPress = (key) => {
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

  changeLatex = (l) => {
    const { onChange } = this.props;

    if (onChange && l !== this.props.latex) {
      log('[changeLatex]', l, this.props.latex);
      onChange(l);
    }
  };

  render() {
    const { className, keyset, latex } = this.props;
    const { focused } = this.state;

    const showKeypad = true; // TODO: add support for different displayModes - displayMode === 'block' || focused;

    return (
      <MathInputContainer className={className} focused={focused}>
        <StyledMqInput
          innerRef={(r) => (this.input = r)}
          onFocus={this.inputFocus}
          onBlur={this.inputBlur}
          latex={latex}
          onChange={this.changeLatex}
        />
        {showKeypad && (
          <PadContainer>
            <KeyPad baseSet={baseSet} additionalKeys={keyset} onPress={this.keypadPress} />
          </PadContainer>
        )}
      </MathInputContainer>
    );
  }
}

export default MathInput;
