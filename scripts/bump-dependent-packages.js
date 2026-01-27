#!/usr/bin/env node
/**
 * Bumps patch versions for packages that had dependency updates but no version bump.
 * This ensures dependent packages are republished when their dependencies change.
 */

const { getPackages } = require('@pie-framework/build-helper');
const { resolve } = require('path');
const fs = require('fs');
const semver = require('semver');

const packagesDir = resolve(__dirname, '..', 'packages');
const pkgs = getPackages(packagesDir);

// Get packages that were versioned (their version changed in git)
// We'll check git diff to see which package.json files had version changes
let versionedPackages = new Set();
try {
  const { execSync } = require('child_process');
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  
  // Get packages whose package.json changed in the last commit
  // Check if HEAD~1 exists first
  let changedFiles = [];
  try {
    execSync('git rev-parse HEAD~1', { stdio: 'ignore' });
    const gitDiff = execSync('git diff HEAD~1 HEAD --name-only', { encoding: 'utf8' });
    changedFiles = gitDiff.split('\n').filter(f => f.includes('packages/') && f.includes('package.json'));
  } catch (e) {
    // HEAD~1 doesn't exist (first commit), check unstaged changes instead
    const gitDiff = execSync('git diff --name-only', { encoding: 'utf8' });
    changedFiles = gitDiff.split('\n').filter(f => f.includes('packages/') && f.includes('package.json'));
  }
  
  // Check which packages had version changes
  changedFiles.forEach(file => {
    try {
      let oldContent;
      try {
        oldContent = execSync(`git show HEAD~1:${file}`, { encoding: 'utf8' }).trim();
      } catch (e) {
        // HEAD~1 doesn't exist, try to get from git index
        oldContent = execSync(`git show :${file}`, { encoding: 'utf8' }).trim();
      }
      
      const newContent = fs.readFileSync(resolve(__dirname, '..', file), 'utf8');
      
      const oldPkg = JSON.parse(oldContent);
      const newPkg = JSON.parse(newContent);
      
      if (oldPkg.version !== newPkg.version) {
        versionedPackages.add(oldPkg.name);
      }
    } catch (e) {
      // File might not exist in git, or other error - skip
    }
  });
} catch (e) {
  console.log('Could not detect versioned packages from git, will check all packages');
}

// Build a map of package name -> package info
const packageMap = {};
pkgs.forEach((p) => {
  packageMap[p.pkg.name] = p;
});

// Find packages that depend on versioned packages but weren't versioned themselves
const packagesToBump = [];
pkgs.forEach((p) => {
  // Skip if this package was already versioned
  if (versionedPackages.has(p.pkg.name)) {
    return;
  }
  
  // Skip private packages
  if (p.pkg.private) {
    return;
  }
  
  // Check if this package depends on any versioned package
  const deps = { ...p.pkg.dependencies, ...p.pkg.devDependencies } || {};
  const hasUpdatedDependency = Object.keys(deps).some(depName => {
    if (depName.startsWith('@pie-lib/') && versionedPackages.has(depName)) {
      // Check if the dependency version actually changed
      try {
        const { execSync } = require('child_process');
        const pkgPath = p.dir || p.path;
        const pkgJsonPath = resolve(pkgPath, 'package.json');
        
        // Get relative path from repo root
        const repoRoot = resolve(__dirname, '..');
        const relativePath = pkgJsonPath.replace(repoRoot + '/', '');
        
        // Get old and new dependency versions
        let oldContent;
        try {
          oldContent = execSync(`git show HEAD~1:${relativePath}`, { encoding: 'utf8' }).trim();
        } catch (e) {
          // HEAD~1 doesn't exist, try git index
          try {
            oldContent = execSync(`git show :${relativePath}`, { encoding: 'utf8' }).trim();
          } catch (e2) {
            // Can't get old version, assume it changed if dependency was versioned
            return true;
          }
        }
        
        const oldPkg = JSON.parse(oldContent);
        const oldDeps = { ...oldPkg.dependencies, ...oldPkg.devDependencies } || {};
        
        const oldDepVersion = oldDeps[depName];
        const newDepVersion = deps[depName];
        
        return oldDepVersion !== newDepVersion;
      } catch (e) {
        // If we can't check, assume it changed if the dependency was versioned
        return true;
      }
    }
    return false;
  });
  
  if (hasUpdatedDependency) {
    packagesToBump.push(p);
  }
});

if (packagesToBump.length === 0) {
  console.log('No dependent packages need version bumps');
  process.exit(0);
}

console.log(`Bumping patch versions for ${packagesToBump.length} package(s) with updated dependencies:`);
packagesToBump.forEach(p => console.log(`  - ${p.pkg.name}`));

// Bump patch versions
let updated = false;
packagesToBump.forEach((p) => {
  const pkgPath = p.dir || p.path;
  if (!pkgPath) {
    console.log(`Skipping ${p.pkg.name} - no path found`);
    return;
  }
  
  const pkgJsonPath = resolve(pkgPath, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  
  // Bump patch version (e.g., 6.1.0-next.2 -> 6.1.0-next.3)
  const currentVersion = pkgJson.version;
  const bumpedVersion = semver.inc(currentVersion, 'prerelease');
  
  if (bumpedVersion && bumpedVersion !== currentVersion) {
    console.log(`  ${pkgJson.name}: ${currentVersion} -> ${bumpedVersion}`);
    pkgJson.version = bumpedVersion;
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
    updated = true;
  }
});

if (updated) {
  console.log('\n✓ Bumped versions for dependent packages');
  process.exit(0);
} else {
  console.log('\n✓ No version bumps needed');
  process.exit(0);
}
