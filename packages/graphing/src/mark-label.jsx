import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import SvgIcon from './label-svg-icon';

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

const StyledIncorrect = styled('div')(({ theme }) => ({
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

const LabelInput = ({ _ref, externalInputRef, label, disabled, inputStyle, onChange }) => (
  <AutosizeInput
    inputRef={(r) => {
      _ref(r);
      externalInputRef(r);
    }}
    disabled={disabled}
    inputStyle={inputStyle}
    value={label}
    onChange={onChange}
  />
);

export const MarkLabel = (props) => {
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => setInput(node));
  const theme = useTheme();

  const { mark, graphProps, disabled, inputRef: externalInputRef } = props;

  const [label, setLabel] = useState(mark.label);
  const { correctness, correctnesslabel, correctlabel } = mark;
  const onChange = (e) => setLabel(e.target.value);

  const debouncedLabel = useDebounce(label, 200);

  // useState only sets the value once, to synch props to state need useEffect
  useEffect(() => {
    setLabel(mark.label);
  }, [mark.label]);

  // pick up the change to debouncedLabel and save it
  useEffect(() => {
    if (typeof debouncedLabel === 'string' && debouncedLabel !== mark.label) {
      props.onChange(debouncedLabel);
    }
  }, [debouncedLabel]);

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

  // avoid rendering empty label when a correct point without label  was provided
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
        <StyledInputMissing style={secondLabelStyle}>
          {renderInput(studentInputStyle, correctlabel)}
        </StyledInputMissing>
      </>
    );
  }

  if (correctness === 'missing') {
    return (
      <StyledInputMissing style={style}>
        {renderInput(studentInputStyle, label)}
      </StyledInputMissing>
    );
  }

  if (correctness === 'incorrect') {
    return (
      <StyledIncorrect style={style}>
        {renderInput(studentInputStyle, label)}
      </StyledIncorrect>
    );
  }

  return (
    <div style={style}>
      {renderInput(
        getInputStyles(theme, disabled, mark.disabled),
        label,
      )}
    </div>
  );
};

MarkLabel.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  graphProps: types.GraphPropsType,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
};

export default MarkLabel;
