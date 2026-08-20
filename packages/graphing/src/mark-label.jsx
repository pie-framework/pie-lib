import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import SvgIcon from './label-svg-icon';

const DEBOUNCE_DELAY = 500;

const StyledInputCorrect = styled('div')(({ theme }) => ({
  float: 'right',
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  fontSize: '10px',
  backgroundColor: color.defaults.WHITE,
  color: color.defaults.CORRECT_WITH_ICON,
  border: `solid 1px ${color.defaults.CORRECT_WITH_ICON}`,
}));

const StyledInputIncorrect = styled('div')(({ theme }) => ({
  float: 'right',
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  fontSize: '10px',
  backgroundColor: color.defaults.WHITE,
  color: color.defaults.INCORRECT_WITH_ICON,
  border: `solid 1px ${color.defaults.INCORRECT_WITH_ICON}`,
}));

const StyledInputMissing = styled('div')(({ theme }) => ({
  float: 'right',
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  fontSize: '10px',
  backgroundColor: color.defaults.WHITE,
  color: color.defaults.MISSING_WITH_ICON,
  border: `solid 1px ${color.defaults.MISSING_WITH_ICON}`,
  fontWeight: 'bold',
}));

const StyledIncorrect = styled('div')(() => ({
  float: 'right',
  padding: 0,
  borderRadius: '4px',
  fontSize: '10px',
  backgroundColor: color.defaults.WHITE,
  color: color.defaults.INCORRECT_WITH_ICON,
  fontWeight: 'bold',
}));

const getInputStyles = (theme, disabled, markDisabled) => ({
  float: 'right',
  padding: theme.spacing(0.5),
  fontFamily: theme.typography.fontFamily,
  fontSize: '10px',
  border: disabled
    ? `solid 1px ${color.defaults.PRIMARY_DARK}`
    : markDisabled
      ? `solid 1px ${color.disabled()}`
      : `solid 1px ${color.defaults.SECONDARY}`,
  borderRadius: '3px',
  color: markDisabled ? color.disabled() : color.defaults.PRIMARY_DARK,
  backgroundColor: color.defaults.WHITE,
  WebkitOpacity: disabled ? '1' : undefined,
  WebkitTextFillColor: markDisabled ? color.disabled() : undefined,
});

const getStudentInputStyles = () => ({
  padding: '0',
  border: 'none',
  color: 'inherit',
  fontWeight: 'bold',
});

export const position = (graphProps, mark, rect = { width: 0, height: 0 }) => {
  const { scale, domain, range } = graphProps;
  const shift = 5;

  const rightEdge = scale.x(mark.x) + rect.width + shift;
  const bottomEdge = scale.y(mark.y) + rect.height + shift;

  const h = rightEdge >= scale.x(domain.max) ? 'left' : 'right';
  const v = bottomEdge >= scale.y(range.min) ? 'top' : 'bottom';

  return `${v}-${h}`;
};

export const coordinates = (graphProps, mark, rect = { width: 0, height: 0 }, position) => {
  const { scale } = graphProps;
  const shift = 5;

  switch (position) {
    case 'bottom-right':
      return { left: scale.x(mark.x) + shift, top: scale.y(mark.y) + shift };
    case 'bottom-left':
      return { left: scale.x(mark.x) - shift - rect.width, top: scale.y(mark.y) + shift };
    case 'top-left':
      return { left: scale.x(mark.x) - shift - rect.width, top: scale.y(mark.y) - shift - rect.height };
    case 'top-right':
      return { left: scale.x(mark.x) + shift, top: scale.y(mark.y) - shift - rect.height };
    default:
      return {};
  }
};

const LabelInput = ({ _ref, externalInputRef, label, disabled, inputStyle, onChange, onBlur }) => (
  <AutosizeInput
    inputRef={(r) => {
      _ref(r);
      externalInputRef(r);
    }}
    disabled={disabled}
    inputStyle={inputStyle}
    value={label}
    onChange={onChange}
    onBlur={onBlur}
  />
);

