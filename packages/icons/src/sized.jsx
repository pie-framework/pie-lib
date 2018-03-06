
import React from 'react';
import { normalizeSize } from './icon-root';

export default ({ size, children }) => {

  size = normalizeSize(size);

  const style = {
    height: size,
    width: size,
    display: 'inline-block',
    position: 'relative'
  }

  return (<div style={style}>{children}</div>);
}