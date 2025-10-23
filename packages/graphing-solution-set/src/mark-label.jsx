import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';

const StyledAutosizeInput = styled(AutosizeInput, {
  shouldForwardProp: (prop) => !['disabled', 'markDisabled'].includes(prop),
})(({ theme, disabled, markDisabled }) => ({
  '& input': {
    float: 'right',
    padding: theme.spacing(0.5),
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: `solid 1px ${disabled ? color.defaults.PRIMARY_DARK : markDisabled ? color.disabled() : color.defaults.SECONDARY}`,
    borderRadius: '3px',
    color: markDisabled ? color.disabled() : color.defaults.PRIMARY_DARK,
    background: (disabled || markDisabled) ? theme.palette.background.paper : 'transparent',
  },
}));

export const position = (graphProps, mark, rect) => {
  rect = rect || { width: 0, height: 0 };
  const { scale, domain, range } = graphProps;
  const shift = 10;

  const rightEdge = scale.x(mark.x) + rect.width + shift;
  const bottomEdge = scale.y(mark.y) + rect.height + shift;

  const h = rightEdge >= scale.x(domain.max) ? 'left' : 'right';
  const v = bottomEdge >= scale.y(range.min) ? 'top' : 'bottom';

  return `${v}-${h}`;
};

export const coordinates = (graphProps, mark, rect, position) => {
  const { scale } = graphProps;
  const shift = 10;
  rect = rect || { width: 0, height: 0 };

  switch (position) {
    case 'bottom-right': {
      return { left: scale.x(mark.x) + shift, top: scale.y(mark.y) + shift };
    }
    case 'bottom-left': {
      return { left: scale.x(mark.x) - shift - rect.width, top: scale.y(mark.y) + shift };
    }
    case 'top-left': {
      return {
        left: scale.x(mark.x) - shift - rect.width,
        top: scale.y(mark.y) - shift - rect.height,
      };
    }
    case 'top-right': {
      return {
        left: scale.x(mark.x) + shift,
        top: scale.y(mark.y) - shift - rect.height,
      };
    }
  }
};

export const MarkLabel = (props) => {
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => setInput(node));

  const { mark, graphProps, disabled, inputRef: externalInputRef, theme } = props;

  const [label, setLabel] = useState(mark.label);

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
    ...leftTop,
  };

  const disabledInput = disabled || mark.disabled;

  return (
    <StyledAutosizeInput
      inputRef={(r) => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabledInput}
      markDisabled={mark.disabled}
      value={label}
      style={style}
      onChange={onChange}
    />
  );
};

MarkLabel.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  graphProps: types.GraphPropsType,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
  theme: PropTypes.object,
};

export default MarkLabel;
