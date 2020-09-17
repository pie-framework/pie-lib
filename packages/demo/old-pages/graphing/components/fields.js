import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { types } from '@pie-lib/plot';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

const Nt = withStyles(theme => ({
  nt: {
    marginTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit
  },
  thin: {
    // maxWidth: '100px'
  }
}))(({ className, label, value, onChange, classes, variant }) => (
  <TextField
    label={label}
    className={classNames(classes.nt, classes[variant], className)}
    type="number"
    variant="outlined"
    value={value}
    onChange={e => onChange(parseFloat(e.target.value))}
  />
));

class RawMinMax extends React.Component {
  static propTypes = {
    model: PropTypes.shape(types.BaseDomainRangeType),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
  };

  change = (key, pair) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [key]: pair || 0 });
  };

  render() {
    const { model, label, classes } = this.props;
    return (
      <div>
        <Typography variant="overline">{label}</Typography>
        <div className={classes.minMax}>
          <Nt label="min" value={model.min} variant="thin" onChange={n => this.change('min', n)}/>
          <Nt label="max" value={model.max} variant="thin" onChange={n => this.change('max', n)}/>
        </div>
        <Nt
          label="tick frequency"
          value={model.step}
          className={classes.fill}
          onChange={n => this.change('step', n)}
        />
        <Nt
          label="tick label frequency"
          value={model.labelStep}
          className={classes.fill}
          onChange={n => this.change('labelStep', n)}
        />
        <TextField
          label="axis label"
          value={model.axisLabel}
          className={classes.fill}
          onChange={e => this.change('axisLabel', e.target.value)}
        />
      </div>
    );
  }
}

const MinMax = withStyles(theme => ({
  minMax: {
    display: 'flex',
    flex: '0 0 auto'
  },
  fill: {
    width: '100%'
  }
}))(RawMinMax);

export class RawLabels extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      left: PropTypes.string,
      top: PropTypes.string,
      bottom: PropTypes.string,
      right: PropTypes.string
    }),
    onChange: PropTypes.func,
    classes: PropTypes.object
  };

  static defaultProps = {
    left: '',
    top: '',
    bottom: '',
    right: ''
  };

  change = (key, e) => {
    const { onChange, value } = this.props;
    onChange({ ...value, [key]: e.target.value });
  };

  render() {
    let { value, classes } = this.props;

    value = value || {};
    return (
      <div className={classes.labels}>
        <div className={classes.row}>
          <TextField
            variant="outlined"
            label="left label"
            className={classes.field}
            value={value.left}
            onChange={e => this.change('left', e)}
          />
          <TextField
            variant="outlined"
            className={classNames(classes.field, classes.rightField)}
            label="top label"
            value={value.top}
            onChange={e => this.change('top', e)}
          />
        </div>
        <div className={classes.row}>
          <TextField
            variant="outlined"
            label="bottom label"
            className={classes.field}
            value={value.bottom}
            onChange={e => this.change('bottom', e)}
          />
          <TextField
            variant="outlined"
            className={classNames(classes.field, classes.rightField)}
            label="right label"
            value={value.right}
            onChange={e => this.change('right', e)}
          />
        </div>
      </div>
    );
  }
}

const LabelsConfig = withStyles(theme => ({
  labels: {
    width: '100%',
    paddingRight: theme.spacing.unit
  },
  row: {
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing.unit
  },
  field: {
    width: '100%',
    paddingRight: theme.spacing.unit
  },
  rightField: {
    paddingRight: 0
  }
}))(RawLabels);

export class RawOptions extends React.Component {
  static propTypes = {
    model: PropTypes.object,
    classes: PropTypes.object,
    onChange: PropTypes.func,
    graphTitle: PropTypes.bool,
    labels: PropTypes.bool
  };
  change = (name, value) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [name]: value });
  };

  render = () => {
    const { model, classes, graphTitle, labels } = this.props;
    return (
      <div className={classes.options}>
        {graphTitle && (
          <TextField
            variant="outlined"
            label="Graph Title"
            className={classes.graphTitle}
            value={model.title || ''}
            onChange={e => this.change('title', e.target.value)}
          />
        )}
        {labels && <LabelsConfig value={model.labels} onChange={l => this.change('labels', l)}/>}
        <div className={classes.domainAndRange}>
          <MinMax
            label={'Domain (X)'}
            model={model.domain}
            onChange={d => this.change('domain', d)}
          />
          <MinMax label={'Range (Y)'} model={model.range} onChange={d => this.change('range', d)}/>
        </div>
      </div>
    );
  };
}

const Options = withStyles(theme => ({
  domainAndRange: {
    display: 'flex',
    paddingTop: theme.spacing.unit
  },
  options: {
    paddingTop: theme.spacing.unit
  },
  graphTitle: {
    width: '100%',
    paddingRight: theme.spacing.unit
  }
}))(RawOptions);

export { Options };
