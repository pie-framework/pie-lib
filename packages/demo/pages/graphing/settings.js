import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { DisplaySize, Toggle, Checkbox } from '@pie-lib/config-ui';
import debug from 'debug';

const log = debug('pie-lib:demo:settings');

export class Settings extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  toggle = (key, value) => {
    const { model, onChange } = this.props;

    onChange({ ...model, [key]: value });
  };

  changeArrows = (key, value) => {
    const { model, onChange } = this.props;
    const includeArrows = { ...model.includeArrows, [key]: value };

    onChange({ ...model, includeArrows });
  };

  size = (size) => {
    const { model, onChange } = this.props;

    onChange({ ...model, size });
  };

  render() {
    const { classes, className, model } = this.props;
    const { includeArrows, graphTitle, labels, size, coordinatesOnHover } = model;

    return (
      <div className={classNames(classes.class, className)}>
        <div className={classes.holder}>
          <div>
            <p>Include Arrows</p>
            <Checkbox
              label={'left'}
              checked={includeArrows.left}
              onChange={(event) => this.changeArrows('left', event.target.checked)}
            />
            <Checkbox
              label={'right'}
              checked={includeArrows.right}
              onChange={(event) => this.changeArrows('right', event.target.checked)}
            />
            <Checkbox
              label={'up'}
              checked={includeArrows.up}
              onChange={(event) => this.changeArrows('up', event.target.checked)}
            />
            <Checkbox
              label={'down'}
              checked={includeArrows.down}
              onChange={(event) => this.changeArrows('down', event.target.checked)}
            />
          </div>

          <Toggle label={'Graph Title'} toggle={(v) => this.toggle('graphTitle', v)} checked={graphTitle} />
          <Toggle label={'Labels'} toggle={(v) => this.toggle('labels', v)} checked={labels} />

          <div>
            <DisplaySize label={'Graph Display Size'} size={size} onChange={this.size} />
            <Toggle
              label={'Coordinates on Hover'}
              toggle={(v) => this.toggle('coordinatesOnHover', v)}
              checked={coordinatesOnHover}
            />
            <Typography variant="overline">Properties</Typography>
            <div> .... </div>
          </div>
        </div>
      </div>
    );
  }
}
const styles = (theme) => ({
  class: {
    display: 'block',
    maxWidth: '300px',
    backgroundColor: '#eaeaea',
    border: 'solid 1px #cccccc',
    padding: theme.spacing.unit,
  },
  holder: {
    width: '100%',
  },
  displaySize: {
    display: 'flex',
    paddingTop: theme.spacing.unit,
  },
});

export default withStyles(styles)(Settings);
