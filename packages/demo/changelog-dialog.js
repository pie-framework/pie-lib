'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.ChangelogDialog = void 0;

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

var _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

var _inherits2 = _interopRequireDefault(require('@babel/runtime/helpers/inherits'));

var _possibleConstructorReturn2 = _interopRequireDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));

var _getPrototypeOf2 = _interopRequireDefault(require('@babel/runtime/helpers/getPrototypeOf'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = _interopRequireDefault(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _styles = require('@material-ui/core/styles');

var _Dialog = _interopRequireDefault(require('@material-ui/core/Dialog'));

var _DialogActions = _interopRequireDefault(require('@material-ui/core/DialogActions'));

var _DialogContent = _interopRequireDefault(require('@material-ui/core/DialogContent'));

var _DialogTitle = _interopRequireDefault(require('@material-ui/core/DialogTitle'));

var _Button = _interopRequireDefault(require('@material-ui/core/Button'));

var _markdownToJsx = _interopRequireDefault(require('markdown-to-jsx'));

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

var ChangelogDialog = /*#__PURE__*/ (function(_React$Component) {
  (0, _inherits2['default'])(ChangelogDialog, _React$Component);

  var _super = _createSuper(ChangelogDialog);

  function ChangelogDialog(props) {
    (0, _classCallCheck2['default'])(this, ChangelogDialog);
    return _super.call(this, props);
  }

  (0, _createClass2['default'])(ChangelogDialog, [
    {
      key: 'render',
      value: function render() {
        var _this$props = this.props,
          classes = _this$props.classes,
          onClose = _this$props.onClose,
          open = _this$props.open,
          activePackage = _this$props.activePackage;
        return activePackage
          ? /*#__PURE__*/ _react['default'].createElement(
              _Dialog['default'],
              {
                open: open,
                onClose: onClose,
                'aria-labelledby': 'alert-dialog-title',
                'aria-describedby': 'alert-dialog-description',
              },
              /*#__PURE__*/ _react['default'].createElement(
                _DialogTitle['default'],
                {
                  id: 'alert-dialog-title',
                },
                activePackage.pkg.name,
              ),
              /*#__PURE__*/ _react['default'].createElement(
                _DialogContent['default'],
                null,
                /*#__PURE__*/ _react['default'].createElement(
                  _markdownToJsx['default'],
                  {
                    className: classes.md,
                  },
                  activePackage.nextChangelog,
                ),
                /*#__PURE__*/ _react['default'].createElement('hr', null),
                /*#__PURE__*/ _react['default'].createElement(
                  _markdownToJsx['default'],
                  {
                    className: classes.md,
                  },
                  activePackage.changelog,
                ),
              ),
              /*#__PURE__*/ _react['default'].createElement(
                _DialogActions['default'],
                null,
                /*#__PURE__*/ _react['default'].createElement(
                  _Button['default'],
                  {
                    onClick: onClose,
                    color: 'primary',
                    autoFocus: true,
                  },
                  'Close',
                ),
              ),
            )
          : null;
      },
    },
  ]);
  return ChangelogDialog;
})(_react['default'].Component);

exports.ChangelogDialog = ChangelogDialog;
(0, _defineProperty2['default'])(ChangelogDialog, 'propTypes', {
  classes: _propTypes['default'].object.isRequired,
  className: _propTypes['default'].string,
  onClose: _propTypes['default'].func.isRequired,
  open: _propTypes['default'].bool.isRequired,
  activePackage: _propTypes['default'].object,
});
(0, _defineProperty2['default'])(ChangelogDialog, 'defaultProps', {});

var styles = function styles() {
  return {
    md: {
      fontFamily: 'sans-serif',
    },
  };
};

var _default = (0, _styles.withStyles)(styles)(ChangelogDialog);

exports['default'] = _default;
//# sourceMappingURL=changelog-dialog.js.map
