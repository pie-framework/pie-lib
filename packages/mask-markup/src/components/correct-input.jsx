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
    borderRadius: '4px !important',
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
  crInput: {
    padding: '8px !important'
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
  const {
    correct,
    charactersLimit,
    classes,
    disabled,
    isBox,
    isConstructedResponse,
    width,
    spellCheck,
    ...rest
  } = props;
  const label = typeof correct === 'boolean' ? (correct ? 'correct' : 'incorrect') : undefined;
  const inputProps = charactersLimit ? { maxLength: charactersLimit } : {};

  if (width) {
    inputProps.style = {
      width: `${width + Math.round(width / 10) + 1}ch` // added some extra space for capital letters
    };
  }

  return (
    <OutlinedInput
      className={classnames({
        [classes.disabledInput]: disabled,
        [classes.box]: isBox,
        [classes.outlinedInput]: true
      })}
      classes={{
        input: classnames({
          [classes.input]: true,
          [classes[label]]: label,
          [classes.crInput]: isConstructedResponse
        })
      }}
      inputProps={inputProps}
      labelWidth={0}
      disabled={disabled}
      spellCheck={spellCheck}
      {...rest}
    />
  );
});
