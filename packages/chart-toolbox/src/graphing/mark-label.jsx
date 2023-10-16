import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '../plot/index';
import { color } from '@pie-lib/render-ui';

const styles = (theme) => ({
  input: {
    float: 'right',
    padding: theme.spacing.unit * 0.5,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    border: `solid 1px ${color.secondary()}`,
    borderRadius: '3px',
    color: color.primaryDark(),
  },
  disabled: {
    border: `solid 1px ${color.primaryDark()}`,
    background: theme.palette.background.paper,
  },
  disabledMark: {
    border: `solid 1px ${color.disabled()}`,
    background: theme.palette.background.paper,
    color: color.disabled(),
  },
});

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

export const coordinates = (graphProps, mark, rect, position, fontSize) => {
  const { scale } = graphProps;
  const shift = 10;
  const font = fontSize ? fontSize : 16;
  rect = rect || { width: 0, height: 0 };

  switch (position) {
    case 'bottom-right': {
      return { left: `${(scale.x(mark.x) + shift) / font}rem`, top: `${(scale.y(mark.y) + shift) / font}rem` };
    }

    case 'bottom-left': {
      return {
        left: `${(scale.x(mark.x) - shift - rect.width) / font}rem`,
        top: `${(scale.y(mark.y) + shift) / font}rem`,
      };
    }

    case 'top-left': {
      return {
        left: `${(scale.x(mark.x) - shift - rect.width) / font}rem`,
        top: `${(scale.y(mark.y) - shift - rect.height) / font}rem`,
      };
    }

    case 'top-right': {
      return {
        left: `${(scale.x(mark.x) + shift) / font}rem`,
        top: `${(scale.y(mark.y) - shift - rect.height) / font}rem`,
      };
    }
  }
};

export const MarkLabel = (props) => {
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => setInput(node));

  const { mark, graphProps, classes, disabled, inputRef: externalInputRef, theme } = props;

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

  const fontSize = theme && theme.typography ? theme.typography.fontSize + 2 : 16;
  const rect = input ? input.getBoundingClientRect() : { width: 0, height: 0 };
  const pos = position(graphProps, mark, rect);
  const leftTop = coordinates(graphProps, mark, rect, pos, fontSize);

  const style = {
    position: 'fixed',
    pointerEvents: 'auto',
    ...leftTop,
  };

  const disabledInput = disabled || mark.disabled;

  return (
    <AutosizeInput
      inputRef={(r) => {
        _ref(r);
        externalInputRef(r);
      }}
      disabled={disabledInput}
      inputClassName={cn(classes.input, {
        [classes.disabled]: disabled,
        [classes.disabledMark]: mark.disabled,
      })}
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
  classes: PropTypes.object,
  inputRef: PropTypes.func,
  mark: PropTypes.object,
  theme: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(MarkLabel);
