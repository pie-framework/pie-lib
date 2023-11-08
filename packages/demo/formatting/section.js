'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _react = _interopRequireDefault(require('react'));

var _styles = require('@material-ui/core/styles');

var _Typography = _interopRequireDefault(require('@material-ui/core/Typography'));

var Section = (0, _styles.withStyles)(function(theme) {
  return {
    section: {
      padding: '0px',
      paddingTop: '40px',
      paddingBottom: '40px',
      position: 'relative',
    },
    header: {
      position: 'relative',
      paddingBottom: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      '&::after': {
        display: 'block',
        position: 'absolute',
        left: '0',
        bottom: '0',
        right: '0',
        height: '1px',
        content: '""',
        backgroundColor: 'rgba(0,0,0,0.2)',
      },
    },
  };
})(function(_ref) {
  var name = _ref.name,
    children = _ref.children,
    classes = _ref.classes;
  return /*#__PURE__*/ _react['default'].createElement(
    'div',
    {
      className: classes.section,
    },
    /*#__PURE__*/ _react['default'].createElement(
      _Typography['default'],
      {
        variant: 'h5',
        className: classes.header,
      },
      name,
    ),
    children,
  );
});
var _default = Section;
exports['default'] = _default;
//# sourceMappingURL=section.js.map
