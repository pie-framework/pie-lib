import React from 'react';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const ScoringConfigContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

export class PartialScoringConfig extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    partialScoring: PropTypes.bool,
    onChange: PropTypes.func,
  };

  state = {
    checked: false,
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
      checked,
    });
    onChange(checked);
  };

  render() {
    const { label } = this.props;
    const { checked } = this.state;
    const textLabel = label || 'Each correct response is worth 1/X where X is the number of correct answer selections.';

    return (
      <ScoringConfigContainer>
        <Typography variant="h6">Partial Scoring Rules</Typography>
        <br />
        <Typography>{textLabel}</Typography>
        <Checkbox checked={checked} onChange={this.onCheckboxChanged} label={''} />
      </ScoringConfigContainer>
    );
  }
}

export default PartialScoringConfig;