LabelInput.propTypes = {
  _ref: PropTypes.func,
  externalInputRef: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  inputStyle: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export const MarkLabel = (props) => {
  // the node is kept in a ref as well as in the state: the state is needed to reposition the label
  // once it has a size, the ref is what the focus is asserted on - it is never a render behind
  const inputNode = useRef(null);
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => {
    inputNode.current = node;
    setInput(node);
  }, []);
  const theme = useTheme();

  const { mark, graphProps, disabled, autoFocus, inputRef: externalInputRef } = props;

  const [label, setLabel] = useState(mark.label);
  const { correctness, correctnesslabel, correctlabel } = mark;

  const isFocused = () =>
    !!inputNode.current && typeof document !== 'undefined' && document.activeElement === inputNode.current;

  // A label that has just been added is empty and its input is enabled - label mode has to be on
  // for that to happen and it always starts off, so a mark that was loaded with an empty label
  // cannot grab the focus. This is read from the mark rather than taken from the autoFocus prop
  // because the tool that asked for the label can be remounted by the marks coming back from the
  // host (async model save) before the input ever renders, and its autoFocus goes with it.
  const isNewLabel = useRef(mark.label === '' && !disabled && !mark.disabled);

  const onChange = (e) => setLabel(e.target.value);

  const handleBlur = useCallback(() => {
    isNewLabel.current = false;

    if (label === '') {
      props.onChange('');
    }

    // lets the tool know that this label is not being edited anymore, so it stops auto focusing it
    if (props.onBlur) {
      props.onBlur();
    }
  }, [label, props.onChange, props.onBlur]);

  const debouncedLabel = useDebounce(label, DEBOUNCE_DELAY);

  // useState only sets the value once, to synch props to state need useEffect.
  // While this input has the focus we keep what the user typed: the mark can come back from an
  // (async) model save with an older label and that would overwrite the characters typed meanwhile.
  useEffect(() => {
    if (isFocused()) {
      return;
    }

    setLabel(mark.label);
  }, [mark.label]);

  // pick up the change to debouncedLabel and save it
  useEffect(() => {
    if (typeof debouncedLabel === 'string' && debouncedLabel !== mark.label) {
      props.onChange(debouncedLabel);
    }
  }, [debouncedLabel]);

  // A label that has just been added has to be focused so that it can be typed into right away.
  // This runs after every render on purpose - there is no reliable single moment to focus at:
  // the input shows up whenever the mark comes back from the (async) model save, and a remount
  // of the input (same save, replaced node) drops the focus without this component being told.
  // Asserting the focus on every render is what makes it stick; it is a no-op once the input has
  // it, so the caret the user placed is left alone.
  useEffect(() => {
    const node = inputNode.current;

    // node.disabled, not the disabled prop: a disabled input silently ignores focus()
    if ((!autoFocus && !isNewLabel.current) || !node || node.disabled || isFocused()) {
      return;
    }

    node.focus();

    // a new label is focused once, so it cannot fight over the focus with another one
    if (isFocused()) {
      isNewLabel.current = false;
    }

    // keep the caret at the end, otherwise typing continues in front of the existing label
    const caret = (node.value || '').length;

    if (node.setSelectionRange) {
      node.setSelectionRange(caret, caret);
    }
  });

  const rect = input ? input.getBoundingClientRect() : { width: 0, height: 0 };
  const pos = position(graphProps, mark, rect);
  const leftTop = coordinates(graphProps, mark, rect, pos);

  const style = {
    position: 'fixed',
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    ...leftTop,
  };

  const secondLabelStyle = {
    ...style,
    top: leftTop.top + 25,
  };

  const disabledInput = disabled || mark.disabled;

  const renderInput = (inputStyle, labelValue) => (
    <LabelInput
      _ref={_ref}
      externalInputRef={externalInputRef}
      label={labelValue}
      disabled={disabledInput}
      inputStyle={inputStyle}
      onChange={onChange}
      onBlur={handleBlur}
    />
  );

  const studentInputStyle = getStudentInputStyles();

  if (correctness === 'correct' && correctnesslabel === 'correct' && correctlabel) {
    return (
      <StyledInputCorrect style={style}>
        <SvgIcon type="correct" />
        {renderInput(studentInputStyle, correctlabel)}
      </StyledInputCorrect>
    );
  }

  if (correctness === 'correct' && correctnesslabel === 'correct' && !correctlabel) {
    return null;
  }

  if (correctness === 'correct' && correctnesslabel === 'incorrect') {
    return (
      <>
        <StyledInputIncorrect style={style}>
          <SvgIcon type="incorrect" />
          {label === '' ? (
            <SvgIcon type="empty" style={{ marginLeft: '3px' }} />
          ) : (
            renderInput(studentInputStyle, label)
          )}
        </StyledInputIncorrect>
        <StyledInputMissing style={secondLabelStyle}>{renderInput(studentInputStyle, correctlabel)}</StyledInputMissing>
      </>
    );
  }

  if (correctness === 'missing') {
    return <StyledInputMissing style={style}>{renderInput(studentInputStyle, label)}</StyledInputMissing>;
  }

  if (correctness === 'incorrect') {
    return <StyledIncorrect style={style}>{renderInput(studentInputStyle, label)}</StyledIncorrect>;
  }

  return <div style={style}>{renderInput(getInputStyles(theme, disabled, mark.disabled), label)}</div>;
};

MarkLabel.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  graphProps: types.GraphPropsType,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
};

export default MarkLabel;
