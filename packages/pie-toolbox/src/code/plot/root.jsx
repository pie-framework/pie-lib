import React from 'react';
import { ChildrenType } from './types';
import { withStyles } from '@material-ui/core/styles';
import { select, mouse } from 'd3-selection';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';
import { color, Readable } from '../render-ui';
import EditableHtml from '../editable-html';
import cn from 'classnames';
import Label from './label';

export class Root extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: ChildrenType,
    defineChart: PropTypes.bool,
    disabledLabels: PropTypes.bool,
    disabledTitle: PropTypes.bool,
    graphProps: GraphPropsType.isRequired,
    isChart: PropTypes.bool,
    labels: PropTypes.object,
    labelsPlaceholders: PropTypes.object,
    onChangeTitle: PropTypes.func,
    onMouseMove: PropTypes.func,
    classes: PropTypes.object.isRequired,
    showLabels: PropTypes.bool,
    showTitle: PropTypes.bool,
    showPixelGuides: PropTypes.bool,
    rootRef: PropTypes.func,
    onChangeLabels: PropTypes.func,
    titlePlaceholder: PropTypes.string,
  };

  mouseMove = (g) => {
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
      y: snap.y(y),
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

  onChangeLabel = (newValue, side) => {
    const { labels, onChangeLabels, isChart } = this.props;

    if (isChart) {
      if (side === 'left') {
        onChangeLabels('range', newValue);
      } else {
        onChangeLabels('domain', newValue);
      }

      return;
    }

    onChangeLabels({
      ...labels,
      [side]: newValue,
    });
  };

  render() {
    const {
      disabledTitle,
      disabledLabels,
      labels,
      labelsPlaceholders,
      titlePlaceholder,
      graphProps,
      children,
      classes,
      defineChart,
      onChangeTitle,
      isChart,
      showLabels,
      showPixelGuides,
      showTitle,
      title,
      rootRef,
      mathMlOptions = {},
    } = this.props;
    const {
      size: { width = 500, height = 500 },
      domain,
      range,
    } = graphProps;

    const topPadding = 40;
    const leftPadding = showLabels ? 80 : 60;
    const finalWidth = width + leftPadding * 2 + (domain.padding || 0) * 2;
    const finalHeight = height + topPadding * 2 + (range.padding || 0) * 2;

    const activeTitlePlugins = [
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'math',
      // 'languageCharacters'
    ];

    const actualHeight = defineChart && showPixelGuides ? height - 160 : height;
    const nbOfVerticalLines = parseInt(width / 100);
    const nbOfHorizontalLines = parseInt(actualHeight / 100);
    const sideGridlinesPadding = parseInt(actualHeight % 100);

    return (
      <div className={classes.root}>
        {showPixelGuides && (
          <div className={classes.topPixelGuides} style={{ marginLeft: isChart ? 80 : showLabels ? 30 : 10 }}>
            {[...Array(nbOfVerticalLines + 1).keys()].map((value) => (
              <Readable false key={`top-guide-${value}`}>
                <div className={classes.topPixelIndicator}>
                  <div>{value * 100}px</div>
                  <div>|</div>
                </div>
              </Readable>
            ))}
          </div>
        )}
        {showTitle &&
          (disabledTitle ? (
            <div
              style={
                isChart && {
                  width: finalWidth,
                }
              }
              className={cn(isChart ? classes.chartTitle : classes.graphTitle, classes.disabledTitle)}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
          ) : (
            <EditableHtml
              style={
                isChart && {
                  width: finalWidth,
                }
              }
              className={cn(
                { [classes.rightMargin]: showPixelGuides },
                isChart ? classes.chartTitle : classes.graphTitle,
              )}
              markup={title || ''}
              onChange={onChangeTitle}
              placeholder={
                (defineChart && titlePlaceholder) || (!disabledTitle && 'Click here to add a title for this graph')
              }
              toolbarOpts={{ noBorder: true }}
              activePlugins={activeTitlePlugins}
              disableScrollbar
            />
          ))}
        {showLabels && !isChart && (
          <Label
            side="top"
            text={labels.top}
            disabledLabel={disabledLabels}
            placeholder={labelsPlaceholders?.top}
            graphHeight={finalHeight}
            graphWidth={finalWidth}
            onChange={(value) => this.onChangeLabel(value, 'top')}
            mathMlOptions={mathMlOptions}
          />
        )}
        <div className={classes.wrapper}>
          {showLabels && (
            <Label
              side="left"
              text={labels.left}
              disabledLabel={disabledLabels}
              placeholder={labelsPlaceholders?.left}
              graphHeight={finalHeight}
              graphWidth={finalWidth}
              isChartLeftLabel={isChart && !defineChart}
              isDefineChartLeftLabel={isChart && defineChart}
              onChange={(value) => this.onChangeLabel(value, 'left')}
              mathMlOptions={mathMlOptions}
            />
          )}
          <svg width={finalWidth} height={finalHeight} className={defineChart ? classes.defineChart : classes.chart}>
            <g
              ref={(r) => {
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
          {showLabels && !isChart && (
            <Label
              side="right"
              text={labels.right}
              disabledLabel={disabledLabels}
              placeholder={labelsPlaceholders?.right}
              graphHeight={finalHeight}
              graphWidth={finalWidth}
              onChange={(value) => this.onChangeLabel(value, 'right')}
              mathMlOptions={mathMlOptions}
            />
          )}
          {showPixelGuides && (
            <div
              className={classes.sidePixelGuides}
              style={{
                paddingTop: sideGridlinesPadding,
                marginTop: 31,
              }}
            >
              {[...Array(nbOfHorizontalLines + 1).keys()].reverse().map((value) => (
                <Readable false key={`top-guide-${value}`}>
                  <div className={classes.sidePixelIndicator}>━ {value * 100}px</div>
                </Readable>
              ))}
            </div>
          )}
        </div>
        {showLabels && (
          <Label
            side="bottom"
            text={labels.bottom}
            disabledLabel={disabledLabels}
            placeholder={labelsPlaceholders?.bottom}
            graphHeight={finalHeight}
            graphWidth={finalWidth}
            isChartBottomLabel={isChart && !defineChart}
            isDefineChartBottomLabel={isChart && defineChart}
            onChange={(value) => this.onChangeLabel(value, 'bottom')}
            mathMlOptions={mathMlOptions}
          />
        )}
      </div>
    );
  }
}

// use default color theme style to avoid color contrast issues
const styles = (theme) => ({
  root: {
    border: `solid 1px ${color.primaryLight()}`,
    color: color.defaults.TEXT,
    backgroundColor: theme.palette.common.white,
    touchAction: 'none',
    position: 'relative',
  },
  wrapper: {
    display: 'flex',
    position: 'relative',
  },
  svg: {},
  defineChart: {
    paddingLeft: '50px',
    overflow: 'visible',
  },
  chart: {
    overflow: 'visible',
  },
  graphBox: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  graphTitle: {
    color: color.defaults.TEXT,
    fontSize: theme.typography.fontSize + 2,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit / 2}px 0`,
    textAlign: 'center',
  },
  chartTitle: {
    color: color.defaults.TEXT,
    fontSize: theme.typography.fontSize + 4,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit / 2}px 0`,
    textAlign: 'center',
  },
  disabledTitle: {
    pointerEvents: 'none',
  },
  rightMargin: {
    marginRight: '74px',
  },
  topPixelGuides: {
    display: 'flex',
    paddingTop: '6px',
  },
  topPixelIndicator: {
    color: color.defaults.PRIMARY_LIGHT,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100px',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  sidePixelGuides: {
    width: '70px',
    display: 'flex',
    flexDirection: 'column',
    marginRight: '6px',
  },
  sidePixelIndicator: {
    color: color.defaults.PRIMARY_LIGHT,
    textAlign: 'right',
    height: '20px',
    pointerEvents: 'none',
    userSelect: 'none',

    '&:not(:last-child)': {
      marginBottom: '80px',
    },
  },
});

export default withStyles(styles)(Root);
