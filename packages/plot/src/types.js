import PropTypes from 'prop-types';

export const BaseDomainRangeType = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number
};

export const DomainType = PropTypes.shape(BaseDomainRangeType);

export const RangeType = PropTypes.shape(BaseDomainRangeType);

export const SizeType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
});

export const ChildrenType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node
]).isRequired;

export const ScaleType = PropTypes.shape({
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired
});

export const SnapType = PropTypes.shape({
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired
});

export const GraphPropsType = PropTypes.shape({
  scale: ScaleType.isRequired,
  snap: SnapType.isRequired,
  domain: DomainType.isRequired,
  range: RangeType.isRequired,
  size: SizeType.isRequired
});
