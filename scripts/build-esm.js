#!/usr/bin/env node

const { rollup } = require('rollup');
const { readdirSync, pathExistsSync, mkdirSync, readJsonSync } = require('fs-extra');
const { resolve, join } = require('path');
const createConfig = require('../rollup.config.js').default;

const packagesDir = resolve(__dirname, '../packages');

// Packages that can't be built as ESM due to CommonJS source or other issues
const BLACKLIST = ['demo', 'pie-toolbox'];

const packages = readdirSync(packagesDir).filter(dir => {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!pathExistsSync(pkgPath)) return false;
  const pkg = readJsonSync(pkgPath);
  if (pkg.private) return false;
  if (BLACKLIST.includes(dir)) {
    console.log(`⏭️  Skipping ${dir} (blacklisted)`);
    return false;
  }
  return true;
});

console.log(`🔨 Building ESM bundles for ${packages.length} packages...\n`);

async function buildEntry(pkgDir, entry, outputName) {
  const input = join(pkgDir, entry);
  if (!pathExistsSync(input)) {
    return null;
  }

  const esmDir = join(pkgDir, 'esm');
  mkdirSync(esmDir, { recursive: true });

  const output = join(esmDir, outputName);
  const rollupConfig = createConfig(input, output);

  try {
    const bundle = await rollup(rollupConfig);
    await bundle.write(rollupConfig.output);
    return outputName;
  } catch (error) {
    console.error(`  ❌ Failed to build ${outputName}:`, error.message);
    return null;
  }
}

async function buildPackage(pkgName) {
  const pkgDir = join(packagesDir, pkgName);
  console.log(`📦 @pie-lib/${pkgName}`);

  const built = [];

  // Most pie-lib packages have a simple src/index.js entry point
  const main = await buildEntry(pkgDir, 'src/index.js', 'index.js');
  if (main) built.push(main);

  if (built.length > 0) {
    console.log(`  ✅ Built: ${built.join(', ')}`);
  } else {
    console.log(`  ⏭️  No ESM entries found`);
  }

  console.log();
}

async function main() {
  const startTime = Date.now();

  for (const pkg of packages) {
    await buildPackage(pkg);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✨ ESM build complete in ${duration}s`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});

