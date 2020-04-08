/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const reactIsExports = [
  'AsyncMode',
  'ConcurrentMode',
  'ContextConsumer',
  'ContextProvider',
  'Element',
  'ForwardRef',
  'Fragment',
  'Lazy',
  'Memo',
  'Portal',
  'Profiler',
  'StrictMode',
  'Suspense',
  'isAsyncMode',
  'isConcurrentMode',
  'isContextConsumer',
  'isContextProvider',
  'isElement',
  'isForwardRef',
  'isFragment',
  'isLazy',
  'isMemo',
  'isPortal',
  'isProfiler',
  'isStrictMode',
  'isSuspense',
  'isValidElementType',
  'typeOf'
];

const konva = [
  'Layer',
  'FastLayer',
  'Group',
  'Label',
  'Rect',
  'Circle',
  'Ellipse',
  'Wedge',
  'Transformer',
  'Line',
  'Sprite',
  'Image',
  'Text',
  'TextPath',
  'Star',
  'Ring',
  'Arc',
  'Tag',
  'Path',
  'RegularPolygon',
  'Arrow',
  'Shape',
  'useStrictMode',
  'Stage'
];

const commonJs = {
  namedExports: {
    'node_modules/react-draggable/dist/react-draggable.js': ['DraggableCore'],
    'node_modules/react-konva/lib/ReactKonva.js': konva,
    'node_modules/react-redux/node_modules/react-is/index.js': reactIsExports,
    //TODO: common js should be picking these up?
    'node_modules/react-is/index.js': reactIsExports,
    'node_modules/react/index.js': [
      'memo',
      'useLayoutEffect',
      'useEffect',
      'useState',
      'useCallback',
      'useContext',
      'cloneElement',
      'createElement',
      'createContext',
      'isValidElement',
      'useMemo',
      'useRef',

      'createRef',
      'Component'
    ],
    'node_modules/react-dom/server.browser.js': ['renderToStaticMarkup'],
    'node_modules/esrever/esrever.js': ['reverse'],
    'node_modules/immutable/dist/immutable.js': [
      'Map',
      'Set',
      'List',
      'Iterable',
      'Seq',
      'Collection',
      'OrderedMap',
      'Stack',
      'OrderedSet',
      'Record',
      'Range',
      'Repeat',
      'is',
      'fromJS'
    ]
  }
};

module.exports = {
  packages: [],
  pkg: {
    type: 'npm-package',
    mode: 'production',
    // eslint-disable-next-line no-undef
    root: path.resolve(__dirname, '../packages'),
    output: '$pkg/module/index.js',
    extensions: { commonJs }
  },
  libs: [
    {
      name: '@pie-lib/shared-core',
      // eslint-disable-next-line no-undef
      output: path.resolve(__dirname, '../packages'),
      minify: false,
      mode: 'development',
      repository: 'pie-framework/pie-ui',
      extensions: {
        commonJs
      },
      /**
       * Ideally namespace imports would be the default import method.
       * But this can cause problems if a library does the following:
       * `module.exports = require("path");` - this causes the properties to get lost,
       * when really we'd like all the properties to be set on the module.
       * For now - specify the import method as a key of `imports`.
       *
       * To fix this we'd probably need to make a change to rollup,
       * get it to follow the var until it gets to the object definition,
       * then to use the keys to set the export object.
       *
       * @see rollup/src/ast/NamespaceVariable
       * @see rollup/plugin-commonjs/ too
       */
      imports: {
        default: [
          'react-dom',
          'react-dom/server',
          'react',
          'prop-types',
          '@pie-lib/correct-answer-toggle',
          'lodash'
        ],
        namespace: [
          '@material-ui/core/styles/colorManipulator',
          '@material-ui/core/styles',
          '@material-ui/core',
          '@pie-lib/drag',
          '@pie-lib/math-rendering',
          '@pie-lib/mask-markup',
          '@pie-lib/render-ui',
          'mathjs',
          'react-dnd',
          'react-dnd-html5-backend',
          'react-transition-group'
        ]
      }
    },

    {
      name: '@pie-lib/shared-math-edit',
      // eslint-disable-next-line no-undef
      output: path.resolve(__dirname, '../packages'),
      minify: false,
      mode: 'development',
      repository: 'pie-framework/pie-ui',
      extensions: {
        commonJs
      },
      imports: {
        default: ['@pie-framework/mathquill'],
        namespace: ['@pie-lib/math-input', '@pie-lib/math-toolbar']
      }
    },
    /** earlier libs are fed in to subsequent libs .. */
    {
      name: '@pie-lib/shared-graphing',
      // add dependency here? or use the order?
      output: path.resolve(__dirname, '../packages'),
      mode: 'development',
      minify: false,
      extensions: {
        commonJs
      },
      imports: {
        default: [],
        namespace: ['@pie-lib/plot', '@pie-lib/graphing', 'd3-scale', 'd3-selection']
      }
    }
  ]
};
