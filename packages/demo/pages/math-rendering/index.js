import React from 'react';
import withRoot from '../../src/withRoot';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { renderMath } from '@pie-lib/math-rendering';

const log = debug('demo:math-evaluator');

const renderOpts = {
  delimiters: [
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false }
  ]
};

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mounted: false };
  }

  componentDidMount() {
    this.setState({ mounted: true }, () => {
      renderMath(this.root);
    });
  }
  render() {
    const { foo, mounted } = this.state;

    return mounted ? (
      <div ref={r => (this.root = r)}>
        Math Rendering
        <div>
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
