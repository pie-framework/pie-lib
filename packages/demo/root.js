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

var _Drawer = _interopRequireDefault(require('@material-ui/core/Drawer'));

var _AppBar = _interopRequireDefault(require('@material-ui/core/AppBar'));

var _Toolbar = _interopRequireDefault(require('@material-ui/core/Toolbar'));

var _Typography = _interopRequireDefault(require('@material-ui/core/Typography'));

var _List = _interopRequireDefault(require('@material-ui/core/List'));

var _ListItem = _interopRequireDefault(require('@material-ui/core/ListItem'));

var _ListItemText = _interopRequireDefault(require('@material-ui/core/ListItemText'));

var _link = _interopRequireDefault(require('next/link'));

var _Divider = _interopRequireDefault(require('@material-ui/core/Divider'));

var _router = require('next/router');

var _classnames = _interopRequireDefault(require('classnames'));

var _changelogDialog = _interopRequireDefault(require('./changelog-dialog'));

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

var drawerWidth = 240;

var styles = function styles(theme) {
  return {
    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      fontFamily: '"Roboto", sans-serif',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background['default'],
      padding: theme.spacing.unit * 3,
      minWidth: 0, // So the Typography noWrap works
    },
    toolbar: _objectSpread(
      _objectSpread({}, theme.mixins.toolbar),
      {},
      {
        display: 'flex',
        justifyContent: 'space-between',
      },
    ),
    devToolbar: {
      backgroundColor: 'orange',
    },
    extras: {
      float: 'right',
    },
  };
};

var PageTitle = (0, _router.withRouter)(function(_ref) {
  var router = _ref.router;
  var name = router.pathname.split('/')[1];
  var title = name ? '@pie-lib/'.concat(name) : '@pie-lib';
  return /*#__PURE__*/ _react['default'].createElement(
    _Typography['default'],
    {
      variant: 'h6',
      color: 'inherit',
      noWrap: true,
    },
    title,
  );
});
var ActiveLink = (0, _styles.withStyles)(function(theme) {
  return {
    active: {
      color: theme.palette.primary.main,
    },
    version: {
      fontSize: '11px',
      color: theme.palette.secondary.main,
    },
    versionActive: {
      color: theme.palette.primary.main,
    },
  };
})(
  (0, _router.withRouter)(function(_ref2) {
    var router = _ref2.router,
      path = _ref2.path,
      primary = _ref2.primary,
      classes = _ref2.classes,
      version = _ref2.version,
      onVersionClick = _ref2.onVersionClick;
    var isActive = path === router.pathname;
    return /*#__PURE__*/ _react['default'].createElement(
      _link['default'],
      {
        href: path,
        as: path,
      },
      /*#__PURE__*/ _react['default'].createElement(
        _ListItem['default'],
        {
          button: true,
        },
        /*#__PURE__*/ _react['default'].createElement(_ListItemText['default'], {
          primary: primary,
          classes: {
            primary: isActive && classes.active,
          },
        }),
        version &&
          /*#__PURE__*/ _react['default'].createElement(
            'span',
            {
              onClick: isActive
                ? function() {
                    return onVersionClick(path);
                  }
                : undefined,
              className: (0, _classnames['default'])(classes.version, isActive && classes.versionActive),
            },
            version,
          ),
      ),
    );
  }),
);

