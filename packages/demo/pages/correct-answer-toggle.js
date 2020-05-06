import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import Toggle from '@pie-lib/correct-answer-toggle';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import withRoot from '../src/withRoot';

export class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
      show: false,
      showTwo: true,
      toggledTwo: true
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
    const { classes } = this.props;
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
          <Toggle
            show={this.state.showTwo}
            toggled={this.state.toggledTwo}
            onToggle={this.onToggle.bind(this)}
          />
        </div>
      </div>
    ) : (
      <div>loading...</div>
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
