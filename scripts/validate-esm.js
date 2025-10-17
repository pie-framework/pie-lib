#!/usr/bin/env node

const { readdirSync, pathExistsSync, readJsonSync, statSync } = require('fs-extra');
const { join } = require('path');
const { execSync } = require('child_process');

const packagesDir = join(__dirname, '../packages');
const errors = [];
const warnings = [];

console.log('🔍 Running comprehensive ESM validation...\n');

const packages = readdirSync(packagesDir).filter((dir) => {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!pathExistsSync(pkgPath)) return false;
  const pkg = readJsonSync(pkgPath);
  return !pkg.private; // Only check public packages
});

console.log(`📦 Validating ${packages.length} packages...\n`);

packages.forEach((pkgName) => {
  const pkgDir = join(packagesDir, pkgName);
  const pkgPath = join(pkgDir, 'package.json');
  const pkg = readJsonSync(pkgPath);

  console.log(`\n📋 @pie-lib/${pkgName}`);

  // Check 1: Has exports field
  if (!pkg.exports) {
    errors.push(`  ❌ Missing "exports" field`);
    console.log(`  ❌ Missing "exports" field`);
  } else {
    console.log(`  ✅ Has "exports" field`);

    // Check exports structure
    if (pkg.exports['.']) {
      const mainExport = pkg.exports['.'];

      // Check import path
      if (!mainExport.import) {
        errors.push(`  ❌ exports['.'].import missing`);
        console.log(`  ❌ exports['.'].import missing`);
      } else if (!mainExport.import.includes('esm')) {
        warnings.push(`  ⚠️  exports['.'].import doesn't point to esm/: ${mainExport.import}`);
        console.log(`  ⚠️  exports['.'].import doesn't point to esm/: ${mainExport.import}`);
      } else {
        console.log(`  ✅ exports['.'].import: ${mainExport.import}`);
      }

      // Check require path
      if (!mainExport.require) {
        errors.push(`  ❌ exports['.'].require missing`);
        console.log(`  ❌ exports['.'].require missing`);
      } else if (!mainExport.require.includes('lib')) {
        warnings.push(`  ⚠️  exports['.'].require doesn't point to lib/: ${mainExport.require}`);
        console.log(`  ⚠️  exports['.'].require doesn't point to lib/: ${mainExport.require}`);
      } else {
        console.log(`  ✅ exports['.'].require: ${mainExport.require}`);
      }
    }
  }

  // Check 2: ESM bundle exists
  const esmDir = join(pkgDir, 'esm');
  const esmIndexJs = join(esmDir, 'index.js');

  if (!pathExistsSync(esmDir)) {
    errors.push(`  ❌ esm/ directory missing`);
    console.log(`  ❌ esm/ directory missing`);
  } else if (!pathExistsSync(esmIndexJs)) {
    errors.push(`  ❌ esm/index.js missing`);
    console.log(`  ❌ esm/index.js missing`);
  } else {
    const stats = statSync(esmIndexJs);
    console.log(`  ✅ esm/index.js exists (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  // Check 3: CommonJS bundle exists (backward compatibility)
  const libDir = join(pkgDir, 'lib');
  const libIndexJs = join(libDir, 'index.js');

  if (!pathExistsSync(libDir)) {
    errors.push(`  ❌ lib/ directory missing`);
    console.log(`  ❌ lib/ directory missing`);
  } else if (!pathExistsSync(libIndexJs)) {
    errors.push(`  ❌ lib/index.js missing`);
    console.log(`  ❌ lib/index.js missing`);
  } else {
    console.log(`  ✅ lib/index.js exists (backward compatible)`);
  }

  // Check 4: main field points to lib/
  if (!pkg.main) {
    warnings.push(`  ⚠️  No "main" field (should point to lib/)`);
    console.log(`  ⚠️  No "main" field (should point to lib/)`);
  } else if (!pkg.main.includes('lib')) {
    warnings.push(`  ⚠️  "main" doesn't point to lib/: ${pkg.main}`);
    console.log(`  ⚠️  "main" doesn't point to lib/: ${pkg.main}`);
  } else {
    console.log(`  ✅ main: ${pkg.main}`);
  }

  // Check 5: .npmignore doesn't exclude esm/
  const npmignorePath = join(pkgDir, '.npmignore');
  if (pathExistsSync(npmignorePath)) {
    const npmignore = require('fs').readFileSync(npmignorePath, 'utf8');
    if (npmignore.includes('esm')) {
      errors.push(`  ❌ .npmignore excludes esm/ directory!`);
      console.log(`  ❌ .npmignore excludes esm/ directory!`);
    }
  }

  // Check 6: files field doesn't exclude esm/ (if present)
  if (pkg.files) {
    const hasEsm = pkg.files.some((f) => f === 'esm' || f === 'esm/' || f.startsWith('esm/'));
    const hasWildcard = pkg.files.some((f) => f === '*' || f === '**/*');
    if (!hasEsm && !hasWildcard) {
      errors.push(`  ❌ "files" field doesn't include "esm"`);
      console.log(`  ❌ "files" field doesn't include "esm"`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All checks passed! Ready to publish.\n');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:\n`);
    errors.forEach((e) => console.log(e));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):\n`);
    warnings.forEach((w) => console.log(w));
  }

  if (errors.length > 0) {
    console.log('\n❌ Fix errors before publishing!\n');
    process.exit(1);
  } else {
    console.log('\n⚠️  Warnings found, but you can proceed if acceptable.\n');
    process.exit(0);
  }
}
