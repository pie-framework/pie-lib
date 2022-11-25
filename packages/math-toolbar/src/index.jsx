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
    autoFocus: PropTypes.bool,
    allowAnswerBlock: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    controlledKeypadMode: PropTypes.bool,
    keypadMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    classNames: PropTypes.object,
    showKeypad: PropTypes.bool,
    noDecimal: PropTypes.bool,
    additionalKeys: PropTypes.array,
    latex: PropTypes.string.isRequired,
    onAnswerBlockAdd: PropTypes.func,
    onChange: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    hideDoneButton: PropTypes.bool,
  };

  static defaultProps = {
    classNames: {},
    keypadMode: 'item-authoring',
    autoFocus: false,
    allowAnswerBlock: false,
    controlledKeypad: false,
    controlledKeypadMode: false,
    noDecimal: false,
    showKeypad: true,
    additionalKeys: [],
    onChange: () => {},
    onAnswerBlockAdd: () => {},
    onFocus: () => {},
    hideDoneButton: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      latex: props.latex,
    };
  }

  done = () => {
    this.props.onDone(this.state.latex);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ latex: nextProps.latex });
  }

  onChange = (latex) => {
    this.setState({ latex });
    this.props.onChange(latex);
  };

  render() {
    const { latex } = this.state;
    const {
      classNames,
      autoFocus,
      allowAnswerBlock,
      onAnswerBlockAdd,
      controlledKeypad,
      controlledKeypadMode,
      keypadMode,
      noDecimal,
      additionalKeys,
      showKeypad,
      onFocus,
      onBlur,
      hideDoneButton,
      error,
      maxResponseAreas,
    } = this.props;

    return (
      <PureToolbar
        autoFocus={autoFocus}
        classNames={classNames}
        onAnswerBlockAdd={onAnswerBlockAdd}
        allowAnswerBlock={allowAnswerBlock}
        latex={latex}
        additionalKeys={additionalKeys}
        noDecimal={noDecimal}
        keypadMode={keypadMode}
        onChange={this.onChange}
        onDone={this.done}
        onFocus={onFocus}
        onBlur={onBlur}
        showKeypad={showKeypad}
        controlledKeypad={controlledKeypad}
        controlledKeypadMode={controlledKeypadMode}
        hideDoneButton={hideDoneButton}
        error={error}
        maxResponseAreas={maxResponseAreas}
      />
    );
  }
}

export class RawPureToolbar extends React.Component {
  static propTypes = {
    classNames: PropTypes.object,
    latex: PropTypes.string.isRequired,
    keypadMode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideInput: PropTypes.bool,
    noLatexHandling: PropTypes.bool,
    layoutForKeyPad: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onAnswerBlockAdd: PropTypes.func,
    additionalKeys: PropTypes.array,
    onFocus: PropTypes.func,
    classes: PropTypes.object.isRequired,
    autoFocus: PropTypes.bool,
    noDecimal: PropTypes.bool,
    allowAnswerBlock: PropTypes.bool,
    controlledKeypad: PropTypes.bool,
    controlledKeypadMode: PropTypes.bool,
    showKeypad: PropTypes.bool,
    hideDoneButton: PropTypes.bool,
  };

  render() {
    const {
      classNames,
      autoFocus,
      allowAnswerBlock,
      onAnswerBlockAdd,
      controlledKeypad,
      controlledKeypadMode,
      additionalKeys,
      showKeypad,
      keypadMode,
      noDecimal,
      hideInput,
      noLatexHandling,
      layoutForKeyPad,
      latex,
      onChange,
      onDone,
      onFocus,
      onBlur,
      hideDoneButton,
      classes,
      error,
      maxResponseAreas,
    } = this.props;

    return (
      <div className={cx(classes.pureToolbar, (classNames || {}).toolbar)}>
        <div />
        <EditorAndPad
          autoFocus={autoFocus}
          keypadMode={keypadMode}
          classNames={classNames || {}}
          controlledKeypad={controlledKeypad}
          controlledKeypadMode={controlledKeypadMode}
          noDecimal={noDecimal}
          hideInput={hideInput}
          noLatexHandling={noLatexHandling}
          layoutForKeyPad={layoutForKeyPad}
          showKeypad={showKeypad}
          additionalKeys={additionalKeys}
          allowAnswerBlock={allowAnswerBlock}
          onAnswerBlockAdd={onAnswerBlockAdd}
          latex={latex}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          error={error}
          maxResponseAreas={maxResponseAreas}
        />
        {(!controlledKeypad || (controlledKeypad && showKeypad)) && !hideDoneButton && <DoneButton onClick={onDone} />}
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
  },
});

export const PureToolbar = withStyles(styles)(RawPureToolbar);
