const { getPackages } = require('@pie-framework/build-helper');

const { join, resolve, basename } = require('path');
const { writeJsonSync } = require('fs-extra');
const pkgs = getPackages(resolve(__dirname, '..', 'packages'));

pkgs.forEach(p => {
  if (p.pkg.scripts) {
    delete p.pkg.scripts.prepack;
  }
  console.log('update', p.pkg.name);
  writeJsonSync(join(p.dir, 'package.json'), p.pkg, { spaces: '  ' });
});
