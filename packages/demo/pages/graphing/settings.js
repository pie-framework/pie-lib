import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { DisplaySize, Toggle } from '@pie-lib/config-ui';
import debug from 'debug';

const log = debug('pie-lib:demo:settings');

export class Settings extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  toggle = (key, value) => {
    const { model, onChange } = this.props;
    onChange({ ...model, [key]: value });
  };

  size = size => {
    const { model, onChange } = this.props;
    onChange({ ...model, size });
  };

  render() {
    const { classes, className, model } = this.props;
    return (
      <div className={classNames(classes.class, className)}>
        <div className={classes.holder}>
          <Toggle
            label={'Include Arrows'}
            toggle={v => {
              log('v?', v);
              this.toggle('includeArrows', v);
            }}
            checked={model.includeArrows}
          />
          <Toggle
            label={'GraphTitle'}
            toggle={v => this.toggle('graphTitle', v)}
            checked={model.graphTitle}
          />
          <Toggle label={'Labels'} toggle={v => this.toggle('labels', v)} checked={model.labels} />

          <div>
            <DisplaySize label={'Graph Display Size'} size={model.size} onChange={this.size} />
            <Toggle
              label={'Coordinates on Hover'}
              toggle={v => this.toggle('coordinatesOnHover', v)}
              checked={model.coordinatesOnHover}
            />
            <Typography variant="overline">Properties</Typography>
            <div> .... </div>
          </div>
        </div>
      </div>
    );
  }
}
const styles = theme => ({
  class: {
    display: 'block',
    maxWidth: '300px',
    backgroundColor: '#eaeaea',
    border: 'solid 1px #cccccc',
    padding: theme.spacing.unit
  },
  holder: {
    width: '100%'
  },
  displaySize: {
    display: 'flex',
    paddingTop: theme.spacing.unit
  }
});

export default withStyles(styles)(Settings);
