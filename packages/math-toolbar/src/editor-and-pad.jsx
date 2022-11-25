import { HorizontalKeypad, mq } from '@pie-lib/math-input';
import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
const log = debug('@pie-lib:math-toolbar:editor-and-pad');
import { color, InputContainer } from '@pie-lib/render-ui';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { updateSpans } from '@pie-lib/math-input';
import isEqual from 'lodash/isEqual';

const decimalRegex = /\.|,/g;

const toNodeData = (data) => {
  if (!data) {
    return;
  }

  const { type, value } = data;

  if (type === 'command' || type === 'cursor') {
    return data;
  } else if (type === 'answer') {
    return { type: 'answer', ...data };
  } else if (value === 'clear') {
    return { type: 'clear' };
  } else {
    return { type: 'write', value };
  }
};

export class EditorAndPad extends React.Component {
  static propTypes = {
    classNames: PropTypes.object,
    keypadMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    autoFocus: PropTypes.bool,
    allowAnswerBlock: PropTypes.bool,
    showKeypad: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    controlledKeypadMode: PropTypes.bool,
    noDecimal: PropTypes.bool,
    hideInput: PropTypes.bool,
    noLatexHandling: PropTypes.bool,
    layoutForKeyPad: PropTypes.object,
    additionalKeys: PropTypes.array,
    latex: PropTypes.string.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = { equationEditor: 'item-authoring', addDisabled: false };
  }

  componentDidMount() {
    if (this.input && this.props.autoFocus) {
      this.input.focus();
    }
  }

  onClick = (data) => {
    const { noDecimal, noLatexHandling, onChange } = this.props;
    const c = toNodeData(data);
    log('mathChange: ', c);

    if (noLatexHandling) {
      onChange(c.value);
      return;
    }

    // if decimals are not allowed for this response, we discard the input
    if (noDecimal && (c.value === '.' || c.value === ',')) {
      return;
    }

    if (!c) {
      return;
    }

    if (c.type === 'clear') {
      log('call clear...');
      this.input.clear();
    } else if (c.type === 'command') {
      this.input.command(c.value);
    } else if (c.type === 'cursor') {
      this.input.keystroke(c.value);
    } else if (c.type === 'answer') {
      this.input.write('%response%');
    } else {
      this.input.write(c.value);
    }
  };

  updateDisable = (isEdit) => {
    const { maxResponseAreas } = this.props;

    if (maxResponseAreas) {
      const shouldDisable = this.checkResponseAreasNumber(maxResponseAreas, isEdit);

      this.setState({ addDisabled: shouldDisable });
    }
  };

  onAnswerBlockClick = () => {
    this.props.onAnswerBlockAdd();
    this.onClick({
      type: 'answer',
    });

    this.updateDisable(true);
  };

  onEditorChange = (latex) => {
    const { onChange, noDecimal } = this.props;

    updateSpans();

    this.updateDisable(true);

    // if no decimals are allowed and the last change is a decimal dot, discard the change
    if (noDecimal && (latex.indexOf('.') !== -1 || latex.indexOf(',') !== -1) && this.input) {
      this.input.clear();
      this.input.write(latex.replace(decimalRegex, ''));
      return;
    }

    // eslint-disable-next-line no-useless-escape
    const regexMatch = latex.match(/[0-9]\\ \\frac\{[^\{]*\}\{ \}/);

    if (this.input && regexMatch && regexMatch?.length) {
      try {
        this.input.mathField.__controller.cursor.insLeftOf(this.input.mathField.__controller.cursor.parent[-1].parent);
        this.input.mathField.el().dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8 }));
      } catch (e) {
        console.error(e.toString());
      }

