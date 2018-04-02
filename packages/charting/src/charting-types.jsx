import PropTypes from 'prop-types';

export const PointType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
});

export const LineType = PropTypes.shape({
  from: PointType.isRequired,
  to: PointType.isRequired
});

export const AxisType = PropTypes.shape({
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string,
  labelFrequency: PropTypes.number,
  step: PropTypes.number,
  padding: PropTypes.number
});
