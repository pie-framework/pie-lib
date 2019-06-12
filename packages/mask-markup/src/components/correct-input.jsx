import React from 'react';
import Input from '@material-ui/core/Input';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const correctStyle = color => ({
  '&:before': {
    borderBottom: `solid 2px ${color} !important`
  },
  '&:after': {
    borderBottom: `solid 2px ${color} !important`
  }
});

export default withStyles(() => ({
  correct: correctStyle('green'),
  incorrect: correctStyle('red'),
  box: {
    border: 'solid #9E9F9E',
    borderWidth: '1px 1px 0 1px'
  }
}))(props => {
  const { correct, isBox, classes, ...rest } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;
  const correctName = label && classes[label];

  return (
    <Input
      className={classnames({
        [classes.box]: isBox
      })}
      classes={{
        underline: classnames(correctName)
      }}
      {...rest}
    />
  );
});
