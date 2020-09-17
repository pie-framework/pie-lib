import React from 'react';
import PropTypes from 'prop-types';
import withRoot from '../../src/withRoot';
import EditableHtml from '@pie-lib/editable-html';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import areValuesEqual from '@pie-lib/math-evaluator';
import mathExpressions from '@pie-framework/math-expressions';
import debug from 'debug';
import jsesc from 'jsesc';

const log = debug('demo:math-evaluator');

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

const html = '<div><span data-latex=""></span></div>';

class RawMarkupPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired
  };

  render() {
    const { markup, classes } = this.props;
    return (
      <div>
        <Typography variant="h6">Markup</Typography>
        <div ref={r => (this.preview = r)} dangerouslySetInnerHTML={{ __html: markup }} />
        <hr />
        <Typography variant="subtitle1">Raw</Typography>
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

const EscapeInput = props => (
  <div>
    Input:
    <br />
    <textarea style={{ width: '100%' }} type="text" value={props.value} onChange={props.onChange} />
  </div>
);

const escape = s => jsesc(s);

const expr = s => {
  try {
    return mathExpressions.fromLatex(s).toString();
  } catch (e) {
    log('math expression error: ', e.message);
    return '';
  }
};

const EscapePreview = props => (
  <div>
    <div>
      raw: <pre>{props.value}</pre>
    </div>
    <div>
      escaped: <pre>{escape(props.value)}</pre>
    </div>
    <div>
      expr: <pre>{expr(props.value)}</pre>
    </div>
  </div>
);

class EscapeDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '1^{12^{2^{2^3}}}+3_4 + \\frac{1}{2}+4',
      two: '1^{12^{2^{2^3}}}+3_4 + \\frac{1}{2}+4',
      equal: true
    };
  }

  onChange = id => e => {
    const other = id === 'one' ? 'two' : 'one';
    let equal = false;
    try {
      const escapeA = escape(e.target.value);
      const escapeB = escape(this.state[other]);
      log('a: ', escapeA, 'b: ', escapeB);
      equal = areValuesEqual(expr(e.target.value), expr(this.state[other]));
    } catch (e) {
      log('error: ', e.message);
    }

    this.setState({
      [id]: e.target.value,
      equal
    });
  };

  render() {
    return (
      <div>
        <h4>Escape demo..</h4>
        <EscapeInput value={this.state.one} onChange={this.onChange('one')} />
        <EscapePreview value={this.state.one} />
        <br />
        <br />
        <EscapeInput value={this.state.two} onChange={this.onChange('two')} />
        <EscapePreview value={this.state.two} />
        <h1 style={{ color: this.state.equal ? 'green' : 'red' }}>
          {this.state.equal ? 'EQUAL' : 'NOT EQUAL'}
        </h1>
      </div>
    );
  }
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equal: true,
      exprOne: '',
      exprTwo: '',
      inverse: false,
      isLatex: true,
      exampleMarkup: html,
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
    this.setState({
      equal: areValuesEqual(exprOne, exprTwo, {
        inverse: this.state.inverse,
        isLatex: this.state.isLatex
      })
    });
  };

  render() {
    const {
      exampleMarkup,
      showHighlight,
      disabled,
      width,
      height,
      mounted,
      equal,
      inverse,
      isLatex
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
          <p>
            This is a checkbox to indicate whether the compared values will be latex format or not
          </p>
          <label>
            {' '}
            Latex Values
            <input
              type="checkbox"
              checked={isLatex}
              onChange={() => this.setState({ isLatex: !this.state.isLatex })}
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
          <Button onClick={() => this.isResponseCorrect(this.state.exprOne, this.state.exprTwo)}>
            Evaluate
          </Button>
        </div>
        <Typography>
          Values are: <b>{equal ? ' EQUAL ' : ' NOT EQUAL '}</b>
        </Typography>
        <div>
          <EditableHtml
            markup={exampleMarkup}
            onChange={this.onChange('exampleMarkup')}
            disabled={disabled}
            highlightShape={showHighlight}
            width={width}
            height={height}
          />
          <br />
          <MarkupPreview markup={exampleMarkup} />
        </div>
        <EscapeDemo />
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
