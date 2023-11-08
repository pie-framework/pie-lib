'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.Header = exports.Body = void 0;

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = _interopRequireDefault(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _Typography = _interopRequireDefault(require('@material-ui/core/Typography'));

var _styles = require('@material-ui/core/styles');

var _lodash = _interopRequireDefault(require('lodash'));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })),
      keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function(key) {
          (0, _defineProperty2['default'])(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
      : ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
  }
  return target;
}

var comp = function comp(variant, styles) {
  var out = (0, _styles.withStyles)(function(theme) {
    styles = _lodash['default'].isFunction(styles) ? styles(theme) : styles;
    return {
      comp: _objectSpread(
        {
          paddingTop: theme.spacing.unit,
          paddingBottom: theme.spacing.unit,
        },
        styles,
      ),
    };
  })(function(_ref) {
    var children = _ref.children,
      classes = _ref.classes;
    return /*#__PURE__*/ _react['default'].createElement(
      _Typography['default'],
      {
        className: classes.comp,
        variant: variant,
      },
      children,
    );
  });
  out.propTypes = {
    children: _propTypes['default'].oneOfType([
      _propTypes['default'].arrayOf(_propTypes['default'].node),
      _propTypes['default'].node,
    ]).isRequired,
  };
  return out;
};

var Body = comp('body1', {
  paddingTop: '0px',
});
exports.Body = Body;
var Header = comp('title');
exports.Header = Header;
//# sourceMappingURL=index.js.map
