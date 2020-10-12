import React from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { color } from '@pie-lib/render-ui';

const correctStyle = color => ({
  borderColor: `${color} !important`
});

export default withStyles(() => ({
  input: {
    padding: '10px 20px 10px 10px'
  },
  correct: correctStyle(color.correct()),
  incorrect: correctStyle(color.incorrect()),
  box: {
    fontSize: 'inherit'
  },
  notchedOutline: {
    borderColor: color.correct
  }
}))(props => {
  const { correct, isBox, classes, ...rest } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;

  return (
    <OutlinedInput
      className={classnames({
        [classes.box]: isBox
      })}
      classes={{
        notchedOutline: classnames({
          [classes[label]]: label
        }),
        input: classes.input
      }}
      labelWidth={0}
      {...rest}
    />
  );
});
