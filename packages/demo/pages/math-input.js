import { mq, keysForGrade, keys, KeyPad, HorizontalKeypad } from '@pie-lib/math-input';
import React from 'react';
import withRoot from '../src/withRoot';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import Section from '../src/formatting/section';

console.log('mq:', mq);

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latex: '\\frac{3}{2}',
      readOnly: true,
      editorType: 'geometry',
      labelWidth: 0,
      inputOne: '\\frac{1}{3}',
      latex1: '\\text{$}',
      latex2: '\\\\\\\\text{$}'
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(latex) {
    this.setState({ latex });
  }

  onMathInputClick() {
    console.log('onMathInputClick', arguments);
  }

  onClick(data) {
    console.log('onClick', data.value, data.type);
  }

  onInputChange(latex) {
    console.log('onInputChange', latex);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    // const labelWidth = ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth;
    // this.setState({

    this.setState({ mounted: true });
  }

  changeEditorType = event => {
    this.setState({ editorType: event.target.value });
  };

  /**
   * Todo..
   * * add all the buttons (use a label if no icon)
   * * set up grades
   * * check that each button action works w/ mq
   * * support for var extra key injection
   */
  render() {
    const { classes } = this.props;
    const { readOnly, latex, mounted, editorType } = this.state;
    const keyset = keysForGrade(editorType);
    const customKeyMessage = `
    Setting custom keys is done by setting 'keyset' with an array of row arrays. The object
            should have a 'label' and either 'write' or 'command'.`;

    return mounted ? (
      <div>
        <Section name="Equation editor with presets">
          <br />
          <FormControl variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-age-simple"
            >
              Preset
            </InputLabel>
            <Select
              value={this.state.editorType}
              label={'Preset'}
              onChange={this.changeEditorType}
              input={<OutlinedInput labelWidth={this.state.labelWidth} name="Editor Type" />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}>Grade 1 - 2</MenuItem>
              <MenuItem value={3}>Grade 3 - 5</MenuItem>
              <MenuItem value={6}>Grade 6 - 7</MenuItem>
              <MenuItem value={8}>Grade 8 - HS</MenuItem>
              <MenuItem value={'geometry'}>Geometry</MenuItem>
              <MenuItem value={'advanced-algebra'}>Advanced Algebra</MenuItem>
              <MenuItem value={'statistics'}>Statistics</MenuItem>
              <MenuItem value={'miscellaneous'}>Miscellaneous</MenuItem>
            </Select>
          </FormControl>
          <mq.Input
            keyset={keyset}
            latex={this.state.inputOne}
            onChange={latex => this.setState({ inputOne: latex })}
          />
          <pre className={classes.pre}>{this.state.inputOne}</pre>
          <br />
          <br />
          <br />
          no extra slashes:{' '}
          <mq.Input
            keyset={keyset}
            latex={this.state.latex1}
            onChange={latex => this.setState({ latex1: latex })}
          />{' '}
          - extra slashes:
          <mq.Input
            keyset={keyset}
            latex={this.state.latex2}
            onChange={latex => this.setState({ latex2: latex })}
          />
        </Section>

        <Section name="Custom keys (E261001)">
          <div>{customKeyMessage}</div>
          <mq.Input
            displayMode={'block-on-focus'}
            latex={this.state.inputTwo}
            onChange={latex => this.setState({ inputTwo: latex })}
            keyset={[
              [
                { label: 'a', write: 'a' },
                { label: 'b', write: 'b' },
                { label: 'c', write: 'c' },
                { label: 'y', write: 'y' }
              ],
              [
                keys.misc.parenthesis,
                keys.fractions.xBlankBlank,
                keys.exponent.xToPowerOfN,
                keys.exponent.squareRoot
              ]
            ]}
          />
          <pre className={classes.pre}>{this.state.inputTwo}</pre>
        </Section>

        {/* <Section name="keypad standalone">
          <p>The keypad can be rendered by itself and connected to whatever you like.</p>
        </Section> */}

        <Section name="Horizontal Keypad (for backward compatibility) w/ 4.x">
          <HorizontalKeypad
            onClick={d => {
              console.log('d:', d);
            }}
          />
        </Section>
      </div>
    ) : (
      <div />
    );
  }
}

const Styled = withStyles(theme => ({
  oldK: {
    width: '200px'
  },
  pre: {
    padding: theme.spacing.unit,
    backgroundColor: grey[300]
  },
  iconsHolder: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  iconAndText: {
    padding: theme.spacing.unit
  },
  icon: {
    width: '50px;'
  }
}))(Demo);

export default withRoot(Styled);
