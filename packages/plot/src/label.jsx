import React, { useState } from 'react';
import { Readable } from '@pie-lib/render-ui';
import EditableHtml from '@pie-lib/editable-html';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { extractTextFromHTML, isEmptyString } from './utils';

const StyledLabel = styled('div', {
  shouldForwardProp: (prop) => !['side', 'rotatedToHorizontal', 'isChart', 'isChartBottomLabel', 'isDefineChartBottomLabel', 'disabledLabel', 'isEmpty'].includes(prop),
})(({ theme, side, rotatedToHorizontal, isChart, isChartBottomLabel, isDefineChartBottomLabel, disabledLabel, isEmpty }) => ({
  fontSize: isChart ? theme.typography.fontSize + 2 : theme.typography.fontSize - 2,
  textAlign: 'center',
  margin: theme.spacing(0.5),
  padding: `${theme.spacing(0.5)} 0`,
  display: disabledLabel && !isChart && isEmpty ? 'none' : 'block',
  position: (isChartBottomLabel || isDefineChartBottomLabel || side === 'left' || side === 'right') ? 'absolute' : 'relative',
  ...(side === 'left' && !rotatedToHorizontal && {
    WebkitTransform: 'rotate(-90deg)',
    transformOrigin: '0 0',
    transformStyle: 'preserve-3d',
  }),
  ...(side === 'right' && !rotatedToHorizontal && {
    WebkitTransform: 'rotate(90deg)',
    transformOrigin: '0 0',
    transformStyle: 'preserve-3d',
  }),
  ...(rotatedToHorizontal && {
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
  }),
}));

const DisabledLabel = styled('div')({
  pointerEvents: 'none',
  width: '100%',
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
    top: (side === 'right' && `${graphHeight - 22}px`) || 0,
    left: 0,
  };

  const rotateLabel = () => !disabledLabel && (side === 'left' || side === 'right') && setRotatedToHorizontal(true);

  return (
    <Readable false>
      <StyledLabel
        side={side}
        rotatedToHorizontal={rotatedToHorizontal}
        isChart={isChart}
        isChartBottomLabel={isChartBottomLabel}
        isDefineChartBottomLabel={isDefineChartBottomLabel}
        disabledLabel={disabledLabel}
        isEmpty={isEmptyString(extractTextFromHTML(text))}
        style={rotatedToHorizontal ? rotatedStyle : defaultStyle}
        onClick={rotateLabel}
      >
        {disabledLabel ? (
          <DisabledLabel dangerouslySetInnerHTML={{ __html: text || '' }} />
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
            onDone={() => setRotatedToHorizontal(false)}
            mathMlOptions={mathMlOptions}
            charactersLimit={charactersLimit}
          />
        )}
      </StyledLabel>
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
