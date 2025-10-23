import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';

export class ToolMenu extends React.Component {
  static propTypes = {
    gssLineData: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

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

  render() {
    const { gssLineData, disabled } = this.props;

    return (
      <Root>
        <div className="selectLineRadioGroup">
          {/* LINE A */}
          <div className="radioFieldOuter">
            <div className="radioFieldInner">
              <Radio
                name="select-line-radio-buttons"
                onChange={this.onChangeRadioValue}
                value="lineA"
                disabled={!!disabled}
                checked={gssLineData.selectedTool === 'lineA'}
                className="lineTypeRadio"
              />
              <Typography className="lineNameFont">Line A</Typography>
            </div>
            <div className="radioFieldButtons">
              <Button
                size="small"
                variant="contained"
                color={gssLineData.lineA.lineType === 'Solid' ? 'primary' : 'inherit'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Solid')}
                className={
                  gssLineData.lineA.lineType === 'Solid'
                    ? disabled
                      ? 'lineTypeButtonLeftSelectedDisabled'
                      : 'lineTypeButtonLeftSelected'
                    : disabled
                      ? 'lineTypeButtonLeftUnSelectedDisabled'
                      : 'lineTypeButtonLeftUnSelected'
                }
              >
                {gssLineData.lineA.lineType === 'Solid' && '✔'} Solid
              </Button>

              <Button
                size="small"
                variant="contained"
                color={gssLineData.lineA.lineType === 'Dashed' ? 'primary' : 'inherit'}
                disabled={!!disabled}
                onClick={() => this.lineTypeChange('A', 'Dashed')}
                className={
                  gssLineData.lineA.lineType === 'Dashed'
                    ? disabled
                      ? 'lineTypeButtonRightSelectedDisabled'
                      : 'lineTypeButtonRightSelected'
                    : disabled
                      ? 'lineTypeButtonRightUnSelectedDisabled'
                      : 'lineTypeButtonRightUnSelected'
                }
              >
                {gssLineData.lineA.lineType === 'Dashed' && '✔'} Dashed
              </Button>
            </div>
          </div>

          {/* LINE B (if applicable) */}
          {gssLineData.numberOfLines === 2 && (
            <div className="radioFieldOuter">
              <div className="radioFieldInner">
                <Radio
                  name="select-line-radio-buttons"
                  onChange={this.onChangeRadioValue}
                  value="lineB"
                  disabled={!!disabled}
                  checked={gssLineData.selectedTool === 'lineB'}
                  className="lineTypeRadio"
                />
                <Typography className="lineNameFont">Line B</Typography>
              </div>
              <div className="radioFieldButtons">
                <Button
                  size="small"
                  variant="contained"
                  color={gssLineData.lineB.lineType === 'Solid' ? 'primary' : 'inherit'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Solid')}
                  className={
                    gssLineData.lineB.lineType === 'Solid'
                      ? disabled
                        ? 'lineTypeButtonLeftSelectedDisabled'
                        : 'lineTypeButtonLeftSelected'
                      : disabled
                        ? 'lineTypeButtonLeftUnSelectedDisabled'
                        : 'lineTypeButtonLeftUnSelected'
                  }
                >
                  {gssLineData.lineB.lineType === 'Solid' && '✔'} Solid
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color={gssLineData.lineB.lineType === 'Dashed' ? 'primary' : 'inherit'}
                  disabled={!!disabled}
                  onClick={() => this.lineTypeChange('B', 'Dashed')}
                  className={
                    gssLineData.lineB.lineType === 'Dashed'
                      ? disabled
                        ? 'lineTypeButtonRightSelectedDisabled'
                        : 'lineTypeButtonRightSelected'
                      : disabled
                        ? 'lineTypeButtonRightUnSelectedDisabled'
                        : 'lineTypeButtonRightUnSelected'
                  }
                >
                  {gssLineData.lineB.lineType === 'Dashed' && '✔'} Dashed
                </Button>
              </div>
            </div>
          )}

          {/* SOLUTION SET */}
          <div className="radioFieldOuter">
            <div className="radioFieldInner">
              <Radio
                name="select-line-radio-buttons"
                onChange={this.onChangeRadioValue}
                value="solutionSet"
                disabled={!!disabled}
                checked={gssLineData.selectedTool === 'solutionSet'}
                className="lineTypeRadio"
              />
              <Typography className="lineNameFont">Solution Set</Typography>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}

const Root = styled('div')(() => ({
  '& .selectLineRadioGroup': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  '& .radioFieldOuter': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  '& .radioFieldInner': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '& .radioFieldButtons': {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: '0 .9rem',
  },
  '& .lineNameFont': {
    fontWeight: 'bold',
    padding: '0 5px 0 0',
  },
  '& .lineTypeRadio': {
    color: '#000000 !important',
  },
  '& .lineTypeButtonLeftSelected': {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    backgroundColor: '#3E4EB1 !important',
    color: '#FFFFFF !important',
    borderRadius: '4px 0 0 4px',
  },
  '& .lineTypeButtonLeftUnSelected': {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    backgroundColor: '#FFFFFF !important',
    color: '#3E4EB1 !important',
    borderRadius: '4px 0 0 4px',
  },
  '& .lineTypeButtonRightSelected': {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    backgroundColor: '#3E4EB1 !important',
    color: '#FFFFFF !important',
    borderRadius: '0 4px 4px 0',
  },
  '& .lineTypeButtonRightUnSelected': {
    textTransform: 'none',
    border: '1px solid #3E4EB1',
    backgroundColor: '#FFFFFF !important',
    color: '#3E4EB1 !important',
    borderRadius: '0 4px 4px 0',
  },
  '& .lineTypeButtonLeftSelectedDisabled, & .lineTypeButtonRightSelectedDisabled': {
    backgroundColor: '#3E4EB1 !important',
    color: '#FFFFFF !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
  '& .lineTypeButtonLeftUnSelectedDisabled, & .lineTypeButtonRightUnSelectedDisabled': {
    backgroundColor: '#FFFFFF !important',
    color: '#3E4EB1 !important',
    cursor: 'default',
    pointerEvents: 'none',
  },
}));

export default ToolMenu;
