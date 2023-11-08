'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.InputChooser = void 0;

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

var _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

var _assertThisInitialized2 = _interopRequireDefault(require('@babel/runtime/helpers/assertThisInitialized'));

var _inherits2 = _interopRequireDefault(require('@babel/runtime/helpers/inherits'));

var _possibleConstructorReturn2 = _interopRequireDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));

var _getPrototypeOf2 = _interopRequireDefault(require('@babel/runtime/helpers/getPrototypeOf'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = _interopRequireDefault(require('react'));

var _styles = require('@material-ui/core/styles');

var _Button = _interopRequireDefault(require('@material-ui/core/Button'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _InputLabel = _interopRequireDefault(require('@material-ui/core/InputLabel'));

var _MenuItem = _interopRequireDefault(require('@material-ui/core/MenuItem'));

var _FormControl = _interopRequireDefault(require('@material-ui/core/FormControl'));

var _Select = _interopRequireDefault(require('@material-ui/core/Select'));

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

var InputChooser = /*#__PURE__*/ (function(_React$Component) {
  (0, _inherits2['default'])(InputChooser, _React$Component);

  var _super = _createSuper(InputChooser);

  function InputChooser(props) {
    var _this;

    (0, _classCallCheck2['default'])(this, InputChooser);
    _this = _super.call(this, props);
    (0, _defineProperty2['default'])((0, _assertThisInitialized2['default'])(_this), 'changeSelection', function(e) {
      var newSelection = _this.props.inputOptions.find(function(i) {
        return i.html === e.target.value;
      });

      _this.setState(
        {
          selected: newSelection,
          userHtml: newSelection.html,
        },
        function() {
          _this.props.onChange(_this.state.userHtml);
        },
      );
    });
    var selected = props.inputOptions[0];
    _this.state = {
      selected: selected,
      userHtml: selected.html,
    };
    return _this;
  }

  (0, _createClass2['default'])(InputChooser, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
          classes = _this$props.classes,
          inputOptions = _this$props.inputOptions;
        var _this$state = this.state,
          userHtml = _this$state.userHtml,
          selected = _this$state.selected;
        return /*#__PURE__*/ _react['default'].createElement(
          'div',
          null,
          /*#__PURE__*/ _react['default'].createElement(
            'div',
            null,
            /*#__PURE__*/ _react['default'].createElement(
              'em',
              {
                className: classes.italic,
              },
              'You can enter your own markup here to see how it works with the editor.',
            ),
          ),
          /*#__PURE__*/ _react['default'].createElement('br', null),
          /*#__PURE__*/ _react['default'].createElement(
            _FormControl['default'],
            {
              className: classes.formControl,
            },
            /*#__PURE__*/ _react['default'].createElement(
              _InputLabel['default'],
              {
                htmlFor: 'markup',
              },
              'Example Markup',
            ),
            /*#__PURE__*/ _react['default'].createElement(
              _Select['default'],
              {
                value: selected.html,
                onChange: this.changeSelection,
                inputProps: {
                  name: 'markup',
                  id: 'markup',
                },
              },
              inputOptions.map(function(i) {
                return /*#__PURE__*/ _react['default'].createElement(
                  _MenuItem['default'],
                  {
                    key: i.label,
                    value: i.html,
                  },
                  i.label,
                );
              }),
            ),
          ),
          /*#__PURE__*/ _react['default'].createElement('br', null),
          /*#__PURE__*/ _react['default'].createElement('br', null),
          /*#__PURE__*/ _react['default'].createElement('textarea', {
            className: classes.textArea,
            onChange: function onChange(e) {
              return _this2.setState({
                userHtml: e.target.value,
              });
            },
            value: userHtml,
          }),
          /*#__PURE__*/ _react['default'].createElement(
            _Button['default'],
            {
              variant: 'contained',
              color: 'primary',
              onClick: function onClick() {
                return _this2.props.onChange(_this2.state.userHtml);
              },
            },
            'Update Editor',
          ),
        );
      },
    },
  ]);
  return InputChooser;
})(_react['default'].Component);

exports.InputChooser = InputChooser;
(0, _defineProperty2['default'])(InputChooser, 'propTypes', {
  classes: _propTypes['default'].object.isRequired,
  inputOptions: _propTypes['default'].array.isRequired,
  onChange: _propTypes['default'].func.isRequired,
});
var styles = {
  formControl: {
    width: '100%',
  },
  italic: {
    fontSize: '11px',
  },
  textArea: {
    width: '100%',
    height: '100px',
  },
};

var _default = (0, _styles.withStyles)(styles)(InputChooser);

exports['default'] = _default;
//# sourceMappingURL=input-chooser.js.map
