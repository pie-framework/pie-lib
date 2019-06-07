import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import { GraphPropsType } from '@pie-lib/plot/lib/types';

const styles = theme => ({
  input: {
    float: 'right',
    padding: theme.spacing.unit * 0.5,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: `solid 1px ${theme.palette.secondary.main}`,
    borderRadius: '3px',
    color: theme.palette.primary.dark
  },
  disabled: {
    border: `solid 1px ${theme.palette.primary.dark}`,
    background: 'white'
  }
});

const position = (graphProps, mark, rect) => {
  rect = rect || { width: 0, height: 0 };
  const { scale, domain, range } = graphProps;

  const rightEdge = scale.x(mark.x) + rect.width;
  const bottomEdge = scale.y(mark.y) + rect.height;
  const h = rightEdge > scale.x(domain.max) ? 'left' : 'right';
  const v = bottomEdge > scale.y(range.min) ? 'top' : 'bottom';
  return `${v}-${h}`;
};

const coordinates = (graphProps, mark, rect, position) => {
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
        top: scale.y(mark.y) - shift - rect.height
      };
    }
    case 'top-right': {
      return {
        left: scale.x(mark.x) + shift,
        top: scale.y(mark.y) - shift - rect.height
      };
    }
  }
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value]);
  return debouncedValue;
};

export const MarkLabel = props => {
  const [input, setInput] = useState(null);
  const _ref = useCallback(node => setInput(node));

  const { mark, graphProps, classes, disabled, inputRef: externalInputRef } = props;
  const [label, setLabel] = useState(mark.label);

  const onChange = e => setLabel(e.target.value);

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
    position: 'absolute',
    pointerEvents: 'auto',
    ...leftTop
  };

  return (
    <AutosizeInput
      inputRef={r => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabled}
      inputClassName={cn(classes.input, disabled && classes.disabled)}
      value={label}
      style={style}
      onChange={onChange}
    />
  );
};

MarkLabel.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  graphProps: GraphPropsType,
  classes: PropTypes.object,
  inputRef: PropTypes.func,
  mark: PropTypes.object
};

export default withStyles(styles)(MarkLabel);
