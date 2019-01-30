import PropTypes from 'prop-types';

export const ToolPropType = {
  mark: PropTypes.any,
  onChange: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragStop: PropTypes.func
};

export const PointType = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};
