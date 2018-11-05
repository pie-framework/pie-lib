import React from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../src/withRoot';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import areValuesEqual from '../../../packages/math-evaluator/src/index';
// import mathExpressions from 'math-expressions';
// import escapeLatex from 'escape-latex';
// import sanitizeLatex from 'sanitize-latex';
import katex from 'katex';

require('katex/dist/katex.css');

let renderMathInElement = () => {};

if (typeof window !== 'undefined') {
  //Auto render requires the katex global
  window.katex = katex;
  renderMathInElement = require('katex/dist/contrib/auto-render.min');
}

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

const html = '<div><span data-latex="">\\(\\frac{1}{2}\\)</span></div>';

class RawMarkupPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired
  };

  componentDidUpdate() {
    if (this.preview) {
      renderMathInElement(this.preview, renderOpts);
    }
  }

  componentDidMount() {
    if (this.preview) {
      renderMathInElement(this.preview, renderOpts);
    }
  }

  render() {
    const { markup, classes } = this.props;
    return (
      <div>
        <Typography variant="title">Markup</Typography>
        <div
          ref={r => (this.preview = r)}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <hr />
        <Typography variant="subheading">Raw</Typography>
        <pre className={classes.prettyPrint}>{markup}</pre>
        <hr />
      </div>
    );
  }
}
const MarkupPreview = withStyles(() => ({
  prettyPrint: {
    whiteSpace: 'normal',
    width: '100%'
  }
}))(RawMarkupPreview);

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equal: true,
      exprOne: '',
      exprTwo: '',
      inverse: false,
      markupOne: html,
      markupTwo: html,
      showHighlight: false,
      disabled: false,
      width: '',
      height: ''
    };
  }

  onChange = input => markup => {
    this.setState({ [input]: markup });
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  isResponseCorrect = (exprOne, exprTwo) => {
    this.setState({ equal: areValuesEqual(exprOne, exprTwo, { inverse: this.state.inverse }) });
  };

  render() {
    const {
      markupOne,
      markupTwo,
      showHighlight,
      disabled,
      width,
      height,
      mounted,
      equal,
      inverse
    } = this.state;

    return mounted ? (
      <div>
        <div>
          <p>This is a math expression equality evaluator tool</p>
        </div>
        <div>
          <p>This is a checkbox to toggle inverse values for evaluation results</p>
          <label>
            {' '}
            Inverse
            <input
              type="checkbox"
              checked={inverse}
              onChange={() => this.setState({ inverse: !this.state.inverse })}
            />
          </label>
        </div>
        <br />
        <div>
          <Input
            label="Expression One"
            value={this.state.exprOne}
            onChange={evt => this.setState({ exprOne: evt.target.value })}
          />
          <br />
          <br />
          <Input
            label="Expression Two"
            value={this.state.exprTwo}
            onChange={evt => this.setState({ exprTwo: evt.target.value })}
          />
          <br />
          <br />
          <Button onClick={() => this.isResponseCorrect(this.state.exprOne, this.state.exprTwo)}>Evaluate</Button>
        </div>
        <Typography>Values are: <b>{equal ? ' EQUAL ' : ' NOT EQUAL '}</b></Typography>
        <div>
          <EditableHtml
            markup={markupOne}
            onChange={this.onChange('markupOne')}
            disabled={disabled}
            highlightShape={showHighlight}
            width={width}
            height={height}
          />
          <br />
          <MarkupPreview markup={markupOne} />
          <br />
          <br />
          <br />
          <EditableHtml
            markup={markupTwo}
            onChange={this.onChange('markupTwo')}
            disabled={disabled}
            highlightShape={showHighlight}
            width={width}
            height={height}
          />
          <br />
          <MarkupPreview markup={markupTwo} />
          {markupTwo.toString()}
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

const styles = theme => ({
  sizeInput: {
    width: '60px',
    paddingLeft: theme.spacing.unit * 2
  }
});

export default withRoot(withStyles(styles)(Demo));
