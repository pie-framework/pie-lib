#!/usr/bin/env node
/**
 * Bumps all @pie-lib package versions and updates internal dependencies.
 * This ensures all packages are at consistent versions.
 */

const { getPackages } = require('@pie-framework/build-helper');
const { resolve } = require('path');
const fs = require('fs');
const semver = require('semver');

const packagesDir = resolve(__dirname, '..', 'packages');
const pkgs = getPackages(packagesDir);

// Build a map of package name -> package info
const packageMap = {};
pkgs.forEach((p) => {
  packageMap[p.pkg.name] = p;
});

console.log('Bumping all package versions and updating internal dependencies...\n');

// First, collect all packages and determine new versions
const packagesToUpdate = [];
pkgs.forEach((p) => {
  // Skip private packages
  if (p.pkg.private) {
    return;
  }
  
  const currentVersion = p.pkg.version;
  // Bump patch version (e.g., 6.1.0-next.2 -> 6.1.0-next.3)
  const bumpedVersion = semver.inc(currentVersion, 'prerelease');
  
  if (bumpedVersion && bumpedVersion !== currentVersion) {
    packagesToUpdate.push({
      pkg: p,
      currentVersion,
      bumpedVersion
    });
  }
});

if (packagesToUpdate.length === 0) {
  console.log('No packages need version bumps');
  process.exit(0);
}

console.log(`Bumping ${packagesToUpdate.length} package(s):`);
packagesToUpdate.forEach(({ pkg, currentVersion, bumpedVersion }) => {
  console.log(`  ${pkg.pkg.name}: ${currentVersion} -> ${bumpedVersion}`);
});

// Build version map for dependency updates
const versionMap = {};
packagesToUpdate.forEach(({ pkg, bumpedVersion }) => {
  versionMap[pkg.pkg.name] = bumpedVersion;
});

// Step 1: Update all package versions
console.log('\nStep 1: Updating package versions...');
packagesToUpdate.forEach(({ pkg, bumpedVersion }) => {
  const pkgPath = pkg.dir || pkg.path;
  if (!pkgPath) {
    console.log(`Skipping ${pkg.pkg.name} - no path found`);
    return;
  }
  
  const pkgJsonPath = resolve(pkgPath, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  pkgJson.version = bumpedVersion;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
});

// Step 2: Update all internal dependencies
console.log('\nStep 2: Updating internal @pie-lib/* dependencies...');
let depUpdateCount = 0;

pkgs.forEach((p) => {
  const pkgPath = p.dir || p.path;
  if (!pkgPath) {
    return;
  }
  
  const pkgJsonPath = resolve(pkgPath, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  let pkgUpdated = false;
  
  // Update dependencies
  if (pkgJson.dependencies) {
    Object.keys(pkgJson.dependencies).forEach((depName) => {
      if (depName.startsWith('@pie-lib/') && versionMap[depName]) {
        const currentVersion = pkgJson.dependencies[depName];
        const targetVersion = versionMap[depName];
        if (currentVersion !== targetVersion) {
          console.log(`  ${pkgJson.name}: ${depName} ${currentVersion} -> ${targetVersion}`);
          pkgJson.dependencies[depName] = targetVersion;
          pkgUpdated = true;
          depUpdateCount++;
        }
      }
    });
  }
  
  // Update devDependencies
  if (pkgJson.devDependencies) {
    Object.keys(pkgJson.devDependencies).forEach((depName) => {
      if (depName.startsWith('@pie-lib/') && versionMap[depName]) {
        const currentVersion = pkgJson.devDependencies[depName];
        const targetVersion = versionMap[depName];
        if (currentVersion !== targetVersion) {
          console.log(`  ${pkgJson.name} (dev): ${depName} ${currentVersion} -> ${targetVersion}`);
          pkgJson.devDependencies[depName] = targetVersion;
          pkgUpdated = true;
          depUpdateCount++;
        }
      }
    });
  }
  
  // Write back if updated
  if (pkgUpdated) {
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  }
});

console.log(`\n✓ Updated ${packagesToUpdate.length} package versions`);
console.log(`✓ Updated ${depUpdateCount} internal dependency references`);
console.log('\nAll packages and dependencies have been bumped. Ready to commit.');
