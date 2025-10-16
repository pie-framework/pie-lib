import Checkbox from '@mui/material/Checkbox';
import React from 'react';
import Toggle from '@pie-lib/correct-answer-toggle';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

import withRoot from '../source/withRoot';

const RedLabelToggle = styled(Toggle)({
  '--correct-answer-toggle-label-color': 'red',
});

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: false,
      showTwo: true,
      toggledTwo: true,
    };
  }

  onToggle() {
    this.setState({ toggled: !this.state.toggled });
  }

  onShow() {
    this.setState({ show: !this.state.show });
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }
  render() {
    const { mounted } = this.state;
    return mounted ? (
      <div>
        <Typography variant="h6">CorrectAnswerToggle</Typography>
        <Typography>Used when you want to allow the user to see a correct answer</Typography>
        <hr />
        <FormGroup row>
          <FormControlLabel
            label="Show"
            control={<Checkbox checked={this.state.show} onClick={this.onShow.bind(this)} />}
          />
          <FormControlLabel
            label="Toggle"
            control={<Checkbox checked={this.state.toggled} onClick={this.onToggle.bind(this)} />}
          />
        </FormGroup>
        <Toggle show={this.state.show} toggled={this.state.toggled} onToggle={this.onToggle.bind(this)} />
        <div hidden={!this.state.show}>
          You can set the color of the label by using <code>--correct-answer-toggle-label-color</code> css variable
        </div>
        <RedLabelToggle show={this.state.show} toggled={this.state.toggled} onToggle={this.onToggle.bind(this)} />

        <div>
          <FormGroup row>
            <FormControlLabel
              label="Show"
              control={
                <Checkbox
                  checked={this.state.showTwo}
                  onClick={() => this.setState({ showTwo: !this.state.showTwo })}
                />
              }
            />
            <FormControlLabel
              label="Toggle"
              control={
                <Checkbox
                  checked={this.state.toggledTwo}
                  onClick={() => this.setState({ toggledTwo: !this.state.toggledTwo })}
                />
              }
            />
          </FormGroup>
          it will be hidden on mount:
          <Toggle show={this.state.showTwo} toggled={this.state.toggledTwo} onToggle={this.onToggle.bind(this)} />
        </div>
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default withRoot(Wrapper);
