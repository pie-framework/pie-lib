import React from 'react';
import { withStyles } from 'material-ui/styles';

class CodeEditor extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = (e) => {
      this.props.onChange(e.target.value);
    }
  }

  render() {
    const { latex, classes, onBlur } = this.props;
    return <textarea
      tabIndex={'-1'}
      value={latex}
      onChange={this.onChange}
      className={classes.root}
      onBlur={onBlur}></textarea>;
  }
}

const StyledCodeEditor = withStyles(
  {
    root: {
      gridColumn: '1/8',
      gridRow: '2/5',
      resize: 'none',
      border: 'none',
      backgroundColor: '#cceeff',
      padding: '10px',
      fontSize: '15px',
      '&:focus': {
        outline: 'none',
        backgroundColor: '#ddffff'
      }
    }
  }, { name: 'CodeEditor' })(CodeEditor);

export default StyledCodeEditor;