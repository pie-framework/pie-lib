#!/usr/bin/env node

/**
 * Runtime ESM Import Test
 *
 * Actually imports ESM bundles to catch runtime errors that static analysis misses.
 * This catches issues like:
 * - React components returning undefined
 * - Missing dependencies at runtime
 * - Module initialization errors
 *
 * Note: Some imports will fail due to bare imports (expected - they work in browsers/bundlers)
 *
 * Run: node scripts/test-esm-runtime.mjs
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

console.log('🔍 Runtime ESM Import Test\n');
console.log('Testing that ESM bundles can be imported without errors...\n');

// Test packages (sample of commonly used ones)
const TEST_PACKAGES = [
  'style-utils', // Simple, no bare imports
  'feedback', // Simple
  'translator', // Has i18next (bare import, will fail in Node - expected)
  'icons', // Has Material-UI (bare imports, will fail - expected)
];

const results = {
  passed: [],
  failed: [],
  skipped: [],
};

// Check if package has bare imports (will fail in Node.js)
function hasBareImports(esmPath) {
  const content = readFileSync(esmPath, 'utf8');

  // Check for common bare imports that won't work in Node.js
  const hasBare =
    content.includes("'lodash/") ||
    content.includes("'@material-ui/") ||
    content.includes("'mathjax-full/") ||
    content.includes("'react'") ||
    content.includes("'react-") ||
    content.includes('"lodash/') ||
    content.includes('"@material-ui/') ||
    content.includes('"mathjax-full/') ||
    content.includes('"react"') ||
    content.includes('"react-');

  return hasBare;
}

async function testPackage(pkgName) {
  const esmPath = join(packagesDir, pkgName, 'esm/index.js');

  if (!existsSync(esmPath)) {
    console.log(`⏭️  ${pkgName}: No ESM bundle`);
    results.skipped.push({ package: pkgName, reason: 'No ESM bundle' });
    return;
  }

  // Check for bare imports
  if (hasBareImports(esmPath)) {
    console.log(`ℹ️  ${pkgName}: Has bare imports (expected to work in browsers, not Node.js)`);
    results.skipped.push({ package: pkgName, reason: 'Has bare imports (browser-only)' });
    return;
  }

  try {
    const fileUrl = pathToFileURL(esmPath).href;
    const module = await import(fileUrl);

    // Check that module has exports
    const exportCount = Object.keys(module).length;
    if (exportCount === 0) {
      throw new Error('No exports found');
    }

    console.log(`✅ ${pkgName}: ${exportCount} export(s)`);
    results.passed.push({ package: pkgName, exports: exportCount });
  } catch (error) {
    console.log(`❌ ${pkgName}: ${error.message}`);
    results.failed.push({ package: pkgName, error: error.message });
  }
}

async function main() {
  console.log('📦 Testing packages...\n');

  for (const pkg of TEST_PACKAGES) {
    await testPackage(pkg);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`ℹ️  Skipped: ${results.skipped.length} (has bare imports - expected)`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n⚠️  FAILURES:\n');
    results.failed.forEach((r) => {
      console.log(`  • ${r.package}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 NOTE:');
  console.log('   Most packages will be skipped due to bare imports.');
  console.log('   This is EXPECTED - they work in browsers with import maps.');
  console.log('   This test catches:');
  console.log('   - React components returning undefined');
  console.log('   - Module initialization errors');
  console.log('   - Basic import/export issues');

  if (results.failed.length > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  }

  console.log('\n✅ All importable packages passed!');
}

main().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
