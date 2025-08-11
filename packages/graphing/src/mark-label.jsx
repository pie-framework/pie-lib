import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AutosizeInput from 'react-input-autosize';
import { useDebounce } from './use-debounce';
import { types } from '@pie-lib/plot';
import { color } from '@pie-lib/render-ui';
import SvgIcon from './label-svg-icon';

const inputStyles = (theme) => ({
  float: 'right',
  padding: theme.spacing.unit * 0.5,
  borderRadius: '4px',
  fontSize: '10px',
  backgroundColor: color.defaults.WHITE,
});

const styles = (theme) => ({
  inputStudent: {
    ...inputStyles(theme),
    padding: '0',
    border: 'none',
    color: 'inherit',
    fontWeight: 'bold',
  },
  input: {
    float: 'right',
    padding: theme.spacing.unit * 0.5,
    fontFamily: theme.typography.fontFamily,
    fontSize: '10px',
    border: `solid 1px ${color.defaults.SECONDARY}`,
    borderRadius: '3px',
    color: color.defaults.PRIMARY_DARK,
    backgroundColor: color.defaults.WHITE,
  },
  disabled: {
    border: `solid 1px ${color.defaults.PRIMARY_DARK}`,
    backgroundColor: color.defaults.WHITE,
    '-webkit-opacity': '1',
  },
  disabledMark: {
    border: `solid 1px ${color.disabled()}`,
    color: color.disabled(),
    '-webkit-text-fill-color': color.disabled(),
  },
  inputCorrect: {
    ...inputStyles(theme),
    color: color.defaults.CORRECT_WITH_ICON,
    border: `solid 1px ${color.defaults.CORRECT_WITH_ICON}`,
  },
  inputIncorrect: {
    ...inputStyles(theme),
    color: color.defaults.INCORRECT_WITH_ICON,
    border: `solid 1px ${color.defaults.INCORRECT_WITH_ICON}`,
  },
  inputMissing: {
    ...inputStyles(theme),
    color: color.defaults.MISSING_WITH_ICON,
    border: `solid 1px ${color.defaults.MISSING_WITH_ICON}`,
    fontWeight: 'bold',
  },
  incorrect: {
    ...inputStyles(theme),
    color: color.defaults.INCORRECT_WITH_ICON,
    fontWeight: 'bold',
    padding: '0',
  },
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

const LabelInput = ({ _ref, externalInputRef, label, disabled, inputClassName, onChange }) => (
  <AutosizeInput
    inputRef={(r) => {
      _ref(r);
      externalInputRef(r);
    }}
    disabled={disabled}
    inputClassName={inputClassName}
    value={label}
    onChange={onChange}
  />
);

export const MarkLabel = (props) => {
  const [input, setInput] = useState(null);
  const _ref = useCallback((node) => setInput(node));

  const { mark, graphProps, classes, disabled, inputRef: externalInputRef, theme } = props;

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

  const renderInput = (inputClass, labelValue) => (
    <LabelInput
      _ref={_ref}
      externalInputRef={externalInputRef}
      label={labelValue}
      disabled={disabledInput}
      inputClassName={cn(inputClass)}
      onChange={onChange}
    />
  );

  if (correctness === 'correct' && correctnesslabel === 'correct' && correctlabel) {
    return (
      <div className={classes.inputCorrect} style={style}>
        <SvgIcon type="correct" />
        {renderInput(classes.inputStudent, correctlabel)}
      </div>
    );
  }

  // avoid rendering empty label when a correct point without label  was provided
  if (correctness === 'correct' && correctnesslabel === 'correct' && !correctlabel) {
    return null;
  }

  if (correctness === 'correct' && correctnesslabel === 'incorrect') {
    return (
      <>
        <div className={classes.inputIncorrect} style={style}>
          <SvgIcon type="incorrect" />
          {label === '' ? (
            <SvgIcon type="empty" style={{ marginLeft: '3px' }} />
          ) : (
            renderInput(classes.inputStudent, label)
          )}
        </div>
        <div className={classes.inputMissing} style={secondLabelStyle}>
          {renderInput(classes.inputStudent, correctlabel)}
        </div>
      </>
    );
  }

  if (correctness === 'missing') {
    return (
      <div className={classes.inputMissing} style={style}>
        {renderInput(classes.inputStudent, label)}
      </div>
    );
  }

  if (correctness === 'incorrect') {
    return (
      <div className={classes.incorrect} style={style}>
        {renderInput(classes.inputStudent, label)}
      </div>
    );
  }

  return (
    <div style={style}>
      {renderInput(
        cn(classes.input, {
          [classes.disabled]: disabled,
          [classes.disabledMark]: mark.disabled,
        }),
        label,
      )}
    </div>
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
