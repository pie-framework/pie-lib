'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.Pre = void 0;

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

var _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

var _inherits2 = _interopRequireDefault(require('@babel/runtime/helpers/inherits'));

var _possibleConstructorReturn2 = _interopRequireDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));

var _getPrototypeOf2 = _interopRequireDefault(require('@babel/runtime/helpers/getPrototypeOf'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = _interopRequireDefault(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _styles = require('@material-ui/core/styles');

var _classnames = _interopRequireDefault(require('classnames'));

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2['default'])(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2['default'])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return (0, _possibleConstructorReturn2['default'])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    return true;
  } catch (e) {
    return false;
  }
}

var Pre = /*#__PURE__*/ (function(_React$Component) {
  (0, _inherits2['default'])(Pre, _React$Component);

  var _super = _createSuper(Pre);

  function Pre() {
    (0, _classCallCheck2['default'])(this, Pre);
    return _super.apply(this, arguments);
  }

  (0, _createClass2['default'])(Pre, [
    {
      key: 'render',
      value: function render() {
        var _this$props = this.props,
          classes = _this$props.classes,
          className = _this$props.className,
          value = _this$props.value;
        return /*#__PURE__*/ _react['default'].createElement(
          'pre',
          {
            className: (0, _classnames['default'])(classes['class'], className),
          },
          JSON.stringify(value, null, '  '),
        );
      },
    },
  ]);
  return Pre;
})(_react['default'].Component);

exports.Pre = Pre;
(0, _defineProperty2['default'])(Pre, 'propTypes', {
  classes: _propTypes['default'].object.isRequired,
  className: _propTypes['default'].string,
  value: _propTypes['default'].any,
});
(0, _defineProperty2['default'])(Pre, 'defaultProps', {});

var styles = function styles() {
  return {
    class: {},
  };
};

var _default = (0, _styles.withStyles)(styles)(Pre);

exports['default'] = _default;
//# sourceMappingURL=pre.js.map
