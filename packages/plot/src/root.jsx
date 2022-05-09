import React from 'react';
import { ChildrenType } from './types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { select, mouse } from 'd3-selection';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';
import { color } from '@pie-lib/render-ui';

export const GraphTitle = withStyles(theme => ({
  title: {
    color: color.text(),
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    fontSize: theme.typography.fontSize + 6
  }
}))(({ value, classes }) => (
  <Typography
    className={classes.title}
    color="primary"
    variant="h5"
    dangerouslySetInnerHTML={{ __html: value }}
  />
));

export class Root extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: ChildrenType,
    graphProps: GraphPropsType.isRequired,
    onMouseMove: PropTypes.func,
    classes: PropTypes.object.isRequired,
    rootRef: PropTypes.func
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
    const { graphProps, children, classes, title, rootRef } = this.props;
    const {
      size: { width = 500, height = 500 },
      domain,
      range
    } = graphProps;
    const topPadding = 50;
    const leftPadding = topPadding + 10; // left side requires an extra padding of 10
    const finalWidth = width + leftPadding * 2 + (domain.padding || 0) * 2;
    const finalHeight = height + topPadding * 2 + (range.padding || 0) * 2;

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
            transform={`translate(${leftPadding}, ${topPadding})`}
          >
            {children}
          </g>
        </svg>
      </div>
    );
  }
}
const styles = () => ({
  root: {
    border: `solid 1px ${color.primaryLight()}`,
    color: color.text(),
    backgroundColor: color.background()
  },
  svg: {},
  graphBox: {
    cursor: 'pointer',
    userSelect: 'none'
  }
});

export default withStyles(styles)(Root);
