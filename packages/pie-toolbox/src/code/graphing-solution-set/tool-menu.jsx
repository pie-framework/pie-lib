import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

export class ToolMenu extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    gssLineData: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  render() {
    let { classes, gssLineData, disabled } = this.props;

    return (
      <div className={classes.selectLineRadioGroup}>
        <div className={classes.radioFieldOuter}>
          <div className={classes.radioFieldInner}>
            <Radio
              name={'select-line-radio-buttons'}
              onChange={this.onChangeRadioValue}
              value={'lineA'}
              disabled={!!disabled}
              checked={gssLineData.selectedTool === 'lineA'}
            />
            <Typography className={classes.lineNameFont}>LINE A</Typography>
          </div>
          <div className={classes.radioFieldButtons}>
            {gssLineData.lineA.lineType === 'Solid' ? (
              <Button
                size={'small'}
                variant={'contained'}
                color={'primary'}
                onClick={() => this.lineTypeChange('A', 'Solid')}
                className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
              >
                Solid
              </Button>
            ) : (
              <Button
                size={'small'}
                variant={'contained'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Solid')}
                className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
              >
                Solid
              </Button>
            )}
            {gssLineData.lineA.lineType === 'Dashed' ? (
              <Button
                size={'small'}
                variant={'contained'}
                color={'primary'}
                onClick={() => this.lineTypeChange('A', 'Dashed')}
                className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
              >
                Dashed
              </Button>
            ) : (
              <Button
                size={'small'}
                variant={'contained'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Dashed')}
                className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
              >
                Dashed
              </Button>
            )}
          </div>
        </div>
        {gssLineData.numberOfLines === 2 ? (
          <div className={classes.radioFieldOuter}>
            <div className={classes.radioFieldInner}>
              <Radio
                name={'select-line-radio-buttons'}
                onChange={this.onChangeRadioValue}
                value={'lineB'}
                disabled={!!disabled}
                checked={gssLineData.selectedTool === 'lineB'}
              />
              <Typography className={classes.lineNameFont}>LINE B</Typography>
            </div>
            <div className={classes.radioFieldButtons}>
              {gssLineData.lineB.lineType === 'Solid' ? (
                <Button
                  size={'small'}
                  variant={'contained'}
                  color={'primary'}
                  onClick={() => this.lineTypeChange('B', 'Solid')}
                  className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
                >
                  Solid
                </Button>
              ) : (
                <Button
                  size={'small'}
                  variant={'contained'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Solid')}
                  className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
                >
                  Solid
                </Button>
              )}
              {gssLineData.lineB.lineType === 'Dashed' ? (
                <Button
                  size={'small'}
                  variant={'contained'}
                  color={'primary'}
                  onClick={() => this.lineTypeChange('B', 'Dashed')}
                  className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
                >
                  Dashed
                </Button>
              ) : (
                <Button
                  size={'small'}
                  variant={'contained'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Dashed')}
                  className={disabled ? classes.lineTypeButtonDisabled : classes.lineTypeButton}
                >
                  Dashed
                </Button>
              )}
            </div>
          </div>
        ) : null}
        <div className={classes.radioFieldOuter}>
          <div className={classes.radioFieldInner}>
            <Radio
              name={'select-line-radio-buttons'}
              onChange={this.onChangeRadioValue}
              value={'solutionSet'}
              disabled={!!disabled}
              checked={gssLineData.selectedTool === 'solutionSet'}
            />
            <Typography className={classes.lineNameFont}>SOLUTION SET</Typography>
          </div>
        </div>
      </div>
    );
  }

  onChangeRadioValue = (event) => {
    let { gssLineData, onChange } = this.props;
    let oldSelectedTool = gssLineData.selectedTool;
    gssLineData.selectedTool = event.target.value;
    onChange(gssLineData, oldSelectedTool);
  };

  lineTypeChange = (line, type) => {
    let { gssLineData, onChange } = this.props;
    let oldSelectedTool = gssLineData.selectedTool;
    gssLineData[`line${line}`].lineType = type;
    onChange(gssLineData, oldSelectedTool);
  };
}

const styles = (theme) => ({
  radioButtonClass: {},
  selectLineRadioGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  radioFieldInner: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioFieldOuter: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  radioFieldButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: '0 .9rem',
  },
  lineTypeText: {
    marginLeft: '.7rem',
  },
  lineNameFont: {
    fontWeight: 'bold',
    padding: '0 5px 0 0',
  },
  lineTypeButton: {
    textTransform: 'none',
    border: '1.5px solid #3f51b5',
    borderRadius: '0',
  },
  lineTypeButtonDisabled: {
    textTransform: 'none',
    border: '1.5px solid #3f51b5',
    cursor: 'default',
    pointerEvents: 'none',
    borderRadius: '0',
  },
});

export default withStyles(styles)(ToolMenu);
