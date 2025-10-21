import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { select, mouse } from 'd3-selection';
import cn from 'classnames';

import { color, Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import { ChildrenType } from './types';
import { GraphPropsType } from './types';
import Label from './label';
import { extractTextFromHTML, isEmptyObject, isEmptyString } from './utils';

const StyledRoot = styled('div')(({ theme }) => ({
  border: `solid 1px ${color.primaryLight()}`,
  color: color.defaults.TEXT,
  backgroundColor: theme.palette.common.white,
  touchAction: 'none',
  position: 'relative',
  boxSizing: 'unset', // to override the default border-box in IBX that breaks the component width layout
}));

const Wrapper = styled('div')({
  display: 'flex',
  position: 'relative',
});

const DefineChartSvg = styled('svg')({
  paddingLeft: '50px',
  overflow: 'visible',
});

const ChartSvg = styled('svg')({
  overflow: 'visible',
});

const GraphBox = styled('g')({
  cursor: 'pointer',
  userSelect: 'none',
});

const GraphTitle = styled('div')(({ theme }) => ({
  color: color.defaults.TEXT,
  fontSize: theme.typography.fontSize + 2,
  padding: `${theme.spacing(1.5)} ${theme.spacing(0.5)} 0`,
  textAlign: 'center',
  '&.disabled': {
    pointerEvents: 'none',
  },
  '&.rightMargin': {
    marginRight: '74px',
  },
}));

const ChartTitle = styled('div')(({ theme }) => ({
  color: color.defaults.TEXT,
  fontSize: theme.typography.fontSize + 4,
  padding: `${theme.spacing(1.5)} ${theme.spacing(0.5)} 0`,
  textAlign: 'center',
  '&.disabled': {
    pointerEvents: 'none',
  },
  '&.rightMargin': {
    marginRight: '74px',
  },
}));

const TopPixelGuides = styled('div')({
  display: 'flex',
  paddingTop: '6px',
});

const TopPixelIndicator = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100px',
  pointerEvents: 'none',
  userSelect: 'none',
});

const SidePixelGuides = styled('div')({
  width: '70px',
  display: 'flex',
  flexDirection: 'column',
  marginRight: '6px',
});

const SidePixelIndicator = styled('div')({
  textAlign: 'right',
  height: '20px',
  pointerEvents: 'none',
  userSelect: 'none',
  '&:not(:last-child)': {
    marginBottom: '80px',
  },
});

export class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleHeight: 0,
    };
    this.resizeObserver = null;
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
    this.setupVisibilityObserver();
  }

  componentWillUnmount() {
    const g = select(this.g);
    g.on('mousemove', null);
    this.cleanupVisibilityObserver();
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
    const titleElement = this.titleRef;
    if (titleElement) {
      const titleHeight = titleElement.clientHeight;
      this.setState({ titleHeight, prevTitle: this.props.title });

      if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
        this.setupVisibilityObserver();
      }
    }
  };

  handleKeyDown = () => {
    setTimeout(() => {
      this.measureTitleHeight();
    }, 0);
  };

  // handle edge case where chart is hidden with display:none and then shown with display:block
  setupVisibilityObserver = () => {
    if (typeof ResizeObserver !== 'undefined' && this.titleRef) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          // trigger if element becomes visible and we haven't measured this height yet
          if (width > 0 && height > 0) {
            setTimeout(() => {
              this.measureTitleHeight();
            }, 10);
            break;
          }
        }
      });

      this.resizeObserver.observe(this.titleRef);
    }
  };

  cleanupVisibilityObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
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
      <StyledRoot>
        {showPixelGuides && (
          <TopPixelGuides style={{ marginLeft: isChart ? 80 : showLabels ? 30 : 10 }}>
            {[...Array(nbOfVerticalLines + 1).keys()].map((value) => (
              <Readable false key={`top-guide-${value}`}>
                <TopPixelIndicator>
                  <div>{value * 100}px</div>
                  <div>|</div>
                </TopPixelIndicator>
              </Readable>
            ))}
          </TopPixelGuides>
        )}
        {showTitle &&
          (disabledTitle ? (
            <div
              ref={(r) => (this.titleRef = r)}
              style={{
                ...(isChart && { width: finalWidth }),
                ...(isEmptyString(extractTextFromHTML(title)) && { display: 'none' }),
              }}
            >
              {isChart ? (
                <ChartTitle className="disabled" dangerouslySetInnerHTML={{ __html: title || '' }} />
              ) : (
                <GraphTitle className="disabled" dangerouslySetInnerHTML={{ __html: title || '' }} />
              )}
            </div>
          ) : (
            <div ref={(r) => (this.titleRef = r)}>
              {isChart ? (
                <ChartTitle className={cn({ rightMargin: showPixelGuides })}>
                  <EditableHtml
                    style={
                      isChart && {
                        width: finalWidth,
                      }
                    }
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
                </ChartTitle>
              ) : (
                <GraphTitle className={cn({ rightMargin: showPixelGuides })}>
                  <EditableHtml
                    style={
                      isChart && {
                        width: finalWidth,
                      }
                    }
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
                </GraphTitle>
              )}
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
        <Wrapper>
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
          {defineChart ? (
            <DefineChartSvg width={finalWidth} height={finalHeight}>
              <GraphBox
                ref={(r) => {
                  this.g = r;
                  if (rootRef) {
                    rootRef(r);
                  }
                }}
                transform={`translate(${leftPadding + (domain.padding || 0)}, ${topPadding + (range.padding || 0)})`}
              >
                {children}
              </GraphBox>
            </DefineChartSvg>
          ) : (
            <ChartSvg width={finalWidth} height={finalHeight}>
              <GraphBox
                ref={(r) => {
                  this.g = r;
                  if (rootRef) {
                    rootRef(r);
                  }
                }}
                transform={`translate(${leftPadding + (domain.padding || 0)}, ${topPadding + (range.padding || 0)})`}
              >
                {children}
              </GraphBox>
            </ChartSvg>
          )}
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
            <SidePixelGuides
              style={{
                paddingTop: sideGridlinesPadding,
                marginTop: 31,
              }}
            >
              {[...Array(nbOfHorizontalLines + 1).keys()].reverse().map((value) => (
                <Readable false key={`top-guide-${value}`}>
                  <SidePixelIndicator>━ {value * 100}px</SidePixelIndicator>
                </Readable>
              ))}
            </SidePixelGuides>
          )}
        </Wrapper>
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
      </StyledRoot>
    );
  }
}

export default Root;
