import { calculateThirdPointOnLine } from '../../utils';

export const arrowDimensions = {
  none: 0,
  vector: 7,
  ray: 5,
  line: 5
};

export const calculateCorrectScaledPoints = (scale, from, to, type = 'none') => {
  const scaledFromX = scale.x(from.x);
  const scaledFromY = scale.y(from.y);
  let scaledToX = scale.x(to.x);
  let scaledToY = scale.y(to.y);
  let middlePoint;

  middlePoint = calculateThirdPointOnLine(
    { x: scaledToX, y: scaledToY },
    { x: scaledFromX, y: scaledFromY },
    {
      domain: {
        min: scale.x(to.x) - arrowDimensions[type],
        max: scale.x(to.x) + arrowDimensions[type]
      },
      range: {
        min: scale.y(to.y) - arrowDimensions[type],
        max: scale.y(to.y) + arrowDimensions[type]
      }
    }
  );

  if (middlePoint && isFinite(middlePoint.x) && isFinite(middlePoint.y)) {
    scaledToX = middlePoint.x;
    scaledToY = middlePoint.y;
  }

  return {
    x: scaledToX,
    y: scaledToY
  };
};
