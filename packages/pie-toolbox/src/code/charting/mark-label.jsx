import React, { useState, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { types } from '../plot';
import { correct, incorrect, disabled } from './common/styles';
import { color } from '../render-ui';
import { renderMath } from '../math-rendering';

const styles = (theme) => ({
  input: {
    float: 'right',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: 'none',
    color: color.primaryDark(),
    '&.correct': correct('color'),
    '&.incorrect': incorrect('color'),
    '&.disabled': {
      backgroundColor: 'transparent !important',
    },
    '&.error': { border: `2px solid ${theme.palette.error.main}` },
  },
  mathInput: {
    pointerEvents: 'auto',
    textAlign: 'center',
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
    color: color.primaryDark(),
  },
  disabled: {
    ...disabled('color'),
    backgroundColor: 'transparent !important',
  },
  error: {
    border: `2px solid ${theme.palette.error.main}`,
  },
  correct: {
    ...correct('color'),
  },
  incorrect: {
    ...incorrect('color'),
  },
});

function isFractionFormat(label) {
  const trimmedLabel = label?.trim() || '';
  const fracRegex = new RegExp(/^[1-9]*[0-9]*\s?[1-9][0-9]*\/[1-9][0-9]*$/);
  return fracRegex.test(trimmedLabel);
}

function getLabelMathFormat(label) {
  const trimmedLabel = label?.trim() || '';
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
  let root = useRef(null);

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

  useEffect(() => {
    renderMath(root);
  }, []);

  return isMathRendering() ? (
    <div
      ref={(r) => (root = r)}
      dangerouslySetInnerHTML={{ __html: getLabelMathFormat(label) }}
      className={classNames(classes.mathInput, {
        [classes.disabled]: disabled,
        [classes.error]: error,
        [classes.correct]: correctness && correctness.label === 'correct',
        [classes.incorrect]: correctness && correctness.label === 'incorrect',
      })}
      onClick={() => setIsEditing(true)}
      style={{ minWidth: barWidth, position: 'fixed' }}
    ></div>
  ) : (
    <AutosizeInput
      inputRef={(r) => {
        _ref(r);
        externalInputRef(r);
      }}
      autoFocus={isEditing || autoFocus}
      disabled={disabled}
      inputClassName={classNames(
        classes.input,
        correctness && correctness.label,
        disabled && 'disabled',
        error && 'error',
      )}
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
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.any,
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
