#!/usr/bin/env node

/**
 * Test that packages can be packed correctly and contain the right files
 * This simulates what npm publish would do
 */

const { execSync } = require('child_process');
const { existsSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');

const packagesDir = join(__dirname, '../packages');

// Test a couple of key packages
const packagesToTest = ['render-ui', 'categorize'];

console.log(`🧪 Testing npm pack for ${packagesToTest.length} packages...\n`);

let passed = 0;
let failed = 0;

for (const pkgName of packagesToTest) {
  const pkgDir = join(packagesDir, pkgName);
  const pkgJsonPath = join(pkgDir, 'package.json');
  
  if (!existsSync(pkgJsonPath)) {
    console.log(`⏭️  @pie-lib/${pkgName} - no package.json`);
    continue;
  }
  
  try {
    // Run npm pack --dry-run to see what would be included
    const result = spawnSync('npm', ['pack', '--dry-run'], {
      cwd: pkgDir,
      encoding: 'utf-8'
    });
    
    const output = result.stdout + result.stderr;
    
    // Check that essential files are included
    const checks = [
      { file: 'lib/index.js', name: 'CommonJS build' },
      { file: 'esm/index.js', name: 'ESM build' },
      { file: 'package.json', name: 'package.json' }
    ];
    
    let allPresent = true;
    const messages = [];
    
    for (const check of checks) {
      if (output.includes(check.file)) {
        messages.push(`✓ ${check.name}`);
      } else {
        messages.push(`✗ ${check.name} MISSING`);
        allPresent = false;
      }
    }
    
    if (allPresent) {
      console.log(`✅ @pie-lib/${pkgName}`);
      messages.forEach(m => console.log(`   ${m}`));
      passed++;
    } else {
      console.log(`❌ @pie-lib/${pkgName}`);
      messages.forEach(m => console.log(`   ${m}`));
      failed++;
    }
    
  } catch (error) {
    console.log(`❌ @pie-lib/${pkgName} - ${error.message}`);
    failed++;
  }
  
  console.log();
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('⚠️  Some packages have packing issues!\n');
  process.exit(1);
} else {
  console.log('✅ All packages pack correctly!\n');
}

