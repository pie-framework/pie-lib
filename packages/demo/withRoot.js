'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _classCallCheck2 = _interopRequireDefault(require('@babel/runtime/helpers/classCallCheck'));

var _createClass2 = _interopRequireDefault(require('@babel/runtime/helpers/createClass'));

var _assertThisInitialized2 = _interopRequireDefault(require('@babel/runtime/helpers/assertThisInitialized'));

var _inherits2 = _interopRequireDefault(require('@babel/runtime/helpers/inherits'));

var _possibleConstructorReturn2 = _interopRequireDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));

var _getPrototypeOf2 = _interopRequireDefault(require('@babel/runtime/helpers/getPrototypeOf'));

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _react = _interopRequireDefault(require('react'));

var _propTypes = _interopRequireDefault(require('prop-types'));

var _styles = require('@material-ui/core/styles');

var _CssBaseline = _interopRequireDefault(require('@material-ui/core/CssBaseline'));

var _getPageContext = _interopRequireDefault(require('./getPageContext'));

var _root = _interopRequireDefault(require('./root'));

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

// import links from './links';
function withRoot(Component) {
  var WithRoot = /*#__PURE__*/ (function(_React$Component) {
    (0, _inherits2['default'])(WithRoot, _React$Component);

    var _super = _createSuper(WithRoot);

    function WithRoot(props, context) {
      var _this;

      (0, _classCallCheck2['default'])(this, WithRoot);
      _this = _super.call(this, props, context);
      (0, _defineProperty2['default'])((0, _assertThisInitialized2['default'])(_this), 'pageContext', null);
      _this.pageContext = _this.props.pageContext || (0, _getPageContext['default'])();
      return _this;
    }

    (0, _createClass2['default'])(WithRoot, [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          // Remove the server-side injected CSS.
          var jssStyles = document.querySelector('#jss-server-side');

          if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
          }
        },
      },
      {
        key: 'render',
        value: function render() {
          // MuiThemeProvider makes the theme available down the React tree thanks to React context.
          return /*#__PURE__*/ _react['default'].createElement(
            _styles.MuiThemeProvider,
            {
              theme: this.pageContext.theme,
              sheetsManager: this.pageContext.sheetsManager,
            },
            /*#__PURE__*/ _react['default'].createElement(_CssBaseline['default'], null),
            /*#__PURE__*/ _react['default'].createElement(
              _root['default'], // eslint-disable-next-line
              {
                gitInfo: process.env.gitInfo, // eslint-disable-next-line
                links: process.env.links, // eslint-disable-next-line
                packageInfo: process.env.packageInfo,
              },
              /*#__PURE__*/ _react['default'].createElement(Component, this.props),
            ),
          );
        },
      },
    ]);
    return WithRoot;
  })(_react['default'].Component);

  WithRoot.propTypes = {
    pageContext: _propTypes['default'].object,
  };

  WithRoot.getInitialProps = function(ctx) {
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx);
    }

    return {};
  };

  return WithRoot;
}

var _default = withRoot;
exports['default'] = _default;
//# sourceMappingURL=withRoot.js.map
