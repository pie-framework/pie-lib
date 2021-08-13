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

const decimalRegex = /\.|,/g;

const toNodeData = data => {
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
    additionalKeys: PropTypes.array,
    latex: PropTypes.string.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = { equationEditor: 'miscellaneous' };
  }

  componentDidMount() {
    if (this.input && this.props.autoFocus) {
      this.input.focus();
    }
  }

  onClick = data => {
    const { noDecimal } = this.props;
    const c = toNodeData(data);
    log('mathChange: ', c);

    // if decimals are not allowed for this response, we discard the input
    if (noDecimal && (c.value === '.' || c.value === ',')) {
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

  onAnswerBlockClick = () => {
    this.props.onAnswerBlockAdd();
    this.onClick({
      type: 'answer'
    });
  };

  onEditorChange = latex => {
    const { onChange, noDecimal } = this.props;

    // if no decimals are allowed and the last change is a decimal dot, discard the change
    if (noDecimal && (latex.indexOf('.') !== -1 || latex.indexOf(',') !== -1) && this.input) {
      this.input.clear();
      this.input.write(latex.replace(decimalRegex, ''));
      return;
    }

    onChange(latex);
  };

  /** Only render if the mathquill instance's latex is different
   * or the keypad state changed from one state to the other (shown / hidden) */
  shouldComponentUpdate(nextProps, nextState) {
    const inputIsDifferent = this.input.mathField.latex() !== nextProps.latex;
    log('[shouldComponentUpdate] ', 'inputIsDifferent: ', inputIsDifferent);

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

  onEditorTypeChange = evt => {
    this.setState({ equationEditor: evt.target.value });
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
      latex,
      onFocus,
      onBlur,
      classes
    } = this.props;
    const shouldShowKeypad = !controlledKeypad || (controlledKeypad && showKeypad);

    log('[render]', latex);

    return (
      <div className={cx(classes.mathToolbar, classNames.mathToolbar)}>
        <div className={classes.inputAndTypeContainer}>
          {controlledKeypadMode && (
            <InputContainer label="Equation Editor" className={classes.selectContainer}>
              <Select
                className={classes.select}
                onChange={this.onEditorTypeChange}
                value={this.state.equationEditor}
              >
                <MenuItem value={1}>Grade 1 - 2</MenuItem>
                <MenuItem value={3}>Grade 3 - 5</MenuItem>
                <MenuItem value={6}>Grade 6 - 7</MenuItem>
                <MenuItem value={8}>Grade 8 - HS</MenuItem>
                <MenuItem value={'geometry'}>Geometry</MenuItem>
                <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
                <MenuItem value={'statistics'}>Statistics</MenuItem>
                <MenuItem value={'miscellaneous'}>Miscellaneous</MenuItem>
              </Select>
            </InputContainer>
          )}
          <mq.Input
            onFocus={onFocus}
            onBlur={onBlur}
            className={cx(
              classes.mathEditor,
              classNames.editor,
              !controlledKeypadMode ? classes.longMathEditor : ''
            )}
            innerRef={r => (this.input = r)}
            latex={latex}
            onChange={this.onEditorChange}
          />
        </div>
        {allowAnswerBlock && (
          <Button
            className={classes.addAnswerBlockButton}
            type="primary"
            style={{ bottom: shouldShowKeypad ? '320px' : '20px' }}
            onClick={this.onAnswerBlockClick}
          >
            + Response Area
          </Button>
        )}
        <hr className={classes.hr} />
        {shouldShowKeypad && (
          <HorizontalKeypad
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

const styles = theme => ({
  inputAndTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    '& *': {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif !important'
    }
  },
  selectContainer: {
    flex: 'initial',
    width: '25%',
    minWidth: '100px',
    marginLeft: '15px',
    marginTop: '5px',
    marginBottom: '5px',
    marginRight: '5px'
  },
  mathEditor: {
    maxWidth: '400px',
    color: color.text(),
    backgroundColor: color.background(),
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  longMathEditor: {
    maxWidth: '500px'
  },
  addAnswerBlockButton: {
    position: 'absolute',
    right: '12px',
    border: '1px solid lightgrey'
  },
  hr: {
    padding: 0,
    margin: 0,
    height: '1px',
    border: 'none',
    borderBottom: `solid 1px ${theme.palette.primary.main}`
  },
  mathToolbar: {
    zIndex: 9,
    position: 'relative',
    textAlign: 'center',
    width: 'auto',
    '& > .mq-math-mode': {
      border: 'solid 1px lightgrey'
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `dotted 1px ${theme.palette.primary.main}`,
      borderRadius: '0px'
    },
    '& .mq-overarrow-inner': {
      border: 'none !important'
    },
    '& .mq-overarrow-inner-right': {
      display: 'none !important'
    },
    '& .mq-overarrow-inner-left': {
      display: 'none !important'
    },
    '& .mq-overarrow.mq-arrow-both': {
      minWidth: '1.23em'
    }
  }
});

export default withStyles(styles)(EditorAndPad);
