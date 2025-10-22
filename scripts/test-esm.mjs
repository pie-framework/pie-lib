#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

// Packages with ESM builds
const packages = readdirSync(packagesDir).filter(dir => {
  const esmIndex = join(packagesDir, dir, 'esm', 'index.js');
  return existsSync(esmIndex);
});

console.log(`🧪 Testing ${packages.length} ESM packages...\n`);

let passed = 0;
let failed = 0;

for (const pkgName of packages) {
  const pkgPath = join(packagesDir, pkgName, 'package.json');
  const esmPath = join(packagesDir, pkgName, 'esm', 'index.js');
  
  try {
    // Test 1: package.json has exports field
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    if (!pkg.exports || !pkg.exports['.'] || !pkg.exports['.'].import) {
      throw new Error('Missing or invalid exports field');
    }
    
    // Test 2: ESM file exists and has valid syntax
    const esmContent = readFileSync(esmPath, 'utf-8');
    if (esmContent.length === 0) {
      throw new Error('ESM bundle is empty');
    }
    
    // Test 3: Check for import/export statements (basic validation)
    if (!esmContent.includes('import') && !esmContent.includes('export')) {
      throw new Error('ESM bundle has no import/export statements');
    }
    
    // Test 4: Verify it references the correct path in exports
    const exportPath = pkg.exports['.'].import;
    if (!exportPath.includes('esm/index.js')) {
      throw new Error(`Incorrect export path: ${exportPath}`);
    }
    
    console.log(`✅ @pie-lib/${pkgName}`);
    passed++;
  } catch (error) {
    console.log(`❌ @pie-lib/${pkgName}: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

