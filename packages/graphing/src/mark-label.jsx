import React, { useState } from 'react';

export const MarkLabel = props => {
  const { mark, graphProps } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [label, setLabel] = useState(mark.label);

  const onChange = e => {
    console.log('onChange...', e.target.value);
    setLabel(e.target.value);
  };

  const focusInput = () => setIsFocused(true);

  const blurInput = () => {
    setIsFocused(false);
    if (props.onChange) {
      props.onChange({ ...mark, label });
    }
  };

  const style = {
    position: 'absolute',
    left: graphProps.scale.x(mark.x),
    top: graphProps.scale.y(mark.y)
  };

  return (
    <input
      type="text"
      onFocus={focusInput}
      onBlur={blurInput}
      value={label}
      style={style}
      onChange={onChange}
    />
  );
};
