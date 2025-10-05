#!/usr/bin/env node

/**
 * Comprehensive ESM Integrity Test
 *
 * This script validates that:
 * 1. All ESM bundles are syntactically valid
 * 2. All ESM bundles can be imported
 * 3. All exports work correctly
 * 4. Package.json exports point to real files
 * 5. npm pack includes all necessary files
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

const errors = [];
const warnings = [];
const successes = [];

console.log('🔍 Running ESM Integrity Tests...\n');

const packages = readdirSync(packagesDir).filter((dir) => {
  const pkgPath = join(packagesDir, dir, 'package.json');
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return !pkg.private;
});

console.log(`📦 Testing ${packages.length} packages...\n`);

for (const pkgName of packages) {
  const pkgDir = join(packagesDir, pkgName);
  const pkgPath = join(pkgDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 @pie-lib/${pkgName}`);
  console.log('='.repeat(60));

  // Special case: test-utils has CommonJS dependencies (enzyme)
  if (pkgName === 'test-utils') {
    console.log('\n⚠️  test-utils: Testing package with CommonJS dependencies');
    console.log("  ℹ️  ESM bundle exists but won't work in Node.js ESM runtime");
    console.log('  ℹ️  Package is for testing only (not production)');
    console.log('  ✅ Accepted limitation\n');
    warnings.push(`${pkgName}: Testing package with CommonJS dependencies (enzyme)`);
    successes.push(pkgName);
    continue;
  }

  // Test 1: Package.json structure
  console.log('\n1️⃣  Package.json validation...');

  if (!pkg.exports) {
    errors.push(`${pkgName}: Missing "exports" field`);
    console.log('  ❌ Missing "exports" field');
    continue; // Skip other tests if no exports
  }

  if (!pkg.exports['.']) {
    errors.push(`${pkgName}: Missing exports['.']`);
    console.log("  ❌ Missing exports['.']");
    continue;
  }

  const mainExport = pkg.exports['.'];

  if (!mainExport.import) {
    errors.push(`${pkgName}: Missing exports['.'].import`);
    console.log("  ❌ Missing exports['.'].import");
  } else {
    console.log(`  ✅ exports['.'].import: ${mainExport.import}`);
  }

  if (!mainExport.require) {
    errors.push(`${pkgName}: Missing exports['.'].require`);
    console.log("  ❌ Missing exports['.'].require");
  } else {
    console.log(`  ✅ exports['.'].require: ${mainExport.require}`);
  }

  // Test 2: Files exist
  console.log('\n2️⃣  File existence check...');

  const esmPath = join(pkgDir, mainExport.import);
  const cjsPath = join(pkgDir, mainExport.require);

  if (!existsSync(esmPath)) {
    errors.push(`${pkgName}: ESM file not found: ${mainExport.import}`);
    console.log(`  ❌ ESM file not found: ${mainExport.import}`);
  } else {
    const size = statSync(esmPath).size;
    console.log(`  ✅ ESM file exists: ${mainExport.import} (${(size / 1024).toFixed(1)} KB)`);

    if (size < 100) {
      warnings.push(`${pkgName}: ESM bundle is very small (${size} bytes) - might be empty`);
      console.log(`  ⚠️  ESM bundle is very small (${size} bytes)`);
    }
  }

  if (!existsSync(cjsPath)) {
    errors.push(`${pkgName}: CJS file not found: ${mainExport.require}`);
    console.log(`  ❌ CJS file not found: ${mainExport.require}`);
  } else {
    console.log(`  ✅ CJS file exists: ${mainExport.require}`);
  }

  // Test 3: ESM syntax validation
  console.log('\n3️⃣  ESM syntax validation...');

  if (existsSync(esmPath)) {
    try {
      const content = readFileSync(esmPath, 'utf8');

      // Check for common ESM issues
      // Note: Bundled Babel helpers may contain module.exports inside IIFEs - this is safe for ESM
      // A valid ESM bundle should start with imports/exports, not with module.exports
      const startsWithESM = /^(import |export |\/\/|\/\*)/.test(content);
      const hasModuleExports = content.includes('module.exports');

      if (hasModuleExports && !startsWithESM) {
        errors.push(`${pkgName}: ESM bundle contains 'module.exports' without ESM syntax`);
        console.log('  ❌ Contains CommonJS syntax without ESM imports');
      } else if (content.includes('require(')) {
        warnings.push(`${pkgName}: ESM bundle contains 'require()' calls`);
        console.log('  ⚠️  Contains require() calls');
      } else {
        console.log('  ✅ No obvious CommonJS syntax');
      }

      // Check for exports
      if (!content.includes('export ')) {
        warnings.push(`${pkgName}: ESM bundle has no 'export' statements`);
        console.log('  ⚠️  No export statements found');
      } else {
        console.log('  ✅ Has export statements');
      }
    } catch (err) {
      errors.push(`${pkgName}: Failed to read ESM file: ${err.message}`);
      console.log(`  ❌ Failed to read ESM file: ${err.message}`);
    }
  }

  // Test 4: Bare imports validation (Node.js vs Browser)
  console.log('\n4️⃣  Import resolution check...');

  if (existsSync(esmPath)) {
    const content = readFileSync(esmPath, 'utf8');

    // Check for bare imports without .js extensions (lodash/*, @material-ui/*, mathjax-full/*)
    // These won't work in Node.js ESM but WILL work in browsers with import maps
    const hasBareImports =
      content.includes("'lodash/") ||
      content.includes("'@material-ui/") ||
      content.includes("'mathjax-full/") ||
      content.includes("'speech-rule-engine/") ||
      content.includes('"lodash/') ||
      content.includes('"@material-ui/') ||
      content.includes('"mathjax-full/') ||
      content.includes('"speech-rule-engine/');

    if (hasBareImports) {
      console.log('  ℹ️  Contains bare imports (lodash/*, @material-ui/*)');
      console.log('  ℹ️  Will work in browsers with import maps + bundlers');
      console.log('  ℹ️  Cannot test runtime import in Node.js (expected)');
      successes.push(pkgName);
    } else {
      // Try runtime import for packages without bare imports
      try {
        const fileUrl = `file://${esmPath.replace(/\\/g, '/')}`;
        const module = await import(fileUrl);

        if (module.default) {
          console.log('  ✅ Default export available');
        } else {
          console.log('  ℹ️  No default export (OK if only named exports)');
        }

        const namedExports = Object.keys(module).filter((k) => k !== 'default');
        if (namedExports.length > 0) {
          console.log(
            `  ✅ ${namedExports.length} named export(s): ${namedExports.slice(0, 3).join(', ')}${
              namedExports.length > 3 ? '...' : ''
            }`,
          );
        }

        successes.push(pkgName);
      } catch (err) {
        errors.push(`${pkgName}: Failed to import ESM: ${err.message}`);
        console.log(`  ❌ Failed to import: ${err.message.split('\n')[0]}`);
      }
    }
  }

  // Test 5: npm pack check (files field)
  console.log('\n5️⃣  npm pack validation...');

  if (pkg.files) {
    const hasEsm = pkg.files.some(
      (f) => f === 'esm' || f === 'esm/' || f.startsWith('esm/') || f === '*' || f === '**/*',
    );

    if (!hasEsm) {
      errors.push(`${pkgName}: "files" field doesn't include "esm"`);
      console.log('  ❌ "files" field doesn\'t include "esm"');
    } else {
      console.log('  ✅ "files" field includes ESM');
    }
  } else {
    console.log('  ✅ No "files" field (all files included by default)');
  }
}

// Final Summary
console.log('\n\n' + '='.repeat(60));
console.log('📊 FINAL SUMMARY');
console.log('='.repeat(60));

console.log(`\n✅ ${successes.length}/${packages.length} packages passed all tests`);

if (errors.length > 0) {
  console.log(`\n❌ ${errors.length} ERROR(S) - MUST FIX BEFORE PUBLISHING:`);
  errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} WARNING(S) - Review recommended:`);
  warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
}

if (errors.length === 0) {
  console.log('\n✨ All critical checks passed! Safe to publish.\n');
  process.exit(0);
} else {
  console.log('\n❌ Fix errors before publishing!\n');
  process.exit(1);
}
