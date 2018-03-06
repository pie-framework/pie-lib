import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from 'material-ui/Typography';
import cloneDeep from 'lodash/cloneDeep';
import { withStyles } from 'material-ui/styles';
import debug from 'debug';
import Row from './row';

const log = debug('@pie-elements:scoring-config:scoring-config-row');

export class Rows extends React.Component {

  constructor(props) {
    super(props);
    this.addRow = this.addRow.bind(this);
  }

  onRowChange(index, row) {
    const { partialScoring } = this.props;
    const ps = cloneDeep(partialScoring);
    ps.splice(index, 1, row);
    this.props.onChange(ps);
  }

  onDelete(index) {
    const { partialScoring } = this.props;
    const ps = cloneDeep(partialScoring);
    ps.splice(index, 1);
    this.props.onChange(ps);
  }

  addRow() {
    const { partialScoring, onChange } = this.props;
    const ps = cloneDeep(partialScoring);
    ps.push({
      numberOfCorrect: 1,
      scorePercentage: 50
    });
    onChange(ps);
  }

  render() {
    const { partialScoring, numberOfCorrectResponses, classes } = this.props;
    const maxAnswers = Math.max(1, numberOfCorrectResponses - 1);
    const canAddRow = partialScoring ? partialScoring.length < maxAnswers : true;

    log('partialScoring: ', partialScoring);

    return (
      <div>
        {partialScoring.map((row, index) => (
          <Row
            {...row}
            onRowChange={(row) => this.onRowChange(index, row)}
            onDelete={() => this.onDelete(index)}
            maxAnswers={maxAnswers}
            deletable={true}
            key={index} />
        ))}
        <Button
          className={classes.addButton}
          disabled={!canAddRow}
          variant="raised"
          color="primary"
          onClick={this.addRow}>
          {partialScoring.length > 0 ? 'Add another scenario' : 'Add scenario'}
        </Button>
      </div>
    );
  }
}

const styles = theme => ({
  addButton: {
    marginTop: theme.spacing.unit * 2
  }
});

Rows.propTypes = {
  numberOfCorrectResponses: PropTypes.number.isRequired,
  partialScoring: PropTypes.arrayOf(PropTypes.shape({
    numberOfCorrect: PropTypes.number.isRequired,
    scorePercentage: PropTypes.number.isRequired
  })),
  onChange: PropTypes.func.isRequired
}

Rows.defaultProps = {
  partialScoring: []
}

export default withStyles(styles)(Rows);

