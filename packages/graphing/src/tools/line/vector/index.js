import React from 'react';
import LineComponent from '../common/component';
import _ from 'lodash';

export const tool = () => ({
  type: 'vector',
  Component: props => <LineComponent {...props} type="vector" />,
  addPoint: (point, mark) => {
    if (!mark) {
      return {
        type: 'vector',
        building: true,
        from: point
      };
    }

    if (_.isEqual(point, mark.from)) {
      return { ...mark };
    }

    return { ...mark, building: false, to: point };
  }
});
