import React, { useState } from 'react';
import { color, Readable } from '@pie-lib/render-ui';
import cn from 'classnames';
import EditableHtml from '@pie-lib/editable-html';
import { withStyles } from '@material-ui/core/styles';

const LabelComponent = (props) => {
  const {
    classes,
    disabledLabel,
    graphHeight,
    graphWidth,
    isChartBottomLabel,
    isDefineChartBottomLabel,
    isChartLeftLabel,
    isDefineChartLeftLabel,
    placeholder,
    text,
    side,
    onChange,
  } = props;
  const [rotatedToHorizontal, setRotatedToHorizontal] = useState(false);
  const activePlugins = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'math',
    // 'languageCharacters'
  ];

  const isChart = isChartBottomLabel || isChartLeftLabel || isDefineChartBottomLabel || isDefineChartLeftLabel;

  const chartValue = side === 'left' && isDefineChartLeftLabel && graphHeight - 220;
  const defaultStyle = {
    width: chartValue || (side === 'left' || side === 'right' ? graphHeight - 8 : graphWidth - 8),
    top:
      chartValue ||
      (isChartLeftLabel && `${graphHeight - 70}px`) ||
      (side === 'left' && `${graphHeight - 8}px`) ||
      (isChartBottomLabel && `${graphHeight - 40}px`) ||
      (side === 'bottom' && `${graphHeight - 90}px`) ||
      0,
    left:
      (side === 'right' && `${graphWidth - 8}px`) ||
      ((isDefineChartLeftLabel || isDefineChartBottomLabel) && '40px') ||
      (isChartBottomLabel && '-10px') ||
      0,
  };

  const rotatedStyle = {
    width: graphWidth - 8,
    top: (side === 'right' && `${graphHeight - 22}px`) || 0,
    left: 0,
  };

  const rotateLabel = () => !disabledLabel && (side === 'left' || side === 'right') && setRotatedToHorizontal(true);

  return (
    <Readable false>
      <div
        className={cn(isChart ? classes.chartLabel : classes.axisLabel, {
          [classes.rotateLeftLabel]: side === 'left' && !rotatedToHorizontal,
          [classes.rotateRightLabel]: side === 'right' && !rotatedToHorizontal,
          [classes.editLabel]: rotatedToHorizontal,
          [classes.customBottom]: isChartBottomLabel || isDefineChartBottomLabel,
        })}
        style={rotatedToHorizontal ? rotatedStyle : defaultStyle}
        onClick={rotateLabel}
      >
        {disabledLabel ? (
          <div className={classes.disabledLabel} dangerouslySetInnerHTML={{ __html: text || '' }} />
        ) : (
          <EditableHtml
            markup={text || ''}
            onChange={onChange}
            placeholder={!disabledLabel && placeholder}
            toolbarOpts={{
              position: side === 'bottom' ? 'top' : 'bottom',
              noBorder: true,
            }}
            disableScrollbar
            activePlugins={activePlugins}
            onDone={() => setRotatedToHorizontal(false)}
          />
        )}
      </div>
    </Readable>
  );
};

export default withStyles((theme) => ({
  label: {
    fill: color.secondary(),
  },
  axisLabel: {
    fontSize: theme.typography.fontSize - 2,
    textAlign: 'center',
    margin: theme.spacing.unit / 2,
    padding: `${theme.spacing.unit / 2}px 0`,
  },
  chartLabel: {
    fontSize: theme.typography.fontSize + 2,
    textAlign: 'center',
    margin: theme.spacing.unit / 2,
    padding: `${theme.spacing.unit / 2}px 0`,
  },
  disabledLabel: {
    pointerEvents: 'none',
    width: '100%',
  },
  editLabel: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
  },
  rotateLeftLabel: {
    '-webkit-transform': 'rotate(-90deg)',
    transformOrigin: '0 0',
    transformStyle: 'preserve-3d',
    position: 'absolute',
  },
  rotateRightLabel: {
    '-webkit-transform': 'rotate(90deg)',
    transformOrigin: '0 0',
    transformStyle: 'preserve-3d',
    position: 'absolute',
  },
  customBottom: {
    position: 'absolute',
  },
}))(LabelComponent);
