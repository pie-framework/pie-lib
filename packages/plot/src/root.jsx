import React from 'react';
import { ChildrenType } from './types';
import { withStyles } from '@material-ui/core/styles';
import { select, mouse } from 'd3-selection';
import PropTypes from 'prop-types';
import { GraphPropsType } from './types';
import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import cn from 'classnames';
import Label from './label';
import { extractTextFromHTML, isEmptyObject, isEmptyString } from './utils';

export class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleHeight: 0,
    };
  }

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
    mathMlOptions: PropTypes.object,
    labelsCharactersLimit: PropTypes.number,
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
    this.measureTitleHeight();
  }

  componentWillUnmount() {
    const g = select(this.g);
    g.on('mousemove', null);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.measureTitleHeight();
    }
  }

  onChangeLabel = (newValue, side) => {
    const { labels, onChangeLabels, isChart } = this.props;

    if (!onChangeLabels) {
      return;
    }

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

  measureTitleHeight = () => {
    const titleElement = document.getElementById('editable-title');
    if (titleElement) {
      const titleHeight = titleElement.clientHeight;
      this.setState({ titleHeight, prevTitle: this.props.title });
    }
  };

  handleKeyDown = () => {
    setTimeout(this.measureTitleHeight, 0);
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
      labelsCharactersLimit,
    } = this.props;
    const {
      size: { width = 500, height = 500 },
      domain,
      range,
    } = graphProps;

    const topPadding = 40;
    const leftPadding = isEmptyString(extractTextFromHTML(labels?.left)) && isEmptyObject(labelsPlaceholders) ? 48 : 70;
    const rightPadding =
      isEmptyString(extractTextFromHTML(labels?.right)) && isEmptyObject(labelsPlaceholders) ? 48 : 70;
    const finalWidth = width + leftPadding + rightPadding + (domain.padding || 0) * 2;
    const finalHeight = height + topPadding * 2 + (range.padding || 0) * 2;

    const activeTitlePlugins = [
      'bold',
      'italic',
      'underline',
      'superscript',
      'subscript',
      'strikethrough',
      'math',
      // 'languageCharacters'
    ];

    const actualHeight = defineChart && showPixelGuides ? height - 160 : height;
    const nbOfVerticalLines = parseInt(width / 100);
    const nbOfHorizontalLines = parseInt(actualHeight / 100);
    const sideGridlinesPadding = parseInt(actualHeight % 100);
    const { titleHeight } = this.state;
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
              id="editable-title"
              style={{
                ...(isChart && { width: finalWidth }),
                ...(isEmptyString(extractTextFromHTML(title)) && { display: 'none' }),
              }}
              className={cn(isChart ? classes.chartTitle : classes.graphTitle, classes.disabledTitle)}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
          ) : (
            <div id="editable-title">
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
                toolbarOpts={{ noPadding: true, noBorder: true }}
                activePlugins={activeTitlePlugins}
                disableScrollbar
                onKeyDown={this.handleKeyDown}
              />
            </div>
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
            charactersLimit={labelsCharactersLimit}
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
              charactersLimit={labelsCharactersLimit}
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
              transform={`translate(${leftPadding + (domain.padding || 0)}, ${topPadding + (range.padding || 0)})`}
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
              charactersLimit={labelsCharactersLimit}
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
            titleHeight={titleHeight}
            isChartBottomLabel={isChart && !defineChart}
            isDefineChartBottomLabel={isChart && defineChart}
            onChange={(value) => this.onChangeLabel(value, 'bottom')}
            mathMlOptions={mathMlOptions}
            charactersLimit={labelsCharactersLimit}
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
