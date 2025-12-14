#!/usr/bin/env node

/**
 * Add opt-in ESM subpath exports to pie-lib packages without changing
 * current development behavior.
 *
 * Strategy:
 * - Keep package root (".") resolving exactly as today:
 *   - require -> main (lib/)
 *   - import  -> module (src/)
 * - Add an opt-in ESM subpath:
 *   - ./esm -> ./esm/index.js
 *
 * This avoids requiring ESM builds during normal development while enabling
 * early adopters to import ESM explicitly.
 */

/* eslint-disable no-console */
const { readdirSync } = require('fs');
const { pathExistsSync, readJsonSync, writeJsonSync } = require('fs-extra');
const { join, resolve } = require('path');

const root = resolve(__dirname, '..');
const packagesDir = join(root, 'packages');

const blacklist = new Set(['demo', 'pie-toolbox', 'test-utils']);

const listPackages = () =>
  readdirSync(packagesDir).filter((dir) => {
    if (blacklist.has(dir)) return false;
    const pkgPath = join(packagesDir, dir, 'package.json');
    if (!pathExistsSync(pkgPath)) return false;
    const pkg = readJsonSync(pkgPath);
    if (pkg.private) return false;
    return true;
  });

function normalizeMain(p) {
  // Most packages already have "main". Default to lib/index.js if missing.
  return p.main || 'lib/index.js';
}

function normalizeModule(p) {
  // Most packages already have "module". Default to src/index.js if missing.
  return p.module || 'src/index.js';
}

function ensureExports(pkg) {
  const main = normalizeMain(pkg);
  const moduleEntry = normalizeModule(pkg);

  const desired = {
    '.': {
      require: `./${main.replace(/^\.\//, '')}`,
      import: `./${moduleEntry.replace(/^\.\//, '')}`,
      default: `./${main.replace(/^\.\//, '')}`,
    },
    './esm': './esm/index.js',
  };

  // If exports exists already (unexpected in pie-lib), be conservative.
  if (pkg.exports) {
    return { changed: false, reason: 'already has exports' };
  }

  pkg.exports = desired;
  return { changed: true };
}

async function main() {
  const pkgs = listPackages();
  const changed = [];
  const skipped = [];

  for (const dir of pkgs) {
    const pkgPath = join(packagesDir, dir, 'package.json');
    const pkg = readJsonSync(pkgPath);

    const r = ensureExports(pkg);
    if (r.changed) {
      writeJsonSync(pkgPath, pkg, { spaces: 2 });
      changed.push(dir);
    } else {
      skipped.push({ dir, reason: r.reason });
    }
  }

  console.log(`Updated exports in ${changed.length} packages.`);
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} packages:`);
    skipped.forEach((s) => console.log(`- ${s.dir}: ${s.reason}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


