import { color } from '@pie-lib/render-ui';

const noTouch = {
  '-webkit-touchCcallout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
};

export default {
  root: {
    width: '100%',
    cursor: 'pointer'
  },
  content: {
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex'
  },
  label: Object.assign(
    {
      width: '140px',
      // eslint-disable-next-line
      fontFamily: "'Roboto', sans-serif",
      height: '25px',
      lineHeight: '25px',
      verticalAlign: 'middle',
      color: `var(--correct-answer-toggle-label-color,  ${color.text()})`,
      fontSize: '15px',
      fontWeight: 'normal'
    },
    noTouch
  ),
  icon: {
    position: 'absolute',
    width: '25px'
  },
  iconHolder: {
    width: '25px',
    marginRight: '5px'
  },
  enter: {
    opacity: '0'
  },
  enterActive: {
    opacity: '1',
    transition: 'opacity 0.3s ease-in'
  },
  exit: {
    opacity: '1'
  },
  exitActive: {
    opacity: '0',
    transition: 'opacity 0.3s ease-in'
  }
};

export const animationStyles = {};
