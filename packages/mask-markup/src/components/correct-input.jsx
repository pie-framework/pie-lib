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
  'underline-incorrect': underline('red')
}))(props => {
  const { correct, classes, ...rest } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;
  const underlineName = label && classes[`underline-${label}`];
  return (
    <Input
      classes={{
        underline: classnames(underlineName)
      }}
      {...rest}
    />
  );
});
