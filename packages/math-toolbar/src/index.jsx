import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import EditorAndPad from './editor-and-pad';
import { DoneButton } from './done-button';
import { withStyles } from '@material-ui/core/styles';
import MathPreview from './math-preview';

export { MathPreview };

export class MathToolbar extends React.Component {
  static propTypes = {
    allowAnswerBlock: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    keypadMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classNames: PropTypes.object,
    showKeypad: PropTypes.bool,
    latex: PropTypes.string.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    onFocus: PropTypes.func
  };

  static defaultProps = {
    classNames: {},
    keypadMode: 'everything',
    allowAnswerBlock: false,
    controlledKeypad: false,
    showKeypad: true,
    onChange: () => {},
    onAnswerBlockAdd: () => {},
    onFocus: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      latex: props.latex
    };
  }

  done = () => {
    this.props.onDone(this.state.latex);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ latex: nextProps.latex });
  }

  onChange = latex => {
    this.setState({ latex });
    this.props.onChange(latex);
  };

  render() {
    const { latex } = this.state;
    const {
      classNames,
      allowAnswerBlock,
      onAnswerBlockAdd,
      controlledKeypad,
      keypadMode,
      showKeypad,
      onFocus
    } = this.props;

    return (
      <PureToolbar
        classNames={classNames}
        onAnswerBlockAdd={onAnswerBlockAdd}
        allowAnswerBlock={allowAnswerBlock}
        latex={latex}
        keypadMode={keypadMode}
        onChange={this.onChange}
        onDone={this.done}
        onFocus={onFocus}
        showKeypad={showKeypad}
        controlledKeypad={controlledKeypad}
      />
    );
  }
}

export class RawPureToolbar extends React.Component {
  static propTypes = {
    classNames: PropTypes.object,
    latex: PropTypes.string.isRequired,
    keypadMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onFocus: PropTypes.func,
    classes: PropTypes.object.isRequired,
    allowAnswerBlock: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    showKeypad: PropTypes.bool
  };

  render() {
    const {
      classNames,
      allowAnswerBlock,
      onAnswerBlockAdd,
      controlledKeypad,
      showKeypad,
      keypadMode,
      latex,
      onChange,
      onDone,
      onFocus,
      classes
    } = this.props;

    return (
      <div className={cx(classes.pureToolbar, classNames.toolbar)}>
        <div />
        <EditorAndPad
          keypadMode={keypadMode}
          classNames={classNames}
          controlledKeypad={controlledKeypad}
          showKeypad={showKeypad}
          allowAnswerBlock={allowAnswerBlock}
          onAnswerBlockAdd={onAnswerBlockAdd}
          latex={latex}
          onChange={onChange}
          onFocus={onFocus}
        />
        <DoneButton onClick={onDone} />
      </div>
    );
  }
}
const styles = () => ({
  pureToolbar: {
    display: 'flex',
    width: '100%',
    zIndex: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export const PureToolbar = withStyles(styles)(RawPureToolbar);
