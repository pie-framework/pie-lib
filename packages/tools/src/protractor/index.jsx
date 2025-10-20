import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Graphic from './graphic';
import Anchor from '../anchor';
import Rotatable from '../rotatable';
import classNames from 'classnames';

const StyledProtractor = styled('div')(() => ({
  position: 'relative',
}));

const StyledLeftAnchor = styled(Anchor)(() => ({
  position: 'absolute',
  left: 0,
  bottom: 0,
}));

const StyledRightAnchor = styled(Anchor)(() => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
}));

export class Protractor extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    className: PropTypes.string,
    startPosition: PropTypes.shape({
      left: PropTypes.number,
      top: PropTypes.number,
    }),
  };

  static defaultProps = {
    width: 450,
    startPosition: { left: 0, top: 0 },
  };

  render() {
    const { width, className, startPosition } = this.props;
    return (
      <Rotatable
        className={className}
        startPosition={startPosition}
        handle={[
          {
            class: 'leftAnchor',
            origin: `${width * 0.495}px ${width * 0.49}px`,
          },
          {
            class: 'rightAnchor',
            origin: `${width * 0.495}px ${width * 0.49}px`,
          },
        ]}
      >
        <StyledProtractor style={{ width: `${width}px` }}>
          <Graphic />

          <StyledLeftAnchor className={classNames('leftAnchor')} />
          <StyledRightAnchor className={classNames('rightAnchor')} />
        </StyledProtractor>
      </Rotatable>
    );
  }
}

export default Protractor;
