import React from 'react';
import ReactDOM from 'react-dom';
import PlotPointsDemo from './plot-points-demo';
import GraphLinesDemo from './graph-lines-demo';
import { plotPoints, graphLines } from './sample-data';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import Sample from './sample-app';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'GraphLines'
    };
  }

  onChoose = n => {
    this.setState({ current: n });
  };

  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  getComp = () => {
    const { current } = this.state;

    if (current === 'GraphLines') {
      return <GraphLinesDemo model={graphLines} />;
    } else if (current === 'PlotPoints') {
      return <PlotPointsDemo model={plotPoints} />;
    }
  };
  render() {
    // const { classes } = this.props;
    const { current } = this.state;
    return (
      <Sample
        list={['GraphLines', 'PlotPoints']}
        current={current}
        onChoose={this.onChoose}
      >
        {this.getComp()}
      </Sample>
    );
  }
}

const styles = {
  demo: {
    width: '100%'
  }
};

const StyledDemo = injectSheet(styles)(Demo);

document.addEventListener('DOMContentLoaded', () => {
  const el = React.createElement(StyledDemo, {});
  ReactDOM.render(el, document.querySelector('#app'));
});
