import Functions from '@material-ui/icons/Functions';
import { Inline } from 'slate';
import { MathPreview, MathToolbar } from '@pie-lib/math-toolbar';
import { wrapMath, unWrapMath } from '@pie-lib/math-rendering';
import React from 'react';
import debug from 'debug';
import SlatePropTypes from 'slate-prop-types';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';

import { BLOCK_TAGS } from '../../serialization';
import { withStyles } from '@material-ui/core';
const log = debug('@pie-lib:editable-html:plugins:math');

const TEXT_NODE = 3;

const getTagName = el => ((el && el.tagName) || '').toLowerCase();

class RawMathMLPreview extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired
  };

  renderMath() {
    if (this.root) {
      renderMath(this.root);
    }
  }

  componentDidMount() {
    this.renderMath();
  }

  componentDidUpdate() {
    this.renderMath();
  }

  render() {
    console.log('props:', this.props.node);
    const { node, classes } = this.props;
    return (
      <span
        className={classes.mathMlPreview}
        ref={r => (this.root = r)}
        dangerouslySetInnerHTML={{ __html: node.data.get('mathml') }}
      ></span>
    );
  }
}

const MathMLPreview = withStyles(theme => ({
  mathMLPreview: {
    border: 'red'
  }
}))(RawMathMLPreview);

export const serialization = {
  deserialize(el) {
    const tagName = getTagName(el);
    if (tagName === 'math') {
      const mathml = el.outerHTML;

      return {
        object: 'inline',
        isVoid: true,
        type: 'mathml',
        data: { mathml }
      };
    }
  },
  serialize(object) {
    if (object.type === 'mathml') {
      return object.data.get('mathml');
    }
  }
};

export default function MathMLPlugin(opts) {
  return {
    name: 'mathml',
    renderNode: props => {
      if (props.node.type === 'mathml') {
        return <MathMLPreview {...props} />;
      }
    }
  };
}
