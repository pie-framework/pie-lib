import App, { Container } from 'next/app';
import React from 'react';
import Root from '../src/root';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log('page props');
    return (
      <Container>
        <Root list={['foo', 'bar']} current={'foo'}>
          <Component {...pageProps} />
        </Root>
      </Container>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { PlotPoints, pointUtils as utils } from '../src';
import injectSheet from 'react-jss';
import debug from 'debug';
const log = debug('pie-lib:charting:plot-point-demo');
import InfoPanel from './info-panel';

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

export default injectSheet(styles)(PlotPointsDemo);
