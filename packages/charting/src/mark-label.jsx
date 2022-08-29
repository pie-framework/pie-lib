import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { types } from '@pie-lib/plot';
import { correct, incorrect, disabled } from './common/styles';
import { color } from '@pie-lib/render-ui';

const styles = theme => ({
  input: {
    float: 'right',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: 'none',
    color: color.primaryDark(),
    '&.correct': correct('color'),
    '&.incorrect': incorrect('color'),
    '&.disabled': { ...disabled('color'), backgroundColor: 'transparent !important' }
  }
});

export const MarkLabel = props => {
  // eslint-disable-next-line no-unused-vars
  const [input, setInput] = useState(null);
  const _ref = useCallback(node => setInput(node), null);

  const {
    mark,
    classes,
    disabled,
    inputRef: externalInputRef,
    barWidth,
    rotate,
    correctness,
    autoFocus
  } = props;
  const [label, setLabel] = useState(mark.label);
  const onChange = e => setLabel(e.target.value);
  const onChangeProp = e => props.onChange(e.target.value);
  let extraStyle = {};

  if (rotate) {
    extraStyle = {
      width: 'unset',
      textAlign: 'left'
    };
  }

  // useState only sets the value once, to synch props to state need useEffect
  useEffect(() => {
    setLabel(mark.label);
  }, [mark.label]);

  return (
    <AutosizeInput
      autoFocus={autoFocus}
      inputRef={r => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabled}
      inputClassName={cn(classes.input, correctness && correctness.label, disabled && 'disabled')}
      inputStyle={{
        minWidth: barWidth,
        textAlign: 'center',
        background: 'transparent',
        boxSizing: 'border-box',
        paddingLeft: 0,
        paddingRight: 0,
        ...extraStyle
      }}
      value={label}
      style={{
        position: 'absolute',
        pointerEvents: 'auto',
        top: 0,
        left: 0,
        minWidth: barWidth,
        transformOrigin: 'left',
        transform: `rotate(${rotate}deg)`
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
    label: PropTypes.string
  })
};

export default withStyles(styles)(MarkLabel);
