import React, { useState, useCallback, useEffect, useRef } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { correct, incorrect, disabled } from './common/styles';
import { color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';

const styles = (theme) => ({
  input: {
    float: 'right',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: 'none',
    color: color.primaryDark(),
    '&.error': { border: `2px solid ${theme.palette.error.main}` },
    '&.correct': correct('color'),
    '&.incorrect': incorrect('color'),
    '&.disabled': {
      ...disabled('color'),
      backgroundColor: 'transparent !important',
    },
  },
});

function isFractionFormat(label) {
  const trimmedLabel = label?.trimStart().trimEnd() || '';
  const stringRegex = /[a-zA-Z]/;
  // Check if label contain at least one letter
  if (stringRegex.test(label)) {
    return false;
  }
  const fracRegex = new RegExp(/[1-9][0-9]*\/[1-9][0-9]*$/g);
  return !!trimmedLabel?.match(fracRegex) || false;
}

function getLabelMathFormat(label) {
  const trimmedLabel = label?.trimStart().trimEnd() || '';
  let fraction;
  let mixedNr = '';
  let improperFraction = trimmedLabel.split(' ');
  if (improperFraction[1] && improperFraction[1].includes('/')) {
    fraction = improperFraction[1].split('/') || '';
  } else {
    fraction = trimmedLabel?.split('/') || '';
  }

  let formattedLLabel;
  if (isFractionFormat(label)) {
    if (improperFraction[0] && improperFraction[1]) {
      mixedNr = improperFraction[0];
    }
    formattedLLabel = `\\(${mixedNr}\\frac{${fraction[0]}}{${fraction[1]}}\\)`;
    return formattedLLabel;
  }
  return undefined;
}

export const MarkLabel = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => setInput(node), null);

  const {
    mark,
    classes,
    disabled,
    inputRef: externalInputRef,
    barWidth,
    rotate,
    correctness,
    autoFocus,
    error,
  } = props;

  const [label, setLabel] = useState(mark.label);
  const [mathLabel, setMathLabel] = useState(getLabelMathFormat(mark.label));
  const [isEditing, setIsEditing] = useState(false);
  // let root = useRef(null);
  const onChange = (e) => {
    setLabel(e.target.value);
  };

  const isMathRendering = () => {
    return isEditing === false && mathLabel !== undefined;
  };

  const onChangeProp = (e) => {
    setMathLabel(getLabelMathFormat(mark.label));
    setIsEditing(false);
    props.onChange(e.target.value);
  };
  let extraStyle = {};

  if (rotate) {
    extraStyle = {
      width: 'unset',
      textAlign: 'left',
    };
  }

  // useState only sets the value once, to synch props to state need useEffect
  useEffect(() => {
    setLabel(mark.label);
  }, [mark.label]);

  return isMathRendering() ? (
    <div
      dangerouslySetInnerHTML={{ __html: getLabelMathFormat(label) }}
      onClick={() => setIsEditing(true)}
      style={{
        pointerEvents: 'auto',
        textAlign: 'center',
        minWidth: barWidth,
        fontSize: '14px',
        fontFamily: 'Roboto',
        color: '#283593',
      }}
    ></div>
  ) : (
    <AutosizeInput
      inputRef={(r) => {
        _ref(r);
        externalInputRef(r);
      }}
      autoFocus={isEditing || autoFocus}
      disabled={disabled}
      inputClassName={cn(classes.input, correctness && correctness.label, disabled && 'disabled', error && 'error')}
      inputStyle={{
        minWidth: barWidth,
        textAlign: 'center',
        background: 'transparent',
        boxSizing: 'border-box',
        paddingLeft: 0,
        paddingRight: 0,
        ...extraStyle,
      }}
      value={label}
      style={{
        position: 'fixed',
        pointerEvents: 'auto',
        top: 0,
        left: 0,
        minWidth: barWidth,
        transformOrigin: 'left',
        transform: `rotate(${rotate}deg)`,
      }}
      onChange={onChange}
      onBlur={onChangeProp}
    />
  );
};

MarkLabel.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  graphProps: types.GraphPropsType,
  classes: PropTypes.object,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
  barWidth: PropTypes.number,
  rotate: PropTypes.number,
  correctness: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
};

export default withStyles(styles)(MarkLabel);
