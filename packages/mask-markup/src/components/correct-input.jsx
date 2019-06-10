import React from 'react';
import Input from '@material-ui/core/Input';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const underline = color => ({
  '&:before': {
    borderBottom: `solid 2px ${color}`
  },
  '&:after': {
    borderBottom: `solid 2px ${color}`
  }
});

export default withStyles(() => ({
  'underline-correct': underline('green'),
  'underline-incorrect': underline('red'),
  box: {
    border: 'solid #9E9F9E',
    borderWidth: '1px 1px 0 1px'
  }
}))(props => {
  const { correct, isBox, classes, ...rest } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;
  const underlineName = label && classes[`underline-${label}`];

  return (
    <Input
      className={classnames({
        [classes.box]: isBox
      })}
      classes={{
        underline: classnames(underlineName)
      }}
      {...rest}
    />
  );
});
