import Card, { CardContent } from 'material-ui/Card';
import React from 'react';
import Rows from './scoring-config-rows';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const emptyStyles = {
  root: {
    padding: '20px'
  }
};

const Empty = withStyles(emptyStyles)(({ classes }) => (
  <div className={classes.root}>
    <Typography type="caption">
      You must have more than 1 correct response to set up partial scoring
  </Typography>
  </div>
));


export class PartialScoringConfig extends React.Component {

  render() {
    const {
      numberOfCorrectResponses,
      partialScoring,
      classes,
      onChange } = this.props;

    return <div className={classes.scoringConfig}>
      <Typography type="subheading">Partial Scoring Rules</Typography>
      <br />
      <Typography>
        If there is more than one correct answer to this question, you may allow partial credit based
        on the number of correct answers submitted. This is optional.
      </Typography>
      <br />
      {numberOfCorrectResponses > 1 ? (
        <Rows
          numberOfCorrectResponses={numberOfCorrectResponses}
          partialScoring={partialScoring}
          onChange={onChange}
        />) : <Empty />}
    </div>;
  }
}

export default withStyles({
  scoringConfig: {
    paddingTop: '10px'
  }
})(PartialScoringConfig);