var ClippedDrawer = /*#__PURE__*/ (function(_React$Component) {
  (0, _inherits2['default'])(ClippedDrawer, _React$Component);

  var _super = _createSuper(ClippedDrawer);

  //(props) {
  function ClippedDrawer(props) {
    var _this;

    (0, _classCallCheck2['default'])(this, ClippedDrawer);
    _this = _super.call(this, props);
    (0, _defineProperty2['default'])((0, _assertThisInitialized2['default'])(_this), 'showChangeLog', function(path) {
      _this.setState({
        changelogOpen: true,
        changelogPath: path,
      });
    });
    (0, _defineProperty2['default'])((0, _assertThisInitialized2['default'])(_this), 'hideDialog', function() {
      _this.setState({
        changelogOpen: false,
        changelogPath: undefined,
      });
    });
    _this.state = {
      changelogOpen: false,
    };
    return _this;
  }

  (0, _createClass2['default'])(ClippedDrawer, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
          classes = _this$props.classes,
          children = _this$props.children,
          links = _this$props.links,
          gitInfo = _this$props.gitInfo,
          packageInfo = _this$props.packageInfo;
        var _this$state = this.state,
          changelogOpen = _this$state.changelogOpen,
          changelogPath = _this$state.changelogPath;
        var clPackage = changelogOpen
          ? packageInfo.find(function(pi) {
              return pi.dir.endsWith(changelogPath);
            })
          : undefined;
        return /*#__PURE__*/ _react['default'].createElement(
          'div',
          {
            className: classes.root,
          },
          /*#__PURE__*/ _react['default'].createElement(
            _AppBar['default'],
            {
              position: 'absolute',
              className: classes.appBar,
            },
            /*#__PURE__*/ _react['default'].createElement(
              _Toolbar['default'],
              {
                className: (0, _classnames['default'])(
                  classes.toolbar,
                  gitInfo.branch !== 'master' && classes.devToolbar,
                ),
              },
              /*#__PURE__*/ _react['default'].createElement(PageTitle, null),
              /*#__PURE__*/ _react['default'].createElement(
                'div',
                {
                  className: classes.extras,
                },
                gitInfo.branch,
                '\xA0|\xA0',
                /*#__PURE__*/ _react['default'].createElement(
                  'a',
                  {
                    href: 'https://github.com/pie-framework/pie-lib/commit/'.concat(gitInfo['short']),
                  },
                  gitInfo['short'],
                ),
              ),
            ),
          ),
          /*#__PURE__*/ _react['default'].createElement(
            _Drawer['default'],
            {
              variant: 'permanent',
              classes: {
                paper: classes.drawerPaper,
              },
            },
            /*#__PURE__*/ _react['default'].createElement('div', {
              className: classes.toolbar,
            }),
            /*#__PURE__*/ _react['default'].createElement(
              _List['default'],
              null,
              /*#__PURE__*/ _react['default'].createElement(ActiveLink, {
                path: '/',
                primary: 'Home',
              }),
              /*#__PURE__*/ _react['default'].createElement(_Divider['default'], null),
              links.map(function(l, index) {
                return /*#__PURE__*/ _react['default'].createElement(ActiveLink, {
                  key: index,
                  path: l.path,
                  primary: l.label,
                  onVersionClick: _this2.showChangeLog,
                  version: gitInfo.branch === 'master' ? l.version : l.version ? 'next' : undefined,
                });
              }),
            ),
          ),
          /*#__PURE__*/ _react['default'].createElement(
            'main',
            {
              className: classes.content,
            },
            /*#__PURE__*/ _react['default'].createElement('div', {
              className: classes.toolbar,
            }),
            children,
          ),
          /*#__PURE__*/ _react['default'].createElement(_changelogDialog['default'], {
            open: changelogOpen,
            onClose: this.hideDialog,
            activePackage: clPackage,
          }),
        );
      },
    },
  ]);
  return ClippedDrawer;
})(_react['default'].Component);

ClippedDrawer.propTypes = {
  gitInfo: _propTypes['default'].object,
  packageInfo: _propTypes['default'].array,
  links: _propTypes['default'].arrayOf(
    _propTypes['default'].shape({
      label: _propTypes['default'].string.isRequired,
      path: _propTypes['default'].string.isRequired,
    }),
  ).isRequired,
  children: _propTypes['default'].oneOfType([
    _propTypes['default'].arrayOf(_propTypes['default'].node),
    _propTypes['default'].node,
  ]).isRequired,
  classes: _propTypes['default'].object.isRequired,
};

var _default = (0, _styles.withStyles)(styles)(ClippedDrawer);

exports['default'] = _default;
//# sourceMappingURL=root.js.map
