#!/usr/bin/env node
/**
 * Updates @pie-lib/* dependencies in packages to match the versions
 * currently in the monorepo's package.json files.
 * 
 * By default, only updates dependencies in packages that depend on
 * packages that were just published (to avoid triggering unnecessary republishing).
 * 
 * Use --all flag to update all packages regardless.
 */

const { getPackages } = require('@pie-framework/build-helper');
const { resolve } = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const updateAll = args.all || false;

const packagesDir = resolve(__dirname, '..', 'packages');
const pkgs = getPackages(packagesDir);

// Build a map of package name -> version
const packageVersions = {};
const packageMap = {};
pkgs.forEach((p) => {
  packageVersions[p.pkg.name] = p.pkg.version;
  packageMap[p.pkg.name] = p;
});

// Try to detect which packages were just published by checking git
// Look for packages whose version changed (indicating they were published)
let publishedPackages = new Set();
try {
  // Check if we're in a git repo and can see recent commits
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  
  // Get the last commit message to see if it's a Lerna publish commit
  const lastCommitMsg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' });
  const isLernaPublish = lastCommitMsg.includes('[ci skip]') || lastCommitMsg.includes('chore: publish');
  
  if (isLernaPublish) {
    // Get packages whose version changed in the last commit
    try {
      const gitDiff = execSync('git diff HEAD~1 HEAD --name-only', { encoding: 'utf8' });
      const changedFiles = gitDiff.split('\n').filter(f => f.includes('packages/') && f.includes('package.json'));
      
      changedFiles.forEach(file => {
        const match = file.match(/packages\/([^\/]+)\/package\.json/);
        if (match) {
          const pkgName = `@pie-lib/${match[1]}`;
          if (packageMap[pkgName]) {
            publishedPackages.add(pkgName);
          }
        }
      });
    } catch (e) {
      // If HEAD~1 doesn't exist (first commit), check unstaged changes
      console.log('Checking unstaged changes for published packages...');
    }
  }
} catch (e) {
  // Not in git repo or can't detect, will update all if updateAll is false
  console.log('Could not detect published packages from git');
}

// If updateAll is true, or we couldn't detect published packages, update all
const packagesToUpdate = updateAll || publishedPackages.size === 0 
  ? pkgs 
  : pkgs.filter(p => {
      // Update packages that depend on published packages
      const deps = { ...p.pkg.dependencies, ...p.pkg.devDependencies } || {};
      return Object.keys(deps).some(depName => 
        depName.startsWith('@pie-lib/') && publishedPackages.has(depName)
      );
    });

if (packagesToUpdate.length === 0 && !updateAll) {
  console.log('No packages need dependency updates (no dependencies on published packages)');
  process.exit(0);
}

console.log(`Updating dependencies in ${packagesToUpdate.length} package(s):`);
packagesToUpdate.forEach(p => console.log(`  - ${p.pkg.name}`));

let updated = false;

// Update dependencies in selected packages
packagesToUpdate.forEach((p) => {
  const pkgPath = p.path;
  const pkgJsonPath = resolve(pkgPath, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  let pkgUpdated = false;

  // Update dependencies
  if (pkgJson.dependencies) {
    Object.keys(pkgJson.dependencies).forEach((depName) => {
      if (depName.startsWith('@pie-lib/') && packageVersions[depName]) {
        const currentVersion = pkgJson.dependencies[depName];
        const targetVersion = packageVersions[depName];
        if (currentVersion !== targetVersion) {
          console.log(
            `  ${pkgJson.name}: ${depName} ${currentVersion} → ${targetVersion}`
          );
          pkgJson.dependencies[depName] = targetVersion;
          pkgUpdated = true;
          updated = true;
        }
      }
    });
  }

  // Update devDependencies
  if (pkgJson.devDependencies) {
    Object.keys(pkgJson.devDependencies).forEach((depName) => {
      if (depName.startsWith('@pie-lib/') && packageVersions[depName]) {
        const currentVersion = pkgJson.devDependencies[depName];
        const targetVersion = packageVersions[depName];
        if (currentVersion !== targetVersion) {
          console.log(
            `  ${pkgJson.name} (dev): ${depName} ${currentVersion} → ${targetVersion}`
          );
          pkgJson.devDependencies[depName] = targetVersion;
          pkgUpdated = true;
          updated = true;
        }
      }
    });
  }

  // Write back if updated
  if (pkgUpdated) {
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  }
});

if (updated) {
  console.log('\n✓ Updated internal dependencies');
  process.exit(0);
} else {
  console.log('\n✓ All internal dependencies are already up to date');
  process.exit(0);
}
