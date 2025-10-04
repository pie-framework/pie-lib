#!/usr/bin/env node

/**
 * Check that ESM bundles are reasonable in size
 * ESM bundles should generally be larger than CommonJS because they're more self-contained
 */

const { statSync, existsSync, readdirSync } = require('fs');
const { join } = require('path');

const packagesDir = join(__dirname, '../packages');

const packages = readdirSync(packagesDir).filter(dir => {
  const esmIndex = join(packagesDir, dir, 'esm', 'index.js');
  return existsSync(esmIndex);
});

console.log(`🧪 Checking bundle sizes for ${packages.length} packages...\n`);

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
};

let issues = 0;

console.log('Package                      CommonJS    ESM         Ratio');
console.log('─────────────────────────────────────────────────────────────');

for (const pkgName of packages) {
  const libPath = join(packagesDir, pkgName, 'lib', 'index.js');
  const esmPath = join(packagesDir, pkgName, 'esm', 'index.js');
  
  if (!existsSync(libPath) || !existsSync(esmPath)) {
    continue;
  }
  
  const libSize = statSync(libPath).size;
  const esmSize = statSync(esmPath).size;
  const ratio = (esmSize / libSize).toFixed(1);
  
  const paddedName = pkgName.padEnd(28);
  const libSizeStr = formatSize(libSize).padStart(10);
  const esmSizeStr = formatSize(esmSize).padStart(10);
  const ratioStr = `${ratio}x`.padStart(8);
  
  let status = '';
  
  // ESM bundles are typically larger (more self-contained)
  // But should not be ridiculously large
  if (esmSize > 5 * 1024 * 1024) {
    status = ' ⚠️  Very large';
    issues++;
  } else if (esmSize < libSize * 0.5) {
    status = ' ⚠️  Suspiciously small';
    issues++;
  }
  
  console.log(`${paddedName} ${libSizeStr}  ${esmSizeStr}  ${ratioStr}${status}`);
}

console.log('\n📊 Summary\n');

if (issues > 0) {
  console.log(`⚠️  ${issues} package(s) have unusual sizes (may be OK)\n`);
} else {
  console.log('✅ All bundle sizes look reasonable\n');
}

console.log('Notes:');
console.log('  • ESM bundles are typically larger (more self-contained)');
console.log('  • CommonJS relies on external requires');
console.log('  • Ratio of 1-100x is normal depending on dependencies\n');

