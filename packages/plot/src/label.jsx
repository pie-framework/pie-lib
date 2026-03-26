import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html-tip-tap';
import PropTypes from 'prop-types';
import { extractTextFromHTML, isEmptyString } from './utils';

const styles = {
  axisLabel: {
    fontSize: 12,
    textAlign: 'center',
    margin: 4,
    padding: '4px 0',
  },
  chartLabel: {
    fontSize: 16,
    textAlign: 'center',
    margin: 4,
    padding: '4px 0',
  },
  disabledLabel: {
    pointerEvents: 'none',
    width: '100%',
  },
  editLabel: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: '0px 5px 8px rgba(0,0,0,0.15)',
    zIndex: 10,
  },
  rotateLeftLabel: {
    transform: 'rotate(-90deg)',
    transformOrigin: '0 0',
    position: 'absolute',
  },
  rotateRightLabel: {
    transform: 'rotate(90deg)',
    transformOrigin: '0 0',
    position: 'absolute',
  },
  customBottom: {
    position: 'absolute',
  },
  displayNone: {
    display: 'none',
  },
};

const LabelContent = styled('div')({
  ...styles.disabledLabel,
  '& p': {
    margin: 0,
  },
});

const LabelComponent = (props) => {
  const {
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
    mathMlOptions = {},
    charactersLimit,
    titleHeight,
    preventNewLines,
  } = props;

  const [rotatedToHorizontal, setRotatedToHorizontal] = useState(false);

  const activePlugins = ['bold', 'italic', 'underline', 'strikethrough', 'math'];

  const isChart = isChartBottomLabel || isChartLeftLabel || isDefineChartBottomLabel || isDefineChartLeftLabel;

  const chartValue = side === 'left' && isDefineChartLeftLabel && graphHeight - 220;

  const defaultStyle = {
    width: chartValue || (side === 'left' || side === 'right' ? graphHeight - 8 : graphWidth - 8),
    top:
      chartValue ||
      (isChartLeftLabel && `${graphHeight - 70}px`) ||
      (side === 'left' && `${graphHeight - 8}px`) ||
      (isChartBottomLabel && `${graphHeight - 60 + titleHeight}px`) ||
      (side === 'bottom' && `${graphHeight - 120 + titleHeight}px`) ||
      0,
    left:
      (side === 'right' && `${graphWidth - 8}px`) ||
      ((isDefineChartLeftLabel || isDefineChartBottomLabel) && '40px') ||
      (isChartBottomLabel && '-10px') ||
      0,
  };

  const rotatedStyle = {
    width: graphWidth - 8,
    top: side === 'right' ? `${graphHeight - 22}px` : 0,
    left: 0,
  };

  const rotateLabel = () => {
    if (!disabledLabel && (side === 'left' || side === 'right')) {
      setRotatedToHorizontal(true);
    }
  };

  const exitEditMode = () => {
    setRotatedToHorizontal(false);

    // blur active element because rotation is causing editing issues on exit
    requestAnimationFrame(() => {
      document.activeElement?.blur?.();
    });
  };

  const onKeyDown = (event) => {
    if (preventNewLines && event.key === 'Enter') {
      // prevent adding new lines - cancelling event
      return true;
    }

    return false;
  };

  return (
    <Readable false>
      <div
        onClick={rotateLabel}
        style={{
          ...(rotatedToHorizontal ? rotatedStyle : defaultStyle),
          ...(isChart ? styles.chartLabel : styles.axisLabel),
          ...(side === 'left' && !rotatedToHorizontal ? styles.rotateLeftLabel : {}),
          ...(side === 'right' && !rotatedToHorizontal ? styles.rotateRightLabel : {}),
          ...(rotatedToHorizontal ? styles.editLabel : {}),
          ...(isChartBottomLabel || isDefineChartBottomLabel ? styles.customBottom : {}),
          ...(disabledLabel && !isChart && isEmptyString(extractTextFromHTML(text)) && styles.displayNone),
        }}
      >
        {disabledLabel ? (
          <LabelContent dangerouslySetInnerHTML={{ __html: text || '' }} />
        ) : (
          <EditableHtml
            markup={text || ''}
            onChange={onChange}
            placeholder={!disabledLabel && placeholder}
            toolbarOpts={{
              position: side === 'bottom' ? 'top' : 'bottom',
              noPadding: true,
              noBorder: true,
            }}
            disableScrollbar
            activePlugins={activePlugins}
            onDone={exitEditMode}
            onKeyDown={onKeyDown}
            mathMlOptions={mathMlOptions}
            charactersLimit={charactersLimit}
          />
        )}
      </div>
    </Readable>
  );
};

LabelComponent.propTypes = {
  disabledLabel: PropTypes.bool,
  graphHeight: PropTypes.number,
  graphWidth: PropTypes.number,
  isChartBottomLabel: PropTypes.bool,
  isDefineChartBottomLabel: PropTypes.bool,
  isChartLeftLabel: PropTypes.bool,
  isDefineChartLeftLabel: PropTypes.bool,
  placeholder: PropTypes.string,
  text: PropTypes.string,
  side: PropTypes.string,
  onChange: PropTypes.func,
  mathMlOptions: PropTypes.object,
  charactersLimit: PropTypes.number,
  titleHeight: PropTypes.number,
};

export default LabelComponent;
