#!/usr/bin/env node

/**
 * Build ESM bundles for pie-lib packages.
 *
 * Output per package:
 * - packages/<pkg>/esm/index.js (+ sourcemap)
 * - packages/<pkg>/esm/package.json with { "type": "module" }
 * - packages/<pkg>/esm/index.css (if the package imports CSS)
 *
 * This script is intentionally independent of the existing CJS build (lib/).
 */

/* eslint-disable no-console */
const { rollup } = require('rollup');
const { readdirSync, pathExistsSync, mkdirSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { resolve, join } = require('path');
const createConfig = require('../rollup.config.js').default;

const packagesDir = resolve(__dirname, '../packages');

// Packages that are not intended for browser consumption or are known to fail ESM bundling.
const BLACKLIST = new Set([
  'demo',
  'pie-toolbox',
  // test-utils pulls in enzyme / jsdom-heavy deps; keep ESM focused on runtime libs.
  'test-utils',
]);

function listPackages() {
  return readdirSync(packagesDir).filter((dir) => {
    const pkgPath = join(packagesDir, dir, 'package.json');
    if (!pathExistsSync(pkgPath)) return false;
    const pkg = readJsonSync(pkgPath);
    if (pkg.private) return false;
    if (BLACKLIST.has(dir)) return false;
    return true;
  });
}

async function buildEntry(pkgDir, entryRel, outputRel) {
  const input = join(pkgDir, entryRel);
  if (!pathExistsSync(input)) return null;

  const esmDir = join(pkgDir, 'esm');
  mkdirSync(esmDir, { recursive: true });

  // Mark directory as ESM to avoid Node warnings and to support tooling that reads package type.
  const esmPkgJson = join(esmDir, 'package.json');
  if (!pathExistsSync(esmPkgJson)) {
    writeJsonSync(esmPkgJson, { type: 'module' }, { spaces: 2 });
  }

  const outputFile = join(esmDir, outputRel);
  const config = createConfig(input, outputFile);

  try {
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();
    return outputRel;
  } catch (e) {
    console.error(`  ❌ failed: ${entryRel} -> ${outputRel}: ${e.message}`);
    return null;
  }
}

async function buildPackage(pkgName) {
  const pkgDir = join(packagesDir, pkgName);
  const pkgJson = readJsonSync(join(pkgDir, 'package.json'));
  console.log(`📦 ${pkgJson.name}`);

  const built = [];

  // Typical entrypoints in pie-lib: src/index.js or src/index.jsx
  let main = await buildEntry(pkgDir, 'src/index.js', 'index.js');
  if (!main) main = await buildEntry(pkgDir, 'src/index.jsx', 'index.js');
  if (main) built.push(main);

  if (built.length) {
    console.log(`  ✅ built: ${built.join(', ')}`);
  } else {
    console.log('  ⏭️  no ESM entry found');
  }
}

async function main() {
  const start = Date.now();
  const pkgs = listPackages();
  console.log(`Building ESM for ${pkgs.length} packages...\n`);

  for (const p of pkgs) {
    // eslint-disable-next-line no-await-in-loop
    await buildPackage(p);
  }

  const dur = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\nDone in ${dur}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
