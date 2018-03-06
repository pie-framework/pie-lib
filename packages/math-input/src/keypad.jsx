import * as React from 'react';

import Backspace from 'material-ui-icons/Backspace';
import BasicOperatorsPad from './basic-operators';
import Clear from 'material-ui-icons/Clear';
import Code from 'material-ui-icons/Code';
import CodeEditor from './code-editor';
import Down from 'material-ui-icons/KeyboardArrowDown';
import Extras from './extras';
import IconButton from 'material-ui/IconButton';
import Left from 'material-ui-icons/KeyboardArrowLeft';
import NumberPad from './number-pad';
import Right from 'material-ui-icons/KeyboardArrowRight';
import Up from 'material-ui-icons/KeyboardArrowUp';
import { buttonStyle } from './styles';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import debug from 'debug';
import merge from 'lodash/merge';
import { withStyles } from 'material-ui/styles';

const log = debug('math-input:keypad');

const bs = buttonStyle();

const topRowStyle = {
  root: merge({}, bs.root, {
    backgroundColor: '#eaeadf',
    marginRight: '0'
  }),
  label: bs.label,
  hideRoot: merge({}, bs.root, {
    opacity: 0.0
  })
};

const Blank = withStyles(
  {
    root: {
      display: 'inline-block',
      backgroundColor: 'white'
    }
  })(props => <div className={props.classes.root}></div>);

const RawIconButton = (props) => {
  const root = props.hide ? props.classes.hideRoot : props.classes.root;
  return <IconButton
    onClick={props.onClick}
    tabIndex={'-1'}
    classes={
      { root, label: props.classes.label }
    }>{props.children}</IconButton>
}

const Tr = withStyles(topRowStyle, { name: 'TR' })(RawIconButton);

const CodeButton = withStyles(merge({}, topRowStyle, {
  root: {
    backgroundColor: 'pink'
  }
}), { name: 'IconButton' })(RawIconButton);

const cursor = ['Left', 'Right', 'Up', 'Down'];

const icons = {
  Left: Left,
  Right: Right,
  Up: Up,
  Down: Down
}

const TopRow = (props) => (
  <div className={props.className}>
    {cursor.map(c => {
      const Icon = icons[c];
      return <Tr
        hide={props.showingCode}
        key={c} onClick={() => props.onClick(c)}><Icon /></Tr>
    })}
    <Blank />
    <Tr
      hide={props.showingCode}
      onClick={() => props.onClick('Backspace')}>    <Backspace />
    </Tr>
    <Tr
      hide={props.showingCode}
    ><Clear onClick={() => props.onClick('clear')} /></Tr>
    <CodeButton onClick={props.onCodeToggle}><Code /></CodeButton>
  </div>
);

export class Keypad extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showCode: false
    }

    this.onFocus = (e) => {
      log('onFocus', e);
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }

    this.onTopRowClick = (value) => {
      this.props.onClick({
        value,
        type: 'cursor'
      });
    }

    this.onNumberPadClick = (value) => {
      this.props.onClick({
        value
      })
    }

    this.onBasicOperatorsClick = (value) => {
      this.props.onClick({
        value
      })
    }

    this.onExtrasClick = (data) => {
      this.props.onClick(data);
    }

    this.toggleCode = () => {
      this.setState({ showCode: !this.state.showCode }, () => {
        this.props.onToggleCode && this.props.onToggleCode();
      });
    }
  }


  render() {
    const { classes, latex, onChange, onCodeEditorBlur } = this.props;
    const { showCode } = this.state;
    const holderClasses = classNames(classes.padHolder, showCode && classes.hidden);

    return <div
      className={classes.root}
      onFocus={this.onFocus}
      tabIndex={'-1'}>
      <TopRow className={classes.topRow}
        onClick={this.onTopRowClick}
        onCodeToggle={this.toggleCode}
        showingCode={showCode} />
      <CodeEditor
        latex={latex}
        onChange={onChange}
        onBlur={onCodeEditorBlur} />
      <div className={holderClasses}>
        <NumberPad onClick={this.onNumberPadClick} />
        <BasicOperatorsPad onClick={this.onBasicOperatorsClick} />
        <Extras onClick={this.onExtrasClick} />
      </div>
    </div>;
  }
}

const styles = {
  root: {
    minWidth: '350px',
    display: 'grid',
    gridTemplateRows: '1fr 4fr',
    gridColumnGap: '0px',
    '&:focus': {
      outline: 'none'
    }
  },
  hidden: {
    opacity: 0,
    zIndex: -1
  },
  padHolder: {
    display: 'grid',
    gridColumn: '1/8',
    gridRow: '2/5',
    gridTemplateColumns: '3fr 1fr 4fr',
  },
  topRow: {
    gridColumn: '1/8',
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gridRowGap: '0px',
    gridColumnGap: '0px',
  }
}

export default withStyles(styles, { name: 'Keypad' })(Keypad);