import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';
import { Button, Typography } from '@material-ui/core';

const log = debug('demo:math-evaluator');

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

const math = `<math xmlns="http://www.w3.org/1998/Math/MathML">
            <mstack charalign="center" stackalign="right">
              <mn>358999</mn>
              <msrow>
                <mo>+</mo>
                <mn>223</mn>
              </msrow>
              <msline />
              <msrow />
            </mstack>
          </math>`;

const mathTwo = `<math xmlns="http://www.w3.org/1998/Math/MathML">
<mstack charalign="center" stackalign="right">
   <msrow>
     <mn>1</mn>
     <mo>.</mo>
     <mn>5</mn>
     <none/>
     <none/>
     <none/>
   </msrow>
   <msrow>     
     <mo>+</mo>
     <mn>0</mn>
     <mo>.</mo>
     <mn>0015</mn>
   </msrow>
   <msline/>
   <msrow/>
</mstack>
</math>`;

const Latex = "\\(\\parallelogram\\)";

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mounted: false, mathml: Latex };
  }

  componentDidMount() {
    this.setState({ mounted: true }, () => {
      renderMath(this.root);
    });
  }

  updateMathMl = mathml => {
    this.setState({ mathml }, () => {
      renderMath(this.root);
    });
  };

  render() {
    const { foo, mounted } = this.state;
    const { classes } = this.props;
    return mounted ? (
      <div ref={r => (this.root = r)}>
        <Typography variant="display1">Math Rendering</Typography>
        <hr />
        <div className={classes.holder}>
          <div className={classes.child}>
            <textarea
              value={this.state.mathml}
              onChange={e => this.updateMathMl(e.target.value)}
              className={classes.ta}
            ></textarea>
            <br />
            <Button variant="raised" onClick={this.updateMathJax}>
              Update
            </Button>
          </div>
          <div
            className={classes.child}
            dangerouslySetInnerHTML={{ __html: this.state.mathml }}
          ></div>
        </div>
        <br />
        <br />
        <div>
          {/* <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mfrac>
              <mi>a</mi>
              <mi>b</mi>
            </mfrac>
          </math> */}
          {/* <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mstack charalign="center" stackalign="right">
              <mn>358999</mn>
              <msrow>
                <mo>+</mo>
                <mn>223</mn>
              </msrow>
              <msline />
              <msrow />
            </mstack>
          </math> */}
          <br />
          {/* <span data-latex="" data-raw="4\sqrt{4}">
            4\sqrt{4}
          </span> */}
        </div>
        {/* <div>
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>a</mi>
            <mo>&#x2260;</mo>
            <mn>0</mn>
          </math>
          , there are two solutions to
          <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mi>a</mi>
            <msup>
              <mi>x</mi>
              <mn>2</mn>
            </msup>
            <mo>+</mo>
            <mi>b</mi>
            <mi>x</mi>
            <mo>+</mo>
            <mi>c</mi>
            <mo>=</mo>
            <mn>0</mn>
          </math>
          and they are
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <mi>x</mi>
            <mo>=</mo>
            <mrow>
              <mfrac>
                <mrow>
                  <mo>&#x2212;</mo>
                  <mi>b</mi>
                  <mo>&#x00B1;</mo>
                  <msqrt>
                    <msup>
                      <mi>b</mi>
                      <mn>2</mn>
                    </msup>
                    <mo>&#x2212;</mo>
                    <mn>4</mn>
                    <mi>a</mi>
                    <mi>c</mi>
                  </msqrt>
                </mrow>
                <mrow>
                  <mn>2</mn>
                  <mi>a</mi>
                </mrow>
              </mfrac>
            </mrow>
            <mtext>.</mtext>
          </math>
        </div> */}
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
  },
  holder: {
    width: '100%',
    display: 'flex'
  },
  child: {
    flex: 1
  },
  ta: {
    width: '100%',
    height: '100%',
    minHeight: '300px'
  }
});

export default withRoot(withStyles(styles)(Demo));
