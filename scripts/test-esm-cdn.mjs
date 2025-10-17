#!/usr/bin/env node

/**
 * Test ESM package availability on CDNs
 * Tests all @pie-lib packages with their actual versions
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

const CDNS = [
  { name: 'esm.sh', url: (pkg, version) => `https://esm.sh/@pie-lib/${pkg}@${version}` },
  { name: 'jsdelivr', url: (pkg, version) => `https://cdn.jsdelivr.net/npm/@pie-lib/${pkg}@${version}/esm/index.js` },
];

// Get all testable packages with their versions
function getPackages() {
  const packages = [];
  const dirs = readdirSync(packagesDir);
  
  for (const dir of dirs) {
    const pkgPath = join(packagesDir, dir, 'package.json');
    if (!existsSync(pkgPath)) continue;
    
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      
      // Skip private packages
      if (pkg.private) continue;
      
      // Skip if no ESM exports
      if (!pkg.exports || !pkg.exports['.'] || !pkg.exports['.'].import) continue;
      
      packages.push({
        name: dir,
        version: pkg.version,
        fullName: pkg.name,
      });
    } catch (err) {
      console.warn(`⚠️  Skipping ${dir}: ${err.message}`);
    }
  }
  
  return packages;
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { 
      timeout: 10000,
      headers: { 'User-Agent': 'pie-lib-cdn-test' }
    }, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testPackage(pkg, cdn) {
  const url = cdn.url(pkg.name, pkg.version);
  try {
    const status = await httpGet(url);
    return { pkg: pkg.name, version: pkg.version, cdn: cdn.name, url, status, ok: status === 200 };
  } catch (err) {
    return { pkg: pkg.name, version: pkg.version, cdn: cdn.name, url, status: 0, error: err.message, ok: false };
  }
}

async function main() {
  const packages = getPackages();
  
  if (packages.length === 0) {
    console.error('❌ Error: No testable packages found');
    process.exit(1);
  }

  console.log(`🔍 Testing @pie-lib packages on CDNs`);
  console.log(`📋 Found ${packages.length} testable packages`);
  console.log('');

  let totalTests = 0;
  let passedTests = 0;
  const failedPackages = [];

  for (const cdn of CDNS) {
    console.log(`📡 Testing ${cdn.name}`);
    console.log('─'.repeat(60));

    for (const pkg of packages) {
      const result = await testPackage(pkg, cdn);
      totalTests++;

      if (result.ok) {
        console.log(`   ✅ ${pkg.name}@${pkg.version} - Available (${result.status})`);
        passedTests++;
      } else {
        console.log(`   ❌ ${pkg.name}@${pkg.version} - Failed (${result.status}${result.error ? ': ' + result.error : ''})`);
        failedPackages.push(`${pkg.name}@${pkg.version} on ${cdn.name}`);
      }
    }
    console.log('');
  }

  console.log('═'.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log('');

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! ESM bundles are accessible via CDN.');
  } else if (passedTests === 0) {
    console.log('❌ All tests failed!');
    console.log('');
    console.log('Possible reasons:');
    console.log('  1. Packages not yet propagated to CDNs (wait 2-5 minutes)');
    console.log('  2. ESM bundles not included in published packages');
    console.log('  3. Network/CDN issues');
    process.exit(1);
  } else {
    console.log('⚠️  Some tests failed:');
    failedPackages.forEach(pkg => console.log(`   - ${pkg}`));
    console.log('');
    console.log('Note: Different CDNs may take different times to propagate.');
    console.log('      Try again in a few minutes if just published.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
