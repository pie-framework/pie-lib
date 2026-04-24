#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Project } = require('@lerna/core');
const semver = require('semver');

async function bumpVersionsAndUpdateDeps() {
  const project = new Project(process.cwd());
  const packages = await project.getPackages();
  const packageMap = new Map();

  // First pass: collect all packages and bump versions
  console.log('Step 1: Bumping package versions...\n');

  for (const pkg of packages) {
    if (pkg.private) continue;

    const pkgPath = path.join(pkg.location, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    const currentVersion = pkgJson.version;

    if (!semver.valid(currentVersion)) {
      console.log(`Invalid semver for ${pkgJson.name}: ${currentVersion}`);
      continue;
    }

    // Increment prerelease version (e.g., 6.1.0-next.4 -> 6.1.0-next.5)
    const newVersion = semver.inc(currentVersion, 'prerelease');

    if (!newVersion) {
      console.log(`⚠️  Could not increment version for ${pkgJson.name} (${currentVersion})`);
      continue;
    }

    packageMap.set(pkgJson.name, {
      oldVersion: currentVersion,
      newVersion: newVersion,
      pkgPath: pkgPath,
      pkgJson: pkgJson,
    });

    pkgJson.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
    console.log(`✓ ${pkgJson.name}: ${currentVersion} -> ${newVersion}`);
  }

  console.log(`\nStep 2: Updating internal @pie-lib/* dependencies...\n`);

  // Second pass: update all internal dependencies
  let updatedCount = 0;
  for (const pkg of packages) {
    const pkgPath = path.join(pkg.location, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let modified = false;

    // Update dependencies
    if (pkgJson.dependencies) {
      for (const depName in pkgJson.dependencies) {
        if (depName.startsWith('@pie-lib/') && packageMap.has(depName)) {
          const newVersion = packageMap.get(depName).newVersion;
          if (pkgJson.dependencies[depName] !== newVersion) {
            pkgJson.dependencies[depName] = newVersion;
            modified = true;
            updatedCount++;
          }
        }
      }
    }

    // Update devDependencies
    if (pkgJson.devDependencies) {
      for (const depName in pkgJson.devDependencies) {
        if (depName.startsWith('@pie-lib/') && packageMap.has(depName)) {
          const newVersion = packageMap.get(depName).newVersion;
          if (pkgJson.devDependencies[depName] !== newVersion) {
            pkgJson.devDependencies[depName] = newVersion;
            modified = true;
            updatedCount++;
          }
        }
      }
    }

    if (modified) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
      console.log(`✓ Updated dependencies in ${pkgJson.name}`);
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   - Bumped ${packageMap.size} package versions`);
  console.log(`   - Updated ${updatedCount} internal dependency references`);
}

bumpVersionsAndUpdateDeps().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
