import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { GraphPropsType } from '@pie-lib/plot/lib/types';
import { correct, incorrect, disabled } from './common/styles';

const styles = theme => ({
  input: {
    float: 'right',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: 'none',
    color: theme.palette.primary.dark,
    '&.correct': correct('color'),
    '&.incorrect': incorrect('color'),
    '&.disabled': disabled('color')
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
    correctness
  } = props;
  const [label, setLabel] = useState(mark.label);
  const onChange = e => setLabel(e.target.value);
  const onChangeProp = e => props.onChange(e.target.value);

  // useState only sets the value once, to synch props to state need useEffect
  useEffect(() => {
    setLabel(mark.label);
  }, [mark.label]);

  return (
    <AutosizeInput
      inputRef={r => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabled}
      inputClassName={cn(classes.input, correctness && correctness.label, disabled && 'disabled')}
      inputStyle={{
        minWidth: barWidth,
        textAlign: 'center',
        background: 'transparent'
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
  graphProps: GraphPropsType,
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
