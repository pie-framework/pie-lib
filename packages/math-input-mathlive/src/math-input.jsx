import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import debug from 'debug';

import * as mf from './mf';
import { baseSet } from './keys';
import KeyPad from './keypad';
import { keyToAction } from './latex-bridge';

const log = debug('pie-lib:math-input-mathlive');

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

const StyledInput = styled(mf.Input)(({ theme }) => ({
  width: '100%',
  transition: 'border 200ms linear',
  padding: theme.spacing(1),
  '& math-field:focus-within': {
    outline: 'none',
    boxShadow: 'none',
  },
}));

/**
 * MathLive-backed equivalent of @pie-lib/math-input's `MathInput`.
 * Same props (`keyset`, `latex`, `onChange`, `displayMode`).
 */
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
    this.state = { focused: false };
  }

  keypadPress = (key) => {
    log('[keypadPress] key:', key);

    if (!this.input) {
      return;
    }

    const action = keyToAction(key);

    if (!action) {
      return;
    }

    if (action.type === 'command') {
      this.input.keystroke(action.value);
    } else {
      this.input.write(action.value);
    }
  };

  inputFocus = () => this.setState({ focused: true });

  inputBlur = () => this.setState({ focused: false });

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

    return (
      <MathInputContainer className={className} focused={focused}>
        <StyledInput
          innerRef={(r) => (this.input = r)}
          onFocus={this.inputFocus}
          onBlur={this.inputBlur}
          latex={latex}
          onChange={this.changeLatex}
        />
        <PadContainer>
          <KeyPad baseSet={baseSet} additionalKeys={keyset} onPress={this.keypadPress} />
        </PadContainer>
      </MathInputContainer>
    );
  }
}

export default MathInput;
