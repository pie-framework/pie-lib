import React from 'react';
import { styled } from '@mui/material/styles';
import Rotatable from '../rotatable';
import classNames from 'classnames';
import RulerGraphic from './graphic';
import PropTypes from 'prop-types';
import Anchor from '../anchor';

const StyledRuler = styled('div')(({ theme }) => ({
  cursor: 'move',
  position: 'relative',
  backgroundColor: theme.palette.secondary.light,
  opacity: 1.0,
  border: `solid 0px ${theme.palette.primary.main}`,
}));

const StyledLeftAnchor = styled(Anchor)(() => ({
  left: '-10px',
  top: '40%',
}));

const StyledRightAnchor = styled(Anchor)(() => ({
  right: '-10px',
  top: '40%',
}));

export class Ruler extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    units: PropTypes.number.isRequired,
    measure: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    className: PropTypes.string,
    startPosition: PropTypes.shape({
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
    }),
    label: PropTypes.string,
    tickCount: PropTypes.number,
  };

  static defaultProps = {
    width: 480,
    height: 60,
    measure: 'imperial',
    units: 12,
  };

  render() {
    const { width, height, units, measure, className, startPosition, label, tickCount } = this.props;

    const unit =
      measure === 'imperial'
        ? {
            type: label,
            ticks: tickCount && tickCount % 4 === 0 ? tickCount : 16,
          }
        : {
            type: label,
            ticks: 10,
          };
    return (
      <Rotatable
        className={className}
        startPosition={startPosition}
        handle={[
          { class: 'leftAnchor', origin: 'bottom right' },
          { class: 'rightAnchor', origin: 'bottom left' },
        ]}
      >
        <StyledRuler style={{ width: `${width}px`, height: `${height}px` }}>
          <RulerGraphic width={width} height={height} units={units} unit={unit} />
          <StyledLeftAnchor className={classNames('leftAnchor')} />
          <StyledRightAnchor className={classNames('rightAnchor')} />
        </StyledRuler>
      </Rotatable>
    );
  }
}

export default Ruler;
