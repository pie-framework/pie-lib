import React from 'react';
import { mq } from '@pie-lib/math-input';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import debug from 'debug';

const log = debug('pie-lib:demo:math-input');

let registered = false;

const REGEX = /\\embed\{edBlock\}\[(.*?)\]/g;

export class CustomSample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      static: 'n = {\\MathQuillMathField[answerBlock1]{1}}'
    };
  }

  getFieldName = (changeField, fields) => 'answerBlock1';

  onSubFieldFocus = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  render() {
    return (
      <div>
        {this.state.counter}
        <Button
          onClick={() => this.setState({ counter: this.state.counter + 1 })}
        >
          Update counter
        </Button>
        <mq.Static
          latex={this.state.static}
          getFieldName={this.getFieldName}
          onSubFieldFocus={this.onSubFieldFocus}
        />
      </div>
    );
    // log('RENDER!!', this.state.latex);
    // const prepped = this.prepareForStatic(this.state.latex);
    // log('prepped:', prepped);

    // return (
    //   <div ref={r => (this.root = r)}>
    //     foo
    //     <div>The editor with custom embeds:</div>
    //     <Button onClick={() => this.addBlock()}>Add block</Button>
    //     <mq.Input latex={this.state.latex} />
    //     <div>The static math with edit fields with in it.</div>
    //     <mq.Static
    //       latex={prepped}
    //       onSubFieldChange={this.subFieldChanged}
    //       onSubFieldFocus={this.subFieldFocus}
    //       getFieldName={this.getFieldName}
    //     />
    //   </div>
    // );
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
