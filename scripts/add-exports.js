#!/usr/bin/env node

const { readdirSync, pathExistsSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { join } = require('path');

const packagesDir = join(__dirname, '../packages');

// Packages that have ESM builds
const packages = readdirSync(packagesDir).filter(dir => {
  const esmIndex = join(packagesDir, dir, 'esm', 'index.js');
  return pathExistsSync(esmIndex);
});

console.log(`🔧 Adding exports field to ${packages.length} packages...\n`);

for (const pkgName of packages) {
  const pkgPath = join(packagesDir, pkgName, 'package.json');
  const pkg = readJsonSync(pkgPath);

  // Skip if exports already exists
  if (pkg.exports) {
    console.log(`⏭️  @pie-lib/${pkgName} - already has exports`);
    continue;
  }

  // Add exports field
  pkg.exports = {
    '.': {
      import: './esm/index.js',
      require: './lib/index.js',
      default: './esm/index.js'
    }
  };

  writeJsonSync(pkgPath, pkg, { spaces: 2 });
  console.log(`✅ @pie-lib/${pkgName} - added exports`);
}

console.log(`\n✨ Done!`);

