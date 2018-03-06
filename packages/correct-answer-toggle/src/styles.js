const noTouch = {
  '-webkit-touchCcallout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
}

export default {

  root: {
    width: '100%',
    cursor: 'pointer'
  },
  expander: {
    position: 'relative',
    height: 0,
    transition: 'height ease-in 300ms',
    overflow: 'hidden',
    display: 'flex',
    '&.show': {
      height: '25px'
    },
    '&.hide': {
      height: '0'
    }
  },
  content: {
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex'
  },
  label: Object.assign({
    width: '140px',
    fontFamily: "'Roboto', sans-serif",
    height: '25px',
    lineHeight: '25px',
    verticalAlign: 'middle',
    color: 'var(--correct-answer-toggle-label-color,  black)',
    fontSize: '15px',
    fontWeight: 'normal'
  }, noTouch),
  icon: {
    position: 'absolute'
  },
  iconHolder: {
    width: '25px',
    marginRight: '5px'
  }
}

export const animationStyles = {
  enter: {
    opacity: '0',
  },
  enterActive: {
    opacity: '1',
    transition: 'opacity 0.3s ease-in'
  },
  exit: {
    opacity: '1',
  },
  exitActive: {
    opacity: '0',
    transition: 'opacity 0.3s ease-in'
  }
}
