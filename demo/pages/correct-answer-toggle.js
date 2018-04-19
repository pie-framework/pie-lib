import Checkbox from 'material-ui/Checkbox';
import React from 'react';
import Toggle from '@pie-lib/correct-answer-toggle';
import { withStyles } from 'material-ui/styles';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';

import withRoot from '../src/withRoot';

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: true
    };
  }

  onToggle() {
    this.setState({ toggled: !this.state.toggled });
  }

  onShow() {
    this.setState({ show: !this.state.show });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title">CorrectAnswerToggle</Typography>
        <Typography variant="body1">
          Used when you want to allow the user to see a correct answer
        </Typography>
        <hr />
        <FormGroup row>
          <FormControlLabel
            label="Show"
            control={
              <Checkbox
                checked={this.state.show}
                onClick={this.onShow.bind(this)}
              />
            }
          />
          <FormControlLabel
            label="Toggle"
            control={
              <Checkbox
                checked={this.state.toggled}
                onClick={this.onToggle.bind(this)}
              />
            }
          />
        </FormGroup>
        <Toggle
          show={this.state.show}
          toggled={this.state.toggled}
          onToggle={this.onToggle.bind(this)}
        />
        <div hidden={!this.state.show}>
          You can set the color of the label by using{' '}
          <code>--correct-answer-toggle-label-color</code> css variable
        </div>
        <Toggle
          className={classes.redLabel}
          show={this.state.show}
          toggled={this.state.toggled}
          onToggle={this.onToggle.bind(this)}
        />
      </div>
    );
  }
}

export default withRoot(
  withStyles({
    root: {
      backgroundColor: 'blue'
    },
    redLabel: {
      '--correct-answer-toggle-label-color': 'red'
    }
  })(Wrapper)
);
