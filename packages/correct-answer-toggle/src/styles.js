'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var noTouch = {
  '-webkit-touchCcallout': 'none',
  '-webkit-user-select': 'none',
  '-khtml-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  'user-select': 'none'
};

exports.default = {

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
};
var animationStyles = exports.animationStyles = {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcnJlY3QtYW5zd2VyLXRvZ2dsZS9zcmMvc3R5bGVzLmpzIl0sIm5hbWVzIjpbIm5vVG91Y2giLCJyb290Iiwid2lkdGgiLCJjdXJzb3IiLCJleHBhbmRlciIsInBvc2l0aW9uIiwiaGVpZ2h0IiwidHJhbnNpdGlvbiIsIm92ZXJmbG93IiwiZGlzcGxheSIsImNvbnRlbnQiLCJtYXJnaW4iLCJ0ZXh0QWxpZ24iLCJsYWJlbCIsIk9iamVjdCIsImFzc2lnbiIsImZvbnRGYW1pbHkiLCJsaW5lSGVpZ2h0IiwidmVydGljYWxBbGlnbiIsImNvbG9yIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiaWNvbiIsImljb25Ib2xkZXIiLCJtYXJnaW5SaWdodCIsImFuaW1hdGlvblN0eWxlcyIsImVudGVyIiwib3BhY2l0eSIsImVudGVyQWN0aXZlIiwiZXhpdCIsImV4aXRBY3RpdmUiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTTsyQkFBVSxBQUNXLEFBQ3pCO3lCQUZjLEFBRVMsQUFDdkI7d0JBSGMsQUFHUSxBQUN0QjtzQkFKYyxBQUlNLEFBQ3BCO3FCQUxjLEFBS0ssQUFDbkI7aUJBTkYsQUFBZ0IsQUFNQztBQU5ELEFBQ2Q7Ozs7O1dBVU0sQUFDRyxBQUNQO1lBSlcsQUFFUCxBQUVJLEFBRVY7QUFKTSxBQUNKOztjQUdRLEFBQ0UsQUFDVjtZQUZRLEFBRUEsQUFDUjtnQkFIUSxBQUdJLEFBQ1o7Y0FKUSxBQUlFLEFBQ1Y7YUFMUSxBQUtDLEFBQ1Q7O2NBTlEsQUFNRSxBQUNBLEFBRVY7QUFIVSxBQUNSOztjQWJTLEFBTUgsQUFTRSxBQUNBLEFBR1o7QUFKWSxBQUNSO0FBVk0sQUFDUjs7WUFZTyxBQUNDLEFBQ1I7ZUFGTyxBQUVJLEFBQ1g7YUF0QlcsQUFtQkosQUFHRSxBQUVYO0FBTFMsQUFDUDtnQkFJSyxBQUFPO1dBQU8sQUFDWixBQUNQO2dCQUZtQixBQUVQLEFBQ1o7WUFIbUIsQUFHWCxBQUNSO2dCQUptQixBQUlQLEFBQ1o7bUJBTG1CLEFBS0osQUFDZjtXQU5tQixBQU1aLEFBQ1A7Y0FQbUIsQUFPVCxBQUNWO2dCQVJLLEFBQWMsQUFRUDtBQVJPLEFBQ25CLEdBREssRUF4Qk0sQUF3Qk4sQUFTSixBQUNIOztjQWxDYSxBQWtDUCxBQUNNLEFBRVo7QUFITSxBQUNKOztXQUVVLEFBQ0gsQUFDUDtpQkF2Q1csQUFxQ0QsQUFFRyxBO0FBRkgsQUFDVjtBQXRDVyxBQUViO0FBeUNLLElBQU07O2FBQWtCLEFBQ3RCLEFBQ0ksQUFFWDtBQUhPLEFBQ0w7O2FBRVcsQUFDRixBQUNUO2dCQU4yQixBQUloQixBQUVDLEFBRWQ7QUFKYSxBQUNYOzthQUwyQixBQVF2QixBQUNLLEFBRVg7QUFITSxBQUNKOzthQUVVLEFBQ0QsQUFDVDtnQkFiRyxBQUF3QixBQVdqQixBQUVFO0FBRkYsQUFDVjtBQVoyQixBQUM3QiIsImZpbGUiOiJzdHlsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBub1RvdWNoID0ge1xuICAnLXdlYmtpdC10b3VjaENjYWxsb3V0JzogJ25vbmUnLFxuICAnLXdlYmtpdC11c2VyLXNlbGVjdCc6ICdub25lJyxcbiAgJy1raHRtbC11c2VyLXNlbGVjdCc6ICdub25lJyxcbiAgJy1tb3otdXNlci1zZWxlY3QnOiAnbm9uZScsXG4gICctbXMtdXNlci1zZWxlY3QnOiAnbm9uZScsXG4gICd1c2VyLXNlbGVjdCc6ICdub25lJ1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgcm9vdDoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgY3Vyc29yOiAncG9pbnRlcidcbiAgfSxcbiAgZXhwYW5kZXI6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBoZWlnaHQ6IDAsXG4gICAgdHJhbnNpdGlvbjogJ2hlaWdodCBlYXNlLWluIDMwMG1zJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICcmLnNob3cnOiB7XG4gICAgICBoZWlnaHQ6ICcyNXB4J1xuICAgIH0sXG4gICAgJyYuaGlkZSc6IHtcbiAgICAgIGhlaWdodDogJzAnXG4gICAgfVxuICB9LFxuICBjb250ZW50OiB7XG4gICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGRpc3BsYXk6ICdmbGV4J1xuICB9LFxuICBsYWJlbDogT2JqZWN0LmFzc2lnbih7XG4gICAgd2lkdGg6ICcxNDBweCcsXG4gICAgZm9udEZhbWlseTogXCInUm9ib3RvJywgc2Fucy1zZXJpZlwiLFxuICAgIGhlaWdodDogJzI1cHgnLFxuICAgIGxpbmVIZWlnaHQ6ICcyNXB4JyxcbiAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICBjb2xvcjogJ3ZhcigtLWNvcnJlY3QtYW5zd2VyLXRvZ2dsZS1sYWJlbC1jb2xvciwgIGJsYWNrKScsXG4gICAgZm9udFNpemU6ICcxNXB4JyxcbiAgICBmb250V2VpZ2h0OiAnbm9ybWFsJ1xuICB9LCBub1RvdWNoKSxcbiAgaWNvbjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gIH0sXG4gIGljb25Ib2xkZXI6IHtcbiAgICB3aWR0aDogJzI1cHgnLFxuICAgIG1hcmdpblJpZ2h0OiAnNXB4J1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBhbmltYXRpb25TdHlsZXMgPSB7XG4gIGVudGVyOiB7XG4gICAgb3BhY2l0eTogJzAnLFxuICB9LFxuICBlbnRlckFjdGl2ZToge1xuICAgIG9wYWNpdHk6ICcxJyxcbiAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjNzIGVhc2UtaW4nXG4gIH0sXG4gIGV4aXQ6IHtcbiAgICBvcGFjaXR5OiAnMScsXG4gIH0sXG4gIGV4aXRBY3RpdmU6IHtcbiAgICBvcGFjaXR5OiAnMCcsXG4gICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMC4zcyBlYXNlLWluJ1xuICB9XG59XG4iXX0=