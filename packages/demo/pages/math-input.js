import {
  MathInput,
  keysForGrade,
  keys,
  KeyPad,
  HorizontalKeypad
} from '@pie-lib/math-input';
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
import CustomSample from './math-input/custom-sample';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latex: '\\frac{3}{2}',
      readOnly: true,
      editorType: 'geometry',
      labelWidth: 0,
      inputOne: '\\frac{1}{3}'
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
    return mounted ? (
      <div>
        <CustomSample />
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
