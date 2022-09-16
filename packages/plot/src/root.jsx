import React from 'react';
import { ChildrenType } from './types';
import { withStyles } from '@material-ui/core/styles';
import { select, mouse } from 'd3-selection';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';
import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import cn from 'classnames';

export class Root extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: ChildrenType,
    disabledTitle: PropTypes.bool,
    graphProps: GraphPropsType.isRequired,
    onChangeTitle: PropTypes.func,
    onMouseMove: PropTypes.func,
    classes: PropTypes.object.isRequired,
    showLabels: PropTypes.bool,
    showTitle: PropTypes.bool,
    showPixelGuides: PropTypes.bool,
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
    const {
      disabledTitle,
      graphProps,
      children,
      classes,
      onChangeTitle,
      thisIsChart,
      showLabels,
      showPixelGuides,
      showTitle,
      title,
      rootRef
    } = this.props;
    const {
      size: { width = 500, height = 500 },
      domain,
      range
    } = graphProps;

    const padding = showLabels ? 70 : 40;
    const extraPadding = showLabels ? 16 : 40;
    const finalWidth = width + padding * 2 + (domain.padding || 0) * 2 + extraPadding;
    const finalHeight = height + padding * 2 + (range.padding || 0) * 2;

    const activeTitlePlugins = [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'math'
      // 'languageCharacters'
    ];

    const actualHeight = thisIsChart && showPixelGuides ? height - 80 : height;
    const nbOfVerticalLines = parseInt(width / 100);
    const nbOfHorizontalLines = parseInt(actualHeight / 100);
    const sideGridlinesPadding = parseInt(actualHeight % 100);

    return (
      <div className={classes.root}>
        {showPixelGuides && (
          <div className={classes.topPixelGuides} style={{ marginLeft: thisIsChart ? 10 : 20 }}>
            {[...Array(nbOfVerticalLines + 1).keys()].map(value => (
              <Readable false key={`top-guide-${value}`}>
                <div className={classes.topPixelIndicator}>
                  <div>{value * 100}px</div>
                  <div>|</div>
                </div>
              </Readable>
            ))}
          </div>
        )}
        {showTitle && (
          <EditableHtml
            className={cn(
              {
                [classes.disabledTitle]: disabledTitle
              },
              classes.graphTitle
            )}
            markup={title || ''}
            width={finalWidth}
            onChange={onChangeTitle}
            placeholder={!disabledTitle && 'Click here to add a title for this graph'}
            toolbarOpts={{ noBorder: true }}
            activePlugins={activeTitlePlugins}
          />
        )}
        <div className={classes.wrapper}>
          <svg width={finalWidth} height={finalHeight} className={classes.svg}>
            <g
              ref={r => {
                this.g = r;
                if (rootRef) {
                  rootRef(r);
                }
              }}
              className={classes.graphBox}
              transform={`translate(${padding}, ${padding})`}
            >
              {children}
            </g>
          </svg>
          {showPixelGuides && (
            <div
              className={classes.sidePixelGuides}
              style={{
                paddingTop: sideGridlinesPadding,
                marginTop: thisIsChart ? 25 : 60
              }}
            >
              {[...Array(nbOfHorizontalLines + 1).keys()].reverse().map(value => (
                <Readable false key={`top-guide-${value}`}>
                  <div className={classes.sidePixelIndicator}>━ {value * 100}px</div>
                </Readable>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
const styles = theme => ({
  root: {
    border: `solid 1px ${color.primaryLight()}`,
    color: color.text(),
    backgroundColor: color.background(),
    touchAction: 'none'
  },
  wrapper: {
    display: 'flex'
  },
  svg: {},
  graphBox: {
    cursor: 'pointer',
    userSelect: 'none'
  },
  graphTitle: {
    color: color.text(),
    fontSize: theme.typography.fontSize + 2,
    padding: '12px 4px 0',
    textAlign: 'center'
  },
  disabledTitle: {
    pointerEvents: 'none'
  },
  topPixelGuides: {
    display: 'flex',
    paddingTop: '6px'
  },
  topPixelIndicator: {
    color: color.primaryLight(),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100px',
    pointerEvents: 'none',
    userSelect: 'none'
  },
  sidePixelGuides: {
    width: '70px',
    display: 'flex',
    flexDirection: 'column',
    marginRight: '6px'
  },
  sidePixelIndicator: {
    color: color.primaryLight(),
    textAlign: 'right',
    height: '20px',
    pointerEvents: 'none',
    userSelect: 'none',

    '&:not(:last-child)': {
      marginBottom: '80px'
    }
  }
});

export default withStyles(styles)(Root);
