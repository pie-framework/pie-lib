import React from 'react';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { color } from '@pie-lib/render-ui';
import { grey } from '@mui/material/colors';

const StyledPlaceholder = styled('div')(({ theme }) => ({
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  KhtmlUserSelect: 'none',
  MozUserSelect: 'none',
  MsUserSelect: 'none',
  userSelect: 'none',
  width: '100%',
  height: '100%',
  background: color.white(),
  transition: 'background-color 200ms linear, border-color 200ms linear',
  boxSizing: 'border-box',
  display: 'grid',
  gridRowGap: `${theme.spacing(1)}px`,
  gridColumnGap: `${theme.spacing(1)}px`,
  padding: theme.spacing(1),
  border: `2px dashed ${color.black()}`,
  '&.disabled': {
    boxShadow: 'none',
    background: theme.palette.background.paper,
  },
  '&.over': {
    border: `1px solid ${grey[500]}`,
    backgroundColor: `${grey[300]}`,
  },
  '&.board': {
    padding: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: '100px',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'none',
    backgroundColor: color.backgroundDark(),
  },
  '&.categorizeBoard': {
    padding: theme.spacing(0.5),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: '100px',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'none',
    backgroundColor: color.backgroundDark(),
  },
  '&.verticalPool': {
    display: 'flex',
    flexFlow: 'column wrap',
  },
}));

export const PlaceHolder = (props) => {
  const {
    children,
    className,
    isOver,
    type,
    grid,
    disabled,
    choiceBoard,
    isCategorize,
    isVerticalPool,
    minHeight,
  } = props;

  const names = classNames(
    'placeholder',
    disabled && 'disabled',
    isOver && 'over',
    type,
    className,
  );

  const style = {};

  if (grid && grid.columns) {
    style.gridTemplateColumns = `repeat(${grid.columns}, 1fr)`;
  }

  if (grid && grid.rows) {
    const repeatValue = grid.rowsRepeatValue || '1fr';

    style.gridTemplateRows = `repeat(${grid.rows}, ${repeatValue})`;
  }

  // The "type" is only sent through placement-ordering / placeholder
  // It can be "choice" or "target"
  // We apply a different style for the "choice" type
  // For any other type, use a dashed black border and a white fill
  if (type === 'choice') {
    style.border = `1px solid ${color.borderLight()}`;
    style.background = color.backgroundDark();
  }

  const boardStyle = isCategorize ? 'categorizeBoard' : 'board';

  return (
    <StyledPlaceholder
      style={{ ...style, minHeight: minHeight }}
      className={classNames(
        choiceBoard ? boardStyle : names,
        isVerticalPool && 'verticalPool',
      )}
    >
      {children}
    </StyledPlaceholder>
  );
};

PlaceHolder.propTypes = {
  choiceBoard: PropTypes.bool,
  grid: PropTypes.shape({
    columns: PropTypes.number,
    rows: PropTypes.number,
    // if a different value then 1fr is wanted
    rowsRepeatValue: PropTypes.string,
  }),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  isOver: PropTypes.bool,
  index: PropTypes.number,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  isCategorize: PropTypes.bool,
  isVerticalPool: PropTypes.bool,
  minHeight: PropTypes.number,
};

export default PlaceHolder;
