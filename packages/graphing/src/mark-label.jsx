import React, { useState } from 'react';

export const MarkLabel = props => {
  const { mark, graphProps } = props;

  console.log('mark.label:', mark.label);
  const [label, setLabel] = useState(mark.label);
  console.log('mark.label:', mark.label, 'label:');

  const onChange = e => {
    console.log('onChange...', e.target.value);
    setLabel(e.target.value);
  };

  // const focusInput = () => setIsFocused(true);

  const blurInput = () => {
    // setIsFocused(false);
    if (props.onChange) {
      // console.log(mark.label, '??', label);
      props.onChange(label);
    }
  };

  const style = {
    position: 'absolute',
    zIndex: 100,
    left: graphProps.scale.x(mark.x),
    top: graphProps.scale.y(mark.y),
    pointerEvents: 'auto'
  };

  return <input type="text" onBlur={blurInput} value={label} style={style} onChange={onChange} />;
};
