import React from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

export class PartialScoringConfig extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    partialScoring: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func
  };

  state = {
    checked: false
  };

  constructor(props) {
    super(props);

    const { partialScoring } = props;

    this.state.checked = partialScoring;
  }

  onCheckboxChanged = () => {
    const checked = !this.state.checked;
    const { onChange } = this.props;

    this.setState({
      checked
    });
    onChange(checked);
  };

  render() {
    const { classes, label } = this.props;
    const { checked } = this.state;
    const textLabel =
      label ||
      'Each correct response is worth 1/X where X is the number of correct answer selections.';

    return (
      <div className={classes.scoringConfig}>
        <Typography type="subheading">Partial Scoring Rules</Typography>
        <br />
        <Typography>{textLabel}</Typography>
        <Checkbox checked={checked} onChange={this.onCheckboxChanged} label={''} />
      </div>
    );
  }
}

export default withStyles({
  scoringConfig: {
    paddingTop: '10px'
  }
})(PartialScoringConfig);
