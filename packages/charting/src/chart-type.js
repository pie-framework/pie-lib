import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const ChartType = withStyles(() => ({
  chartType: {
    width: '160px',
  },
  chartTypeLabel: {
    backgroundColor: 'transparent',
  },
}))(({ onChange, value, classes, availableChartTypes, chartTypeLabel }) => (
  <div className={classes.chartType}>
    <FormControl variant={'outlined'} className={classes.chartType}>
      <InputLabel htmlFor="type-helper" className={classes.chartTypeLabel}>
        {chartTypeLabel}
      </InputLabel>

      <Select value={value} onChange={onChange} labelWidth={0} input={<OutlinedInput name="type" id="type-helper" />}>
        {availableChartTypes.histogram && <MenuItem value={'histogram'}>{availableChartTypes.histogram}</MenuItem>}
        {availableChartTypes.bar && <MenuItem value={'bar'}>{availableChartTypes.bar}</MenuItem>}
        {availableChartTypes.lineDot && <MenuItem value={'lineDot'}>{availableChartTypes.lineDot}</MenuItem>}
        {availableChartTypes.lineCross && <MenuItem value={'lineCross'}>{availableChartTypes.lineCross}</MenuItem>}
        {availableChartTypes.dotPlot && <MenuItem value={'dotPlot'}>{availableChartTypes.dotPlot}</MenuItem>}
        {availableChartTypes.linePlot && <MenuItem value={'linePlot'}>{availableChartTypes.linePlot}</MenuItem>}
      </Select>
    </FormControl>
  </div>
));

export default ChartType;
