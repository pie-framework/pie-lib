import { Data } from 'slate';
import { removeBrackets } from '@pie-lib/math-input';

import MathWrapper from './input-wrapper';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import injectSheet from 'react-jss';
import { primary } from '../../theme';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';

const log = debug('editable-html:plugins:math:component');

export class MathComponent extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    editor: PropTypes.shape({
      value: SlatePropTypes.value.isRequired
    }),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      disableBlur: false
    };
  }

  onFocus = event => {
    log('[onFocus]');
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  onBlur = event => {
    log('[onBlur]');
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  onChange = latex => {
    log('[onChange]', latex);
    const { node, editor } = this.props;
    const { key } = node;
    const data = Data.create({ latex, editing: true });
    const change = editor.value.change().setNodeByKey(key, { data });
    editor.onChange(change);
  };

  onClick = event => {
    log('[onClick] preventDefault and stopPropagation');
    if (this.props.onClick) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onClick();
    }
  };

  onDeleteClick = event => {
    log('delete click');
    event.preventDefault();
    event.stopPropagation();

    const { node, editor } = this.props;

    const change = editor.value.change().moveNodeByKey(node.key);
    editor.onChange(change);
  };

  componentDidUpdate() {
    log('this.wrapper: ', this.wrapper);
    const { node, editor } = this.props;
    const mathChange = node.data.get('change');

    if (mathChange) {
      const latex = this.wrapper.change(mathChange);

      const data = node.data.toObject();
      delete data.change;
      data.latex = latex;

      log('[componentDidUpdate] new latex: ', data.latex);

      editor.change(c => {
        c.setNodeByKey(node.key, { data });
      });
    }
  }

  componentDidMount() {
    log('this.wrapper: ', this.wrapper);
  }

  shouldComponentUpdate(nextProps) {
    const { node: nextNode } = nextProps;
    const { node } = this.props;
    if (nextNode.data.equals(node.data)) {
      return false;
    }

    if (
      nextNode.data.get('change') === undefined &&
      node.data.get('change') !== undefined
    ) {
      return false;
    }
    return true;
  }

  onMathChange = latex => {
    log('[onMathChange]', latex);
    const { node, editor } = this.props;
    const data = Data.create({ latex });
    editor.change(c => c.setNodeByKey(node.key, { data }));
  };

  blur() {
    log('[blur]');
    this.wrapper && this.wrapper.blur();
  }

  render() {
    const { node, classes, editor } = this.props;
    log(
      '[render] >> node',
      node,
      'editor: ',
      editor,
      'value: ',
      editor.value,
      editor.value.isFocused
    );

    const latex = node.data.get('latex');
    const names = classNames(classes.root);
    const cleanLatex = removeBrackets(latex);

    return (
      <div className={names}>
        <MathWrapper
          ref={r => (this.wrapper = r)}
          latex={cleanLatex}
          editing={true}
          onClick={this.onClick}
          onChange={this.onMathChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    '& > .mq-editable-field': {
      border: 'solid 1px lightgrey'
    },
    '& > .mq-focused': {
      outline: 'none',
      boxShadow: 'none',
      border: `solid 1px ${primary}`,
      borderRadius: '0px'
    }
  },
  selected: {
    border: 'solid 1px red'
  }
};

export default injectSheet(styles)(MathComponent);
