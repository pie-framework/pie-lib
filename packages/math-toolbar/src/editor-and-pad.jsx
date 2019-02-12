import { HorizontalKeypad } from '@pie-lib/math-input';
import React from 'react';
import debug from 'debug';
import PropTypes from 'prop-types';
import cx from 'classnames';
import MathQuillEditor from './mathquill/editor';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const log = debug('@pie-lib:math-toolbar:editor-and-pad');

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
    keypadMode: PropTypes.string,
    allowAnswerBlock: PropTypes.bool,
    showKeypad: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    latex: PropTypes.string.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      answerBlockIdCounter: 0,
      answerBlocks: props.allowAnswerBlock ? [] : undefined
    };
  }

  onClick = data => {
    const c = toNodeData(data);
    log('mathChange: ', c);

    if (c.type === 'clear') {
      log('call clear...');
      this.input.clear();
    } else if (c.type === 'command') {
      this.input.command(c.value);
    } else if (c.type === 'cursor') {
      this.input.keystroke(c.value);
    } else if (c.type === 'answer') {
      this.input.write(`\\embed{answerBlock}[${c.id}]`);
    } else {
      this.input.write(c.value);
    }
  };

  onAnswerBlockClick = () => {
    const { answerBlockIdCounter } = this.state;

    this.onClick({
      type: 'answer',
      id: `answerBlock${answerBlockIdCounter + 1}`
    });

    this.setState(
      state => ({
        answerBlocks: state.answerBlocks.concat({
          id: `answerBlock${state.answerBlockIdCounter + 1}`
        }),
        answerBlockIdCounter: state.answerBlockIdCounter + 1
      }),
      () => {
        this.props.onAnswerBlockAdd(
          `answerBlock${this.state.answerBlockIdCounter}`
        );
      }
    );
  };

  onEditorChange = latex => {
    const { onChange } = this.props;
    onChange(latex);
  };

  /** Only render if the mathquill instance's latex is different
   * or the keypad state changed from one state to the other (shown / hidden) */
  shouldComponentUpdate(nextProps) {
    const inputIsDifferent = this.input.latex() !== nextProps.latex;
    log('[shouldComponentUpdate] ', 'inputIsDifferent: ', inputIsDifferent);

    if (!inputIsDifferent && this.props.controlledKeypad) {
      return this.props.showKeypad !== nextProps.showKeypad;
    }

    return inputIsDifferent;
  }

  render() {
    const {
      classNames,
      keypadMode,
      allowAnswerBlock,
      controlledKeypad,
      showKeypad,
      latex,
      onFocus,
      classes
    } = this.props;
    const shouldShowKeypad =
      !controlledKeypad || (controlledKeypad && showKeypad);

    log('[render]', latex);

    return (
      <div className={classes.mathToolbar}>
        <MathQuillEditor
          onFocus={onFocus}
          className={cx(classes.mathEditor, classNames.editor)}
          ref={r => (this.input = r)}
          latex={latex}
          onChange={this.onEditorChange}
        />
        {allowAnswerBlock && (
          <Button
            className={classes.addAnswerBlockButton}
            type="primary"
            style={{ bottom: shouldShowKeypad ? '403px' : '20px' }}
            onClick={this.onAnswerBlockClick}
          >
            + Response Area
          </Button>
        )}
        <hr className={classes.hr} />
        {shouldShowKeypad && (
          <HorizontalKeypad mode={keypadMode} onClick={this.onClick} />
        )}
      </div>
    );
  }
}

const styles = theme => ({
  mathEditor: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
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
    zIndex: 10,
    position: 'relative',
    textAlign: 'center',
    '& > .mq-math-mode': {
      border: 'solid 0px lightgrey',
      '& .mq-non-leaf': {
        alignItems: 'center'
      },
      '& .mq-paren': {
        verticalAlign: 'middle'
      }
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `dotted 1px ${theme.palette.primary.main}`,
      borderRadius: '0px'
    }
  }
});

export default withStyles(styles)(EditorAndPad);
