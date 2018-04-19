import React from 'react';
import PropTypes from 'prop-types';
import { PlotPoints, pointUtils as utils } from '@pie-lib/charting';
import { withStyles } from 'material-ui/styles';
import debug from 'debug';
import InfoPanel from '../../src/info-panel';
import withRoot from '../../src/withRoot';

const log = debug('pie-lib:charting:plot-point-demo');
import { plotPoints } from '../../src/sample-data';
export class PlotPointsDemo extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      selection: []
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ model: props.model });
  }

  addPoint = point => {
    log('[addPoint] ', point);
    const points = this.state.model.points.concat([point]);
    const model = { ...this.state.model, points };
    this.setState({ model });
  };

  selectionChanged = selection => {
    log('[selectionChanged]:', selection);
    this.setState({ selection });
  };

  movePoint = (from, to) => {
    const points = utils.swapPoint(this.state.model.points, from, to);
    const selection = utils.swapPoint(this.state.selection, from, to);
    log('[movePoint] ...points: ', points);
    const model = { ...this.state.model, points };
    this.setState({ model, selection });
  };

  render() {
    const { classes } = this.props;
    const { model, selection } = this.state;

    return (
      <div className={classes.demo}>
        <PlotPoints
          {...model}
          disabled={false}
          onAddPoint={this.addPoint}
          onSelectionChange={this.selectionChanged}
          onMovePoint={this.movePoint}
          selection={selection}
          showPointCoordinates={true}
          labels={['a', 'b', 'c', 'd']}
        />
        <InfoPanel model={this.state} className={classes.infoPanel} />
      </div>
    );
  }
}

const styles = {
  demo: {
    width: '100%',
    display: 'flex'
  },
  infoPanel: {
    width: '100%',
    flex: '1',
    fontFamily: 'monospace'
  }
};

const Styled = withStyles(styles)(PlotPointsDemo);

const Demo = () => <Styled model={plotPoints} />;

export default withRoot(Demo);
