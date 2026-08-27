import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import SvgIcon from './label-svg-icon';

const DEBOUNCE_DELAY = 500;
// A new label insists on the focus and the caret for this long, and again on each of the ticks
// below. No single moment is reliable: the authoring host re-renders the whole element while it
// saves, and the input is replaced under this component more than once. Nothing typed yet is what
// tells a transient blur apart from the user leaving the label.
const INSIST_ON_FOCUS_FOR = 500;
const INSIST_AT = [0, 50, 120, 250, 400, 700, 1000];
// how many times a label will do the heavier focus cycle to get a caret back
const MAX_CARET_CYCLES = 3;
// how wide an editable label input is while it is empty
const EMPTY_INPUT_WIDTH = 30;

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

/**
 * Whether the document's caret is in this input. The characters land at the caret, not at the
 * focused node - an input can be the active element with no caret anywhere, and then keypress fires
 * and nothing is inserted, with nothing in the page cancelling anything.
 */
const caretIsInside = (node) => {
  if (typeof document === 'undefined' || !document.getSelection) {
    return true;
  }

  const selection = document.getSelection();

  if (!selection || !selection.rangeCount || !selection.anchorNode) {
    return false;
  }

  const anchor = selection.anchorNode;

  return anchor === node || anchor === node.parentNode || node.contains(anchor);
};

const LabelInput = ({ _ref, externalInputRef, label, disabled, inputStyle, minWidth, onChange, onBlur }) => (
  <AutosizeInput
    inputRef={(r) => {
      _ref(r);
      externalInputRef(r);
    }}
    disabled={disabled}
    inputStyle={inputStyle}
    minWidth={minWidth}
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
  minWidth: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export const MarkLabel = (props) => {
  // the state repositions the label once the input has a size, the ref is never a render behind
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

  // an empty label with an enabled input is one the user just added: label mode has to be on and it
  // always starts off. Read from the mark, not from autoFocus, because the tool that asked for the
  // label can be remounted by the marks coming back from the host before the input renders.
  const isNewLabel = useRef(mark.label === '' && !disabled && !mark.disabled);
  const insistUntil = useRef(0);
  const lastSaved = useRef(mark.label);
  const insisting = () => Date.now() < insistUntil.current && !(inputNode.current && inputNode.current.value);
  // the whole window losing the focus is not the user leaving the label - another window, the
  // devtools, or the host moving the focus while it saves. The window blur arrives before the
  // input's own blur, so this flag is set by the time the label is asked to give itself up.
  const windowAway = useRef(false);
  // our own blur, from the focus cycle that puts a missing caret back
  const selfFocusing = useRef(false);
  const caretCycles = useRef(0);

  const onChange = (e) => setLabel(e.target.value);

  const saveLabel = (value) => {
    if (value === lastSaved.current) {
      return;
    }

    lastSaved.current = value;
    props.onChange(value);
  };

  const handleBlur = useCallback(() => {
    // in the DNA env the focus is moved while the model is saved - not the user leaving the label
    if (insisting() || windowAway.current || selfFocusing.current) {
      return;
    }

    isNewLabel.current = false;

    if (label === '') {
      props.onChange('');
    } else if (label !== mark.label) {
      // the debounce can still be pending, and once the focus is gone an echo of the model would
      // overwrite what was typed before it fires
      saveLabel(label);
    }

    // lets the tool know that this label is not being edited anymore, so it stops auto focusing it
    if (props.onBlur) {
      props.onBlur();
    }
  }, [label, mark.label, props.onChange, props.onBlur]);

  const debouncedLabel = useDebounce(label, DEBOUNCE_DELAY);

  // props to state, but not while focused: the mark can come back from an async model save with an
  // older label and overwrite what was typed meanwhile
  useEffect(() => {
    if (isFocused()) {
      return;
    }

    setLabel(mark.label);
  }, [mark.label]);

  // pick up the change to debouncedLabel and save it
  useEffect(() => {
    if (typeof debouncedLabel === 'string' && debouncedLabel !== mark.label) {
      saveLabel(debouncedLabel);
    }
  }, [debouncedLabel]);

  const focusInput = () => {
    const node = inputNode.current;

    // node.disabled, not the disabled prop: a disabled input silently ignores focus()
    if ((!autoFocus && !isNewLabel.current && !insisting()) || !node || node.disabled) {
      return;
    }

    const wasFocused = isFocused();

    if (!wasFocused) {
      node.focus();

      // a new label is focused once, so it cannot fight over the focus with another one
      if (isFocused()) {
        isNewLabel.current = false;
      }
    }

    if (!node.setSelectionRange) {
      return;
    }

    // a label that was already being edited keeps the caret the user put in it; one that has just
    // taken the focus gets it at the end, otherwise typing continues in front of the existing label
    const keepCaret = wasFocused && node.value;
    const start = keepCaret ? node.selectionStart : (node.value || '').length;
    const end = keepCaret ? node.selectionEnd : start;

    // The characters land at the document's caret, not at the focused node. An input focused while
    // it was being replaced, or while the window was away, ends up as the active element with no
    // caret anywhere: keypress fires and nothing is inserted, with nothing in the page cancelling
    // anything. Re-asserting the range is what puts the caret back.
    if (!caretIsInside(node)) {
      node.setSelectionRange(start, end);
    }

    // and if it still is not there, a focus cycle is the heavier way to get it. Every focusInput
    // call is another go at it - after each render, on each insist tick, and when the window comes
    // back - up to a few times per label, since the state comes back as the input is replaced.
    if (caretIsInside(node) || caretCycles.current >= MAX_CARET_CYCLES) {
      return;
    }

    caretCycles.current += 1;
    // our own blur, so the label is not given up over it
    selfFocusing.current = true;
    node.blur();
    node.focus();
    node.setSelectionRange(start, end);
    selfFocusing.current = false;
  };

  // after every render: the input can appear a render or more later (the mark comes back from an
  // async model save) and a replaced node loses the focus without this component being told
  useEffect(() => focusInput());

  // and again on a timer, for the DNA env, where the focus is moved once the renders are over. The
  // original code focused from a setTimeout, which is what let it survive that.
  useEffect(() => {
    if (!autoFocus && !isNewLabel.current) {
      return;
    }

    if (!insistUntil.current) {
      insistUntil.current = Date.now() + INSIST_ON_FOCUS_FOR;
    }

    const timers = INSIST_AT.map((delay) => setTimeout(focusInput, delay));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [autoFocus]);

  // the blur that came with the window going away is ignored, so the label is still the one being
  // edited when the window comes back and it takes the focus, and its selection, back
  useEffect(() => {
    const onWindowBlur = () => {
      windowAway.current = true;
    };

    const onWindowFocus = () => {
      // coming back only means something if the window went away: moving the focus from one element
      // to another inside the page reaches window too in some implementations
      if (!windowAway.current) {
        return;
      }

      windowAway.current = false;
      focusInput();
    };

    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);

    return () => {
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [autoFocus]);

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
      // an editable label sizes itself to its content, so an empty one is 2px wide: enough for the
      // caret, not enough for anybody to see that the label is waiting to be typed into. Chrome
      // does not blink the caret of an input inside an svg foreignObject, it only paints a hairline,
      // so the box itself has to say that it has the focus.
      minWidth={disabledInput ? 1 : EMPTY_INPUT_WIDTH}
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

  // an empty label that cannot be edited is just an empty box - the config draws the background
  // marks into every correct answer graph too
  if (disabledInput && !label) {
    return null;
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
