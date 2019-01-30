import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import { set } from './nested-setter-getter';
import ChartType from './chart-type';
import Category from './category';
import Nt from './nt';

export class Options extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {};

  change = (key, value) => {
    const { onChange, model } = this.props;
    const out = { ...model };
    set(out, key, value);
    onChange(out);
  };

  changeCategory = (index, label, value) => {
    const { model, onChange } = this.props;
    const { data } = model;
    const update = [...data];
    update[index].label = label;
    update[index].value = value;
    onChange({ ...model, data: update });
  };

  getValue = category => {
    const { model } = this.props;
    const m = model.data.find(d => d.category === category);
    return m.value;
  };

  changeNumberOfCategories = count => {
    const { model, onChange } = this.props;
    const { data } = model;
    if (count === data.length) {
      return;
    } else if (count > data.length) {
      const update = data.concat([{ label: '', value: model.range.min }]);
      onChange({ ...model, data: update });
    } else if (count < data.length) {
      const update = [...data];
      update.pop();
      onChange({ ...model, data: update });
    }
  };

  render() {
    const { classes, className, model } = this.props;
    return (
      <div className={classNames(classes.options, className)}>
        <ChartType value={model.chartType} />
        <TextField
          variant="outlined"
          label="Chart Title"
          className={classNames(classes.textField, classes.title)}
          value={model.title}
          onChange={e => this.change('title', e.target.value)}
        />
        <div className={classes.row}>
          <TextField
            className={classes.textField}
            label="X axis label"
            variant="outlined"
            value={model.domain.label}
            onChange={e => this.change('domain.label', e.target.value)}
          />
          <TextField
            label="Y axis label"
            className={classes.textField}
            variant="outlined"
            value={model.range.label}
            onChange={e => this.change('range.label', e.target.value)}
          />
        </div>
        <Nt
          label="Max Y Value"
          className={classes.textField}
          value={model.range.max}
          onChange={v => this.change('range.max', v)}
        />

        <Typography variant="subtitle2">Define Categories</Typography>
        <Nt
          label="Number of categories"
          className={classes.textField}
          value={model.data.length}
          onChange={this.changeNumberOfCategories}
        />
        {(model.data || []).map((d, index) => (
          <Category
            label={d.label}
            value={d.value}
            key={index}
            index={index}
            // key={`${d.label || ''}_${d.value}_${index}`}
            onChange={(label, value) =>
              this.changeCategory(index, label, value)
            }
          />
        ))}
      </div>
    );
  }
}
const styles = theme => ({
  title: {
    width: '100%'
  },
  textField: {
    marginTop: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Options);
