const { getPackages } = require('@pie-framework/build-helper');

const { join, resolve, basename } = require('path');
const { writeJsonSync } = require('fs-extra');
const pkgs = getPackages(resolve(__dirname, '..', 'packages'));

pkgs.forEach(p => {
  p.pkg.scripts = {
    prepack: `../../scripts/build changelog --scope ${basename(p.dir)}`
  };
  console.log('update', p.pkg.name);
  writeJsonSync(join(p.dir, 'package.json'), p.pkg, { spaces: '  ' });
});
