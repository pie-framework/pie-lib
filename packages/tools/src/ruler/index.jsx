import React from 'react';
import { withStyles } from 'material-ui/styles';
import Rotatable from '../rotatable';
import classNames from 'classnames';
import RulerGraphic from './graphic';
import PropTypes from 'prop-types';
import Anchor from '../anchor';

export class Ruler extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    units: PropTypes.number.isRequired,
    measure: PropTypes.oneOf(['imperial', 'metric']).isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    startPosition: PropTypes.shape({
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired
    })
  };

  static defaultProps = {
    width: 480,
    height: 60,
    measure: 'imperial',
    units: 12
  };

  render() {
    const {
      classes,
      width,
      height,
      units,
      measure,
      className,
      startPosition
    } = this.props;

    const unit =
      measure === 'imperial'
        ? {
            type: 'in',
            ticks: 16
          }
        : {
            type: 'cm',
            ticks: 10
          };
    return (
      <Rotatable
        className={className}
        startPosition={startPosition}
        handle={[
          { class: 'leftAnchor', origin: 'bottom right' },
          { class: 'rightAnchor', origin: 'bottom left' }
        ]}
      >
        <div
          className={classes.ruler}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <RulerGraphic
            width={width}
            height={height}
            units={units}
            unit={unit}
          />
          <Anchor className={classNames('leftAnchor', classes.leftAnchor)} />
          <Anchor className={classNames('rightAnchor', classes.rightAnchor)} />
        </div>
      </Rotatable>
    );
  }
}
const styles = theme => ({
  ruler: {
    cursor: 'move',
    position: 'relative',
    backgroundColor: theme.palette.secondary.light,
    opacity: 1.0,
    border: `solid 0px ${theme.palette.primary.main}`
  },
  leftAnchor: {
    left: '-10px',
    bottom: '-10px'
  },
  rightAnchor: {
    right: '-10px',
    bottom: '-10px'
  }
});

export default withStyles(styles)(Ruler);
