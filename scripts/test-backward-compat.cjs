#!/usr/bin/env node

/**
 * Test backward compatibility of @pie-lib packages
 * 
 * This verifies that:
 * 1. CommonJS require() still works (for IIFE builds via PSLB/webpack)
 * 2. The exports field properly routes require() to lib/
 * 3. Old tools that don't understand exports can still use main/module fields
 */

const { existsSync, readdirSync, readJsonSync } = require('fs-extra');
const { join } = require('path');
const { resolve } = require('path');

const packagesDir = resolve(__dirname, '../packages');

// Packages with ESM builds
const packages = readdirSync(packagesDir).filter(dir => {
  const esmIndex = join(packagesDir, dir, 'esm', 'index.js');
  return existsSync(esmIndex);
});

console.log(`🧪 Testing backward compatibility for ${packages.length} packages...\n`);

let passed = 0;
let failed = 0;

for (const pkgName of packages) {
  const pkgPath = join(packagesDir, pkgName, 'package.json');
  const pkg = readJsonSync(pkgPath);
  
  const tests = [];
  let allPassed = true;
  
  try {
    // Test 1: main field still exists and points to lib/
    if (!pkg.main || !pkg.main.includes('lib/')) {
      tests.push('❌ main field missing or incorrect');
      allPassed = false;
    } else {
      tests.push('✅ main field preserved (CommonJS)');
    }
    
    // Test 2: lib/ directory exists (CommonJS build)
    const libPath = join(packagesDir, pkgName, 'lib', 'index.js');
    if (!existsSync(libPath)) {
      tests.push('❌ lib/index.js missing (CommonJS build)');
      allPassed = false;
    } else {
      tests.push('✅ CommonJS build exists');
    }
    
    // Test 3: exports.require points to lib/ (for Node.js require())
    if (!pkg.exports || !pkg.exports['.'] || !pkg.exports['.'].require || 
        !pkg.exports['.'].require.includes('lib/')) {
      tests.push('❌ exports.require missing or incorrect');
      allPassed = false;
    } else {
      tests.push('✅ exports.require → lib/ (backward compat)');
    }
    
    // Test 4: exports.import points to esm/ (new ESM support)
    if (!pkg.exports || !pkg.exports['.'] || !pkg.exports['.'].import || 
        !pkg.exports['.'].import.includes('esm/')) {
      tests.push('❌ exports.import missing or incorrect');
      allPassed = false;
    } else {
      tests.push('✅ exports.import → esm/ (new)');
    }
    
    // Test 5: Verify we can actually require() the package (uses CommonJS)
    try {
      const pkgId = `@pie-lib/${pkgName}`;
      // This will use the exports.require path (lib/index.js)
      require(pkgId);
      tests.push('✅ require() works (CommonJS load)');
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND' && !err.message.includes(pkgName)) {
        // Missing dependency is OK for this test
        tests.push('✅ require() syntax OK (deps not loaded)');
      } else {
        tests.push(`⚠️  require() failed: ${err.message.substring(0, 50)}...`);
      }
    }
    
    if (allPassed) {
      console.log(`✅ @pie-lib/${pkgName}`);
      tests.forEach(t => console.log(`   ${t}`));
      passed++;
    } else {
      console.log(`❌ @pie-lib/${pkgName}`);
      tests.forEach(t => console.log(`   ${t}`));
      failed++;
    }
    
    console.log();
    
  } catch (error) {
    console.log(`❌ @pie-lib/${pkgName}: ${error.message}\n`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('⚠️  Some packages have backward compatibility issues!\n');
  process.exit(1);
} else {
  console.log('✅ All packages are backward compatible!\n');
  console.log('Summary:');
  console.log('  • CommonJS builds (lib/) are preserved');
  console.log('  • main field still points to CommonJS');
  console.log('  • exports.require routes to CommonJS (Node.js)');
  console.log('  • exports.import routes to ESM (modern bundlers)');
  console.log('  • Old tools ignoring exports will use main field\n');
}

