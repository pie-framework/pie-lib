/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const commonJs = {};

const packagesDir = path.resolve(__dirname, '../packages');
const listPackages = () => {
  const files = fs.readdirSync(packagesDir);

  return _.compact(
    files
      .filter(f => !f.includes('@'))
      .filter(f => fs.lstatSync(path.join(packagesDir, f)).isDirectory())
      .map(f => {
        const p = fs.readJsonSync(path.join(packagesDir, f, 'package.json'));
        if (!p.module) {
          return;
        }
        return p.name;
      })
  );
};

/**
 * Note:
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

module.exports = {
  /**
   * Note: With this config we are not going to build modules for the libs.
   * Instead we're bundling libs into dll packages so they can be used by clients.
   * for this reason - we have no packages to build.
   */
  packages: [],
  range: '^',
  mode: 'production',
  minify: false,
  packagesDir,
  extensions: { commonJs },
  type: 'npm-package',

  /**
   * Note: the libs feed into each other, so start with the edges that the later libs can then hook into.
   */
  libs: {
    repository: 'pie-framework/pie-lib',
    packages: [
      {
        name: '@pie-lib/math-rendering-module',
        output: packagesDir,
        repository: 'pie-framework/pie-lib',
        extensions: { commonJs },
        imports: {
          namespace: ['@pie-lib/math-rendering']
        }
      },
      // core shared module lib
      {
        name: '@pie-lib/shared-module',
        imports: {
          default: [
            'react-dom',
            'react-dom/server',
            'react',
            'prop-types',
            '@pie-lib/correct-answer-toggle',
            'lodash',
            'classnames',
            'debug'
          ],
          namespace: [
            '@material-ui/core/styles/colorManipulator',
            '@material-ui/core/Collapse/index',
            '@material-ui/core/styles',
            '@material-ui/core',
            '@material-ui/icons',
            '@pie-lib/render-ui'
          ]
        }
      },
      {
        name: '@pie-lib/drag-module',
        output: packagesDir,
        repository: 'pie-framework/pie-lib',
        extensions: { commonJs },
        imports: {
          namespace: ['@pie-lib/drag']
        }
      },
      {
        name: '@pie-lib/math-edit-module',
        // eslint-disable-next-line no-undef
        imports: {
          default: ['@pie-framework/mathquill'],
          namespace: ['@pie-lib/math-input', '@pie-lib/math-toolbar']
        }
      },
      {
        name: '@pie-lib/editable-html-module',
        imports: {
          default: ['@pie-lib/editable-html']
        }
      },
      {
        name: '@pie-lib/config-module',
        imports: {
          namespace: ['@pie-lib/config-ui']
        }
      },

      {
        name: '@pie-lib/graphing-module',
        // add dependency here? or use the order?
        // output: path.resolve(__dirname, '../packages'),
        imports: {
          default: [],
          namespace: [
            '@pie-lib/plot',
            '@pie-lib/graphing',
            // take d3-scale from the repo root... so 2.x
            'd3-scale',
            'd3-selection'
          ]
        }
      }
    ]
  }
};
