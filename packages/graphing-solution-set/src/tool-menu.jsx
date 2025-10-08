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
              className={classes.lineTypeRadio}
            />
            <Typography className={classes.lineNameFont}>Line A</Typography>
          </div>
          <div className={classes.radioFieldButtons}>
            {gssLineData.lineA.lineType === 'Solid' ? (
              <Button
                size={'small'}
                variant={'contained'}
                color={'primary'}
                onClick={() => this.lineTypeChange('A', 'Solid')}
                className={disabled ? classes.lineTypeButtonLeftSelectedDisabled : classes.lineTypeButtonLeftSelected}
              >
                &#x2714; Solid
              </Button>
            ) : (
              <Button
                size={'small'}
                variant={'contained'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Solid')}
                className={
                  disabled ? classes.lineTypeButtonLeftUnSelectedDisabled : classes.lineTypeButtonLeftUnSelected
                }
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
                className={disabled ? classes.lineTypeButtonRightSelectedDisabled : classes.lineTypeButtonRightSelected}
              >
                &#x2714; Dashed
              </Button>
            ) : (
              <Button
                size={'small'}
                variant={'contained'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Dashed')}
                className={
                  disabled ? classes.lineTypeButtonRightUnSelectedDisabled : classes.lineTypeButtonRightUnSelected
                }
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
                className={classes.lineTypeRadio}
              />
              <Typography className={classes.lineNameFont}>Line B</Typography>
            </div>
            <div className={classes.radioFieldButtons}>
              {gssLineData.lineB.lineType === 'Solid' ? (
                <Button
                  size={'small'}
                  variant={'contained'}
                  color={'primary'}
                  onClick={() => this.lineTypeChange('B', 'Solid')}
                  className={disabled ? classes.lineTypeButtonLeftSelectedDisabled : classes.lineTypeButtonLeftSelected}
                >
                  &#x2714; Solid
                </Button>
              ) : (
                <Button
                  size={'small'}
                  variant={'contained'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Solid')}
                  className={
                    disabled ? classes.lineTypeButtonLeftUnSelectedDisabled : classes.lineTypeButtonLeftUnSelected
                  }
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
                  className={
                    disabled ? classes.lineTypeButtonRightSelectedDisabled : classes.lineTypeButtonRightSelected
                  }
                >
                  &#x2714; Dashed
                </Button>
              ) : (
                <Button
                  size={'small'}
                  variant={'contained'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Dashed')}
                  className={
                    disabled ? classes.lineTypeButtonRightUnSelectedDisabled : classes.lineTypeButtonRightUnSelected
                  }
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
              className={classes.lineTypeRadio}
            />
            <Typography className={classes.lineNameFont}>Solution Set</Typography>
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
  lineTypeButtonLeftSelected: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#3E4EB1 !important',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    color: '#FFFFFF !important',
  },
  lineTypeButtonLeftUnSelected: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#FFFFFF !important',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    color: '#3E4EB1 !important',
  },
  lineTypeButtonRightSelected: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#3E4EB1 !important',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    color: '#FFFFFF !important',
  },
  lineTypeButtonRightUnSelected: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#FFFFFF !important',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    color: '#3E4EB1 !important',
  },
  lineTypeRadio: {
    color: '#000000 !important',
  },
  lineTypeButtonLeftSelectedDisabled: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#3E4EB1 !important',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    color: '#FFFFFF !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
  lineTypeButtonLeftUnSelectedDisabled: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#FFFFFF !important',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    color: '#3E4EB1 !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
  lineTypeButtonRightSelectedDisabled: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#3E4EB1 !important',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    color: '#FFFFFF !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
  lineTypeButtonRightUnSelectedDisabled: {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    borderRadius: '0',
    backgroundColor: '#FFFFFF !important',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    color: '#3E4EB1 !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
});

export default withStyles(styles)(ToolMenu);
