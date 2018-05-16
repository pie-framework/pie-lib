import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import { GraphLines, lineUtils as utils } from '@pie-lib/charting';
import InfoPanel from '../../src/info-panel';
import withRoot from '../../src/withRoot';

import { graphLines } from '../../src/sample-data';

const log = debug('pie-lib:charting:graph-lines-demo');

export class GraphLinesDemo extends React.Component {
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

  onLineChange = (old, newLine) => {
    log('old: ', old, 'new: ', newLine);
    const lines = utils.swapLine(this.state.model.lines, old, newLine);
    const selection = utils.swapLine(this.state.selection, old, newLine);
    const model = { ...this.state.model, lines };
    this.setState({ model, selection });
  };

  toggleSelectLine = line => {
    if (utils.hasLine(this.state.selection, line)) {
      const selection = utils.removeLine(this.state.selection, line);
      this.setState({ selection });
    } else {
      const selection = this.state.selection.concat([line]);
      this.setState({ selection });
    }
  };

  deleteSelection = () => {
    const lines = utils.removeLines(
      this.state.model.lines,
      this.state.selection
    );
    const model = { ...this.props.model, lines };
    this.setState({ model, selection: [] });
  };

  render() {
    const { classes } = this.props;
    const { model, selection } = this.state;

    const lines = model.lines.map(l => ({
      ...l,
      selected: utils.hasLine(selection, l)
    }));
    return (
      <div className={classes.demo}>
        <div>
          <button
            onClick={this.deleteSelection}
            disabled={selection.length <= 0}
          >
            delete
          </button>
          <br />
          <GraphLines
            lines={lines}
            width={model.width}
            height={model.height}
            domain={model.domain}
            range={model.range}
            disabled={false}
            onLineChange={this.onLineChange}
            onLineClick={this.toggleSelectLine}
          />
        </div>
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

export const Styled = withStyles(styles)(GraphLinesDemo);
const Demo = () => <Styled model={graphLines} />;
export default withRoot(Demo);
