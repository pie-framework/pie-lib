import React from 'react';
import { mq } from '@pie-lib/math-input';
import { withStyles } from '@material-ui/core';

let registered = false;

const REGEX = /\\embed\{edBlock\}\[(.*)\]/g;

export class CustomSample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      responsone: '\\sqrt{2}',
      //latex: `\\frac{\\MathQuillMathField{1}}{\\MathQuillMathField{3}}`
      latex: `\\frac{\\embed{edBlock}[responsone]}{1}` //`\\frac{\\embed{edBlock}["hi"]}{\\MathQuillMathField{3}}`
    };
  }
  UNSAFE_componentWillMount() {
    const { classes } = this.props;
    if (typeof window !== 'undefined') {
      const MathQuill = require('mathquill');
      let MQ = MathQuill.getInterface(2);
      console.log(Object.keys(MQ));
      if (!registered) {
        MQ.registerEmbed('edBlock', data => {
          console.log(data);
          // const o = JSON.parse(data);
          return {
            htmlString: `<span id="${data}" class="${
              classes.edBlock
            }">--ed-block!--</span>`,
            text: () => 'text',
            latex: () => '' //embed{edBlock}["this is a test"]'
          };
        });
        registered = true;
      }
    }
  }

  updateEdBlocks() {
    const el = this.root.querySelector('#responsone');

    const MathQuill = require('mathquill');
    let MQ = MathQuill.getInterface(2);
    el.textContent = this.state.responsone;
    MQ.StaticMath(el);
  }
  componentDidUpdate() {
    this.updateEdBlocks();
  }
  componentDidMount() {
    this.updateEdBlocks();
  }

  subFieldChanged(name, subfieldValue) {
    console.log('subfield change..', name, subfieldValue);
  }

  prepareForStatic(ltx) {
    console.log('ltx:', ltx);

    const result = ltx.replace(
      REGEX,
      (match, submatch, offset, wholeString) => {
        return `\\MathQuillMathField[${submatch}]{${this.state[submatch]}}`;
      }
    );
    console.log(result);
    return result;
  }
  getFieldName(changeField, fields) {
    const keys = ['responsone'];
    return keys.find(k => {
      const tf = fields[k];
      return tf && tf.id == changeField.id;
    });
  }
  render() {
    console.log('RENDER!!');
    return (
      <div ref={r => (this.root = r)}>
        foo
        <div>The editor with custom embeds:</div>
        <mq.Input latex={this.state.latex} />
        <div>The static math with edit fields with in it.</div>
        <mq.Static
          latex={this.prepareForStatic(this.state.latex)}
          onSubFieldChange={this.subFieldChanged}
          getFieldName={this.getFieldName}
        />
      </div>
    );
  }
}
export default withStyles(theme => ({
  edBlock: {
    border: `solid 2px ${theme.palette.secondary.main}`,
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    cursor: 'pointer',
    '& .mq-cursor': {
      display: 'none'
    }
  }
}))(CustomSample);
