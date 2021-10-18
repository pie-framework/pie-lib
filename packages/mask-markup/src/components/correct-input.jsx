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
    color: color.text(),
    backgroundColor: color.background(),
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '10px 20px 10px 10px',
    '&:disabled': {
      opacity: 0.8,
      cursor: 'not-allowed !important'
    },
    '&:hover': {
      borderColor: color.primary(),
      '&:disabled': {
        borderColor: 'initial'
      }
    },
    '&:focus': {
      borderColor: color.primaryDark()
    }
  },
  correct: correctStyle(color.correct()),
  incorrect: correctStyle(color.incorrect()),
  box: {
    fontSize: 'inherit'
  },
  outlinedInput: {
    padding: '2px',
    borderRadius: '4px',
    '& fieldset': {
      border: 0
    }
  },
  notchedOutline: {
    borderColor: color.correct()
  }
}))(props => {
  const { correct, isBox, classes, disabled, maxLength, ...rest } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;
  const extraSpace = maxLength ? maxLength / 10 + 1 : 0; // used for capital letters
  const inputProps = maxLength
    ? {
        maxLength: maxLength,
        style: {
          width: `${maxLength + extraSpace}ch`
        }
      }
    : {};

  return (
    <OutlinedInput
      className={classnames({
        [classes.disabledInput]: disabled,
        [classes.box]: isBox,
        [classes.outlinedInput]: true
      })}
      classes={{
        input: classnames({ [classes.input]: true, [classes[label]]: label })
      }}
      inputProps={inputProps}
      labelWidth={0}
      disabled={disabled}
      {...rest}
    />
  );
});
