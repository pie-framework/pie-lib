import React from 'react';
import withRoot from '../../src/withRoot';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import areValuesEqual from '../../../packages/math-evaluator/src/index';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equal: true,
      exprOne: '',
      exprTwo: '',
      inverse: false
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  isResponseCorrect = (exprOne, exprTwo) => {
    this.setState({ equal: areValuesEqual(exprOne, exprTwo, { inverse: this.state.inverse }) });
  };

  render() {
    const { mounted, equal, inverse } = this.state;

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
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}
export default withRoot(Demo);
