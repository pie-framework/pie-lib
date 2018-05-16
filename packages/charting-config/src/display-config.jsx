import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { InputCheckbox, InputContainer } from '@pie-lib/config-ui';
import Box from './box';

const styles = theme => ({
  optionsCheckbox: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  displayControlsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit
  },
  displayOptionsContainer: {
    display: 'inline-block',
    marginTop: theme.spacing.unit,
    width: '50%'
  },
  displayInput: {
    width: '90%'
  }
});

class DisplayConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    resetToDefaults: PropTypes.func.isRequired
  };

  render() {
    const { classes, config, onChange, resetToDefaults } = this.props;

    return (
      <Box>
        <h2>Display</h2>
        <h4>Graph Labels</h4>
        <div className={classes.displayControlsContainer}>
          <InputContainer label="Top">
            <Input
              className={classes.displayInput}
              type="text"
              onChange={onChange('graphTitle', true)}
              value={config.graphTitle}
              placeholder="Enter Value"
            />
          </InputContainer>
          <InputContainer label="Left">
            <Input
              className={classes.displayInput}
              type="text"
              onChange={onChange('domainLabel', true)}
              value={config.domainLabel}
              placeholder="Enter Value"
            />
          </InputContainer>
          <InputContainer label="Bottom">
            <Input
              className={classes.displayInput}
              type="text"
              onChange={onChange('rangeLabel', true)}
              value={config.rangeLabel}
              placeholder="Enter Value"
            />
          </InputContainer>
        </div>
        <div className={classes.displayControlsContainer}>
          <InputContainer label="Width">
            <Input
              inputProps={{
                step: 10,
                min: 250,
                max: 1000
              }}
              className={classes.displayInput}
              type="number"
              onChange={onChange('graphWidth')}
              value={config.graphWidth}
              placeholder="Enter Value"
            />
          </InputContainer>
          <InputContainer label="Height">
            <Input
              inputProps={{
                step: 10,
                min: 250,
                max: 1000
              }}
              className={classes.displayInput}
              type="number"
              onChange={onChange('graphHeight')}
              value={config.graphHeight}
              placeholder="Enter Value"
            />
          </InputContainer>
        </div>
        <div style={{ display: 'flex' }}>
          <div className={classes.displayOptionsContainer}>
            <div className={classes.optionsCheckbox}>
              <InputCheckbox
                label="Show Point Labels"
                checked={config.showPointLabels}
                onChange={onChange('showPointLabels', true, true)}
              />
            </div>
            <div className={classes.optionsCheckbox}>
              <InputCheckbox
                label="Show Axis Labels"
                checked={config.showAxisLabels}
                onChange={onChange('showAxisLabels', true, true)}
              />
            </div>
          </div>
          <div className={classes.displayOptionsContainer}>
            <div className={classes.optionsCheckbox}>
              <InputCheckbox
                label="Show Point Coordinates"
                checked={config.showCoordinates}
                onChange={onChange('showCoordinates', true, true)}
              />
            </div>
          </div>
        </div>
        <Button onClick={resetToDefaults}>
          <i>Reset to default values</i>
        </Button>
      </Box>
    );
  }
}

export default withStyles(styles)(DisplayConfig);
