import React from 'react';
import { ChildrenType } from './types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { select, mouse } from 'd3-selection';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';

export const GraphTitle = withStyles(theme => ({
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2
  }
}))(({ value, classes }) => (
  <Typography className={classes.title} variant="h5" color="primary">
    {value}
  </Typography>
));

export class Root extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: ChildrenType,
    graphProps: GraphPropsType.isRequired,
    onMouseMove: PropTypes.func,
    classes: PropTypes.object.isRequired,
    rootRef: PropTypes.func,
    paddingLeft: PropTypes.number
  };

  mouseMove = g => {
    const { graphProps, onMouseMove } = this.props;

    if (!onMouseMove) {
      return;
    }

    const { scale, snap } = graphProps;
    const coords = mouse(g._groups[0][0]);
    const x = scale.x.invert(coords[0]);
    const y = scale.y.invert(coords[1]);

    const snapped = {
      x: snap.x(x),
      y: snap.y(y)
    };

    onMouseMove(snapped);
  };

  componentDidMount() {
    const g = select(this.g);
    g.on('mousemove', this.mouseMove.bind(this, g));
  }

  componentWillUnmount() {
    const g = select(this.g);
    g.on('mousemove', null);
  }

  render() {
    const { graphProps, children, classes, title, rootRef, paddingLeft } = this.props;
    const { size } = graphProps;
    const padding = 50;
    const finalWidth = size.width + padding * 2;
    const finalHeight = size.height + padding * 2;

    return (
      <div className={classes.root}>
        {title && <GraphTitle value={title} />}
        <svg width={finalWidth} height={finalHeight} className={classes.svg}>
          <g
            ref={r => {
              this.g = r;
              if (rootRef) {
                rootRef(r);
              }
            }}
            className={classes.graphBox}
            transform={`translate(${paddingLeft || padding}, ${padding})`}
          >
            {children}
          </g>
        </svg>
      </div>
    );
  }
}
const styles = theme => ({
  root: {
    border: `solid 1px ${theme.palette.primary.light}`
  },
  svg: {},
  graphBox: {
    cursor: 'pointer',
    userSelect: 'none'
  }
});

export default withStyles(styles)(Root);