      return;
    }

    onChange(latex);
  };

  /** Only render if the mathquill instance's latex is different
   * or the keypad state changed from one state to the other (shown / hidden) */
  shouldComponentUpdate(nextProps, nextState) {
    const inputIsDifferent = this.input.mathField.latex() !== nextProps.latex;
    log('[shouldComponentUpdate] ', 'inputIsDifferent: ', inputIsDifferent);

    if (!isEqual(this.props.error, nextProps.error)) {
      return true;
    }

    if (!inputIsDifferent && this.props.keypadMode !== nextProps.keypadMode) {
      return true;
    }

    if (!inputIsDifferent && this.props.noDecimal !== nextProps.noDecimal) {
      return true;
    }

    if (!inputIsDifferent && this.state.equationEditor !== nextState.equationEditor) {
      return true;
    }

    if (!inputIsDifferent && this.props.controlledKeypad) {
      return this.props.showKeypad !== nextProps.showKeypad;
    }

    return inputIsDifferent;
  }

  onEditorTypeChange = (evt) => {
    this.setState({ equationEditor: evt.target.value });
  };

  checkResponseAreasNumber = (maxResponseAreas, isEdit) => {
    const { latex } = (this.input && this.input.props) || {};

    if (latex) {
      const count = (latex.match(/answerBlock/g) || []).length;

      return isEdit ? count === maxResponseAreas - 1 : count === maxResponseAreas;
    }

    return false;
  };

  render() {
    const {
      classNames,
      keypadMode,
      allowAnswerBlock,
      additionalKeys,
      controlledKeypad,
      controlledKeypadMode,
      showKeypad,
      noDecimal,
      hideInput,
      layoutForKeyPad,
      latex,
      onFocus,
      onBlur,
      classes,
      error,
    } = this.props;
    const shouldShowKeypad = !controlledKeypad || (controlledKeypad && showKeypad);
    const { addDisabled } = this.state;

    log('[render]', latex);

    return (
      <div className={cx(classes.mathToolbar, classNames.mathToolbar)}>
        <div className={cx(classes.inputAndTypeContainer, { [classes.hide]: hideInput })}>
          {controlledKeypadMode && (
            <InputContainer label="Equation Editor" className={classes.selectContainer}>
              <Select className={classes.select} onChange={this.onEditorTypeChange} value={this.state.equationEditor}>
                <MenuItem value="non-negative-integers">Numeric - Non-Negative Integers</MenuItem>
                <MenuItem value="integers">Numeric - Integers</MenuItem>
                <MenuItem value="decimals">Numeric - Decimals</MenuItem>
                <MenuItem value="fractions">Numeric - Fractions</MenuItem>
                <MenuItem value={1}>Grade 1 - 2</MenuItem>
                <MenuItem value={3}>Grade 3 - 5</MenuItem>
                <MenuItem value={6}>Grade 6 - 7</MenuItem>
                <MenuItem value={8}>Grade 8 - HS</MenuItem>
                <MenuItem value={'geometry'}>Geometry</MenuItem>
                <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
                <MenuItem value={'statistics'}>Statistics</MenuItem>
                <MenuItem value={'item-authoring'}>Item Authoring</MenuItem>
              </Select>
            </InputContainer>
          )}
          <div className={cx(classes.inputContainer, error ? classes.error : '')}>
            <mq.Input
              onFocus={() => {
                onFocus && onFocus();
                this.updateDisable(false);
              }}
              onBlur={(event) => {
                this.updateDisable(false);
                onBlur && onBlur(event);
              }}
              className={cx(classes.mathEditor, classNames.editor, !controlledKeypadMode ? classes.longMathEditor : '')}
              innerRef={(r) => (this.input = r)}
              latex={latex}
              onChange={this.onEditorChange}
            />
          </div>
        </div>
        {allowAnswerBlock && (
          <Button
            className={classes.addAnswerBlockButton}
            type="primary"
            style={{ bottom: shouldShowKeypad ? '320px' : '20px' }}
            onClick={this.onAnswerBlockClick}
            disabled={addDisabled}
          >
            + Response Area
          </Button>
        )}
        <hr className={classes.hr} />
        {shouldShowKeypad && (
          <HorizontalKeypad
            className={classes.keyboard}
            layoutForKeyPad={layoutForKeyPad}
            additionalKeys={additionalKeys}
            mode={controlledKeypadMode ? this.state.equationEditor : keypadMode}
            onClick={this.onClick}
            noDecimal={noDecimal}
          />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  inputAndTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    '& .mq-editable-field .mq-cursor': {
      top: '-4px',
    },
    '& .mq-math-mode .mq-selection, .mq-editable-field .mq-selection': {
      paddingTop: '18px',
    },
    '& .mq-math-mode .mq-overarrow': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
    '& .mq-math-mode .mq-overline .mq-overline-inner': {
      paddingTop: '0.4em !important',
    },
    '& .mq-overarrow.mq-arrow-both': {
      minWidth: '1.23em',
      '& *': {
        lineHeight: '1 !important',
      },
      '&:before': {
        top: '-0.45em',
        left: '-1px',
      },
      '&:after': {
        position: 'absolute',
        top: '0px !important',
        right: '-2px',
      },
      '&.mq-empty:after': {
        top: '-0.45em',
      },
    },
    '& .mq-overarrow.mq-arrow-right': {
      '&:before': {
        top: '-0.4em',
        right: '-1px',
      },
    },
    '& *': {
      fontFamily: 'MJXZERO, MJXTEX !important',

      '& .mq-math-mode > span > var': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode span var': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode .mq-nonSymbola': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode > span > var.mq-operator-name': {
        fontFamily: 'MJXZERO, MJXTEX !important',
      },

      '& .mq-math-mode .mq-sqrt-prefix': {
        verticalAlign: 'bottom !important',
        top: '0 !important',
        left: '-0.1em !important',
      },

      '& .mq-math-mode .mq-overarc ': {
        paddingTop: '0.45em !important',
      },

      '& .mq-math-mode sup.mq-nthroot': {
        fontSize: '70% !important',
        verticalAlign: '0.5em !important',
        paddingRight: '0.15em',
      },

      '& .mq-math-mode .mq-empty': {
        padding: '9px 1px !important',
      },

      '& .mq-math-mode .mq-root-block': {
        paddingTop: '10px',
      },

      '& .mq-scaled .mq-sqrt-prefix': {
        top: '0 !important',
      },

      '& .mq-longdiv-inner': {
        marginTop: '-1px',
        marginLeft: '5px !important;',

        '& > .mq-empty': {
          padding: '0 !important',
          marginLeft: '0px !important',
          marginTop: '2px',
        },
      },

      '& .mq-math-mode .mq-longdiv': {
        display: 'inline-flex !important',
      },

      '& .mq-math-mode .mq-longdiv .mq-longdiv-inner': {
        marginLeft: '4px !important',
        paddingTop: '6px !important',
        paddingLeft: '6px !important',
      },

      '& .mq-math-mode .mq-supsub': {
        fontSize: '70.7% !important',
      },

      '& .mq-math-mode .mq-paren': {
        verticalAlign: 'top !important',
        padding: '1px 0.1em !important',
      },

      '& .mq-math-mode .mq-sqrt-stem': {
        borderTop: '0.07em solid',
        marginLeft: '-1.5px',
        marginTop: '-2px !important',
        paddingTop: '5px !important',
      },

      '& .mq-supsub ': {
        fontSize: '70.7%',
      },

      '& .mq-math-mode .mq-supsub.mq-sup-only': {
        verticalAlign: '-0.1em !important',

        '& .mq-sup': {
          marginBottom: '0px !important',
        },
      },

      '& .mq-math-mode .mq-denominator': {
        marginTop: '-5px !important',
        padding: '0.5em 0.1em 0.1em !important',
      },

      '& .mq-math-mode .mq-numerator, .mq-math-mode .mq-over': {
        padding: '0 0.1em !important',
        paddingBottom: '0 !important',
        marginBottom: '4.5px',
      },

      '-webkit-font-smoothing': 'antialiased !important',
    },
  },
  hide: {
    display: 'none',
  },
  selectContainer: {
    flex: 'initial',
    width: '25%',
    minWidth: '100px',
    marginLeft: '15px',
    marginTop: '5px',
    marginBottom: '5px',
    marginRight: '5px',

    '& label': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },

    '& div': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important',
    },
  },
  mathEditor: {
    maxWidth: '400px',
    color: color.text(),
    backgroundColor: color.background(),
    padding: '2px',
  },
  longMathEditor: {
    maxWidth: '500px',
  },
  addAnswerBlockButton: {
    position: 'absolute',
    right: '12px',
    border: '1px solid lightgrey',
  },
  hr: {
    padding: 0,
    margin: 0,
    height: '1px',
    border: 'none',
    borderBottom: `solid 1px ${theme.palette.primary.main}`,
  },
  mathToolbar: {
    zIndex: 9,
    position: 'relative',
    textAlign: 'center',
    width: 'auto',
    '& > .mq-math-mode': {
      border: 'solid 1px lightgrey',
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `dotted 1px ${theme.palette.primary.main}`,
      borderRadius: '0px',
    },
    '& .mq-overarrow-inner': {
      border: 'none !important',
      paddingTop: '0 !important',
    },
    '& .mq-overarrow-inner-right': {
      display: 'none !important',
    },
    '& .mq-overarrow-inner-left': {
      display: 'none !important',
    },
    '& .mq-longdiv-inner': {
      borderTop: '1px solid !important',
      paddingTop: '1.5px !important',
    },
    '& .mq-overarrow.mq-arrow-both': {
      top: '7.8px',
      marginTop: '0px',
      minWidth: '1.23em',
    },
    '& .mq-parallelogram': {
      lineHeight: 0.85,
    },
  },
  inputContainer: {
    minWidth: '500px',
    maxWidth: '900px',
    minHeight: '30px',
    width: '100%',
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,

    '& .mq-sqrt-prefix .mq-scaled': {
      verticalAlign: 'middle !important',
    },
  },
  error: {
    border: '2px solid red',
  },
  keyboard: {
    '& *': {
      fontFamily: 'MJXZERO, MJXTEX !important',

      '& .mq-math-mode > span > var': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode span var': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode .mq-nonSymbola': {
        fontFamily: 'MJXZERO, MJXTEX-I !important',
      },
      '& .mq-math-mode > span > var.mq-operator-name': {
        fontFamily: 'MJXZERO, MJXTEX !important',
      },

      '& .mq-math-mode .mq-sqrt-prefix': {
        top: '0 !important',
      },

      '& .mq-math-mode .mq-empty': {
        padding: '9px 1px !important',
      },

      '& .mq-longdiv-inner': {
        marginTop: '-1px',
        marginLeft: '5px !important;',

        '& > .mq-empty': {
          padding: '0 !important',
          marginLeft: '0px !important',
          marginTop: '2px',
        },
      },

      '& .mq-math-mode .mq-longdiv': {
        display: 'inline-flex !important',
      },

      '& .mq-math-mode .mq-supsub': {
        fontSize: '70.7% !important',
      },

      '& .mq-math-mode .mq-sqrt-stem': {
        marginTop: '-5px',
        paddingTop: '4px',
      },

      '& .mq-math-mode .mq-paren': {
        verticalAlign: 'middle !important',
      },

      '& .mq-math-mode .mq-overarrow .mq-overarrow-inner .mq-empty': {
        padding: '0 !important',
      },

      '& .mq-math-mode .mq-overline .mq-overline-inner .mq-empty ': {
        padding: '0 !important',
      },
    },
  },
});

export default withStyles(styles)(EditorAndPad);
