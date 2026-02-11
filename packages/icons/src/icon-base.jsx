import { Circle, IconRoot, RoundFeedbackBox, Square, SquareFeedbackBox } from './icon-root';
import PropTypes from 'prop-types';
import React from 'react';

export default (Action, Emoji) => {
  class IconBase extends React.Component {
    static propTypes = {
      iconSet: PropTypes.oneOf(['emoji', 'check']),
      shape: PropTypes.oneOf(['round', 'square']),
      category: PropTypes.oneOf(['feedback', undefined]),
      open: PropTypes.bool,
      size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      fg: PropTypes.string,
      bg: PropTypes.string,
    };

    static defaultProps = {
      iconSet: 'check',
      shape: 'round',
      category: undefined,
      open: false,
      size: 30,
      fg: '#4aaf46',
      bg: '#f8ffe2',
    };

    render() {
      const { iconSet, shape, category, open, size, fg, bg } = this.props;

      const Foreground = iconSet === 'check' ? <Action fill={fg} /> : <Emoji fill={fg} />;
      const Background = iconSet === 'check' ? <Action fill={bg} /> : <Emoji fill={bg} />;

      const getBox = () => {
        if (category === 'feedback') {
          return shape === 'round' ? <RoundFeedbackBox fill={bg} /> : <SquareFeedbackBox fill={bg} />;
        } else {
          return shape === 'round' ? <Circle fill={bg} /> : <Square fill={bg} />;
        }
      };

      if (open) {
        return <IconRoot size={size}>{Background}</IconRoot>;
      }

      return (
        <IconRoot size={size}>
          {getBox()}
          {Foreground}
        </IconRoot>
      );
    }
  }

  return IconBase;
};
