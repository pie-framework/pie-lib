import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import { InputContainer } from '@pie-lib/config-ui';
import Box from './box';

const styles = () => ({
  optionsColumnContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  optionsColumn: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  attributeInput: {
    width: '90%'
  },
  graphAttributesContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
});

class GraphAttributeConfig extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { classes, config, onChange } = this.props;

    return (
      <Box>
        <h2>Graph Attributes</h2>
        <Typography type="body1">
            <span>
              Use this section to setup the graph area. Note: Minimum value may not be greater than 0.
              Maximum value may not be less than 0. Minimum and maximum values can not be equal.
            </span>
        </Typography>
        <h3>Domain (X)</h3>
        <div className={classes.graphAttributesContainer}>
          <div className={classes.optionsColumnContainer}>
            <div className={classes.optionsColumn}>
              <InputContainer label="Minimum Value">
                <Input
                  inputProps={{
                    max: parseInt(config.domainMax, 10) - 1
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainMin')}
                  value={config.domainMin}
                  placeholder="Enter Minimum"
                />
              </InputContainer>
              <InputContainer label="Tick Value">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainStepValue')}
                  value={config.domainStepValue}
                  placeholder="Enter Tick"
                />
              </InputContainer>
              <InputContainer label="Tick Label Frequency">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainLabelFrequency')}
                  value={config.domainLabelFrequency}
                  placeholder="Enter Tick Label Frequency"
                />
              </InputContainer>
            </div>
            <div className={classes.optionsColumn}>
              <InputContainer label="Maximum Value">
                <Input
                  inputProps={{
                    min: parseInt(config.domainMin, 10) + 1
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainMax')}
                  value={config.domainMax}
                  placeholder="Enter Maximum"
                />
              </InputContainer>
              <InputContainer label="Snap Value">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainSnapValue')}
                  value={config.domainSnapValue}
                  placeholder="Enter Snap"
                />
              </InputContainer>
              <InputContainer label="Padding (%)">
                <Input
                  inputProps={{
                    step: 25
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('domainGraphPadding')}
                  value={config.domainGraphPadding}
                  placeholder="Enter Padding"
                />
              </InputContainer>
            </div>
          </div>
        </div>
        <h3>Range (Y)</h3>
        <div className={classes.graphAttributesContainer}>
          <div className={classes.optionsColumnContainer}>
            <div className={classes.optionsColumn}>
              <InputContainer label="Minimum Value">
                <Input
                  inputProps={{
                    max: parseInt(config.rangeMax, 10) - 1
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeMin')}
                  value={config.rangeMin}
                  placeholder="Enter Minimum"
                />
              </InputContainer>
              <InputContainer label="Tick Value">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeStepValue')}
                  value={config.rangeStepValue}
                  placeholder="Enter Tick"
                />
              </InputContainer>
              <InputContainer label="Tick Label Frequency">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeLabelFrequency')}
                  value={config.rangeLabelFrequency}
                  placeholder="Enter Tick Label Frequency"
                />
              </InputContainer>
            </div>
            <div className={classes.optionsColumn}>
              <InputContainer label="Maximum Value">
                <Input
                  inputProps={{
                    min: parseInt(config.rangeMin, 10) + 1
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeMax')}
                  value={config.rangeMax}
                  placeholder="Enter Maximum"
                />
              </InputContainer>
              <InputContainer label="Snap Value">
                <Input
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeSnapValue')}
                  value={config.rangeSnapValue}
                  placeholder="Enter Snap"
                />
              </InputContainer>
              <InputContainer label="Padding (%)">
                <Input
                  inputProps={{
                    step: 25
                  }}
                  className={classes.attributeInput}
                  type="number"
                  onChange={onChange('rangeGraphPadding')}
                  value={config.rangeGraphPadding}
                  placeholder="Enter Padding"
                />
              </InputContainer>
            </div>
          </div>
        </div>
      </Box>
    );
  }
}

export default withStyles(styles)(GraphAttributeConfig);
