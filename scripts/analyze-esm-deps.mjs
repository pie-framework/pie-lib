#!/usr/bin/env node

/**
 * Comprehensive ESM Dependency Analysis for pie-lib
 * 
 * Checks all dependencies to identify ESM support and potential issues
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');
const nodeModulesDir = join(__dirname, '../node_modules');

console.log('🔍 Comprehensive ESM Dependency Analysis for @pie-lib\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Get all non-private packages
const packages = readdirSync(packagesDir)
  .filter(dir => {
    const pkgPath = join(packagesDir, dir, 'package.json');
    if (!existsSync(pkgPath)) return false;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return !pkg.private;
  });

// Collect all unique dependencies
const allDeps = new Set();
const depsByPackage = new Map();

for (const pkgName of packages) {
  const pkgPath = join(packagesDir, pkgName, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  
  const deps = {
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  };
  
  depsByPackage.set(pkgName, Object.keys(deps));
  
  for (const dep of Object.keys(deps)) {
    // Skip pie-lib and pie-framework internal deps
    if (!dep.startsWith('@pie-lib/') && !dep.startsWith('@pie-framework/')) {
      allDeps.add(dep);
    }
  }
}

console.log(`📦 Analyzed ${packages.length} packages`);
console.log(`📚 Found ${allDeps.size} unique external dependencies\n`);

// Analyze each dependency
const esmSupport = {
  good: [],        // Has module or exports field
  oldCjs: [],      // Old CommonJS only (no ESM)
  problematic: [], // Known problematic packages
  missing: [],     // Not found in node_modules
};

const problematicPackages = new Set([
  'mathjax-full',
  'speech-rule-engine',
  'slate',
  'slate-react',
  'slate-plain-serializer',
  'slate-html-serializer',
  'slate-prop-types',
  'slate-dev-environment',
  'slate-hotkeys',
  'slate-soft-break',
  'immutable',
  'react-portal',
]);

for (const dep of Array.from(allDeps).sort()) {
  const depPath = join(nodeModulesDir, dep, 'package.json');
  
  if (!existsSync(depPath)) {
    esmSupport.missing.push(dep);
    continue;
  }
  
  const depPkg = JSON.parse(readFileSync(depPath, 'utf8'));
  
  if (problematicPackages.has(dep)) {
    esmSupport.problematic.push({
      name: dep,
      version: depPkg.version,
      hasModule: !!depPkg.module,
      hasExports: !!depPkg.exports,
      reason: getProblematicReason(dep),
    });
  } else if (depPkg.module || depPkg.exports) {
    esmSupport.good.push({
      name: dep,
      version: depPkg.version,
      type: depPkg.module ? 'module field' : 'exports field',
    });
  } else {
    esmSupport.oldCjs.push({
      name: dep,
      version: depPkg.version,
    });
  }
}

function getProblematicReason(dep) {
  const reasons = {
    'mathjax-full': 'Many sub-path imports (mathjax-full/js/*) that esm.sh cannot resolve',
    'speech-rule-engine': 'Sub-path imports (speech-rule-engine/js/*), uses eval()',
    'slate': 'Old v0.36 - tight coupling with immutable v3, no ESM',
    'slate-react': 'Old slate ecosystem package, no ESM',
    'slate-plain-serializer': 'Old slate ecosystem package, no ESM',
    'slate-html-serializer': 'Old slate ecosystem package, no ESM',
    'slate-prop-types': 'Old slate ecosystem package, no ESM',
    'slate-dev-environment': 'Old slate ecosystem package, no ESM',
    'slate-hotkeys': 'Old slate ecosystem package, no ESM',
    'slate-soft-break': 'Old slate ecosystem package, no ESM',
    'immutable': 'v3.x - no ESM support (v4+ has ESM but Slate requires v3)',
    'react-portal': 'Has ES module but improper default export',
  };
  return reasons[dep] || 'Unknown issue';
}

console.log('═══════════════════════════════════════════════════════════');
console.log('📊 DEPENDENCY ANALYSIS RESULTS');
console.log('═══════════════════════════════════════════════════════════\n');

console.log(`✅ GOOD (${esmSupport.good.length}) - Have ESM support:`);
if (esmSupport.good.length > 0) {
  for (const dep of esmSupport.good) {
    console.log(`   ${dep.name}@${dep.version} (${dep.type})`);
  }
} else {
  console.log('   (none)');
}
console.log();

console.log(`⚠️  OLD CommonJS (${esmSupport.oldCjs.length}) - No ESM, but may work bundled:`);
if (esmSupport.oldCjs.length > 0) {
  for (const dep of esmSupport.oldCjs) {
    console.log(`   ${dep.name}@${dep.version}`);
  }
} else {
  console.log('   (none)');
}
console.log();

console.log(`❌ PROBLEMATIC (${esmSupport.problematic.length}) - Known ESM issues:`);
if (esmSupport.problematic.length > 0) {
  for (const dep of esmSupport.problematic) {
    console.log(`   ${dep.name}@${dep.version}`);
    console.log(`      → ${dep.reason}`);
  }
} else {
  console.log('   (none)');
}
console.log();

if (esmSupport.missing.length > 0) {
  console.log(`⚠️  MISSING (${esmSupport.missing.length}) - Not in node_modules:`);
  for (const dep of esmSupport.missing) {
    console.log(`   ${dep}`);
  }
  console.log();
}

// Find which packages use problematic deps
console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 PACKAGES USING PROBLEMATIC DEPENDENCIES');
console.log('═══════════════════════════════════════════════════════════\n');

const packagesWithIssues = new Map();

for (const [pkgName, deps] of depsByPackage.entries()) {
  const problematicDeps = deps.filter(d => 
    esmSupport.problematic.some(p => p.name === d)
  );
  
  if (problematicDeps.length > 0) {
    packagesWithIssues.set(pkgName, problematicDeps);
  }
}

if (packagesWithIssues.size > 0) {
  for (const [pkg, deps] of packagesWithIssues.entries()) {
    console.log(`📦 @pie-lib/${pkg}`);
    for (const dep of deps) {
      console.log(`   ❌ ${dep}`);
    }
    console.log();
  }
} else {
  console.log('✅ No packages use problematic dependencies!\n');
}

console.log('═══════════════════════════════════════════════════════════');
console.log('💡 RECOMMENDATIONS');
console.log('═══════════════════════════════════════════════════════════\n');

if (esmSupport.problematic.length > 0) {
  console.log('1. BUNDLE problematic dependencies (already doing this):');
  for (const dep of esmSupport.problematic) {
    const affected = Array.from(packagesWithIssues.entries())
      .filter(([_, deps]) => deps.includes(dep.name))
      .map(([pkg]) => pkg);
    if (affected.length > 0) {
      console.log(`   - ${dep.name}: affects ${affected.join(', ')}`);
    }
  }
  console.log();
}

if (esmSupport.oldCjs.length > 0) {
  console.log('2. OLD CommonJS packages:');
  console.log('   These have no ESM but can likely be bundled safely.');
  console.log('   Keep as external if widely used (React, Material-UI, Lodash).');
  console.log();
}

console.log('3. TESTING STRATEGY:');
console.log('   a. Run test:esm:cdn after publishing');
console.log('   b. Test each package with problematic deps in browser');
console.log('   c. Verify bundled packages work correctly');
console.log();

console.log('═══════════════════════════════════════════════════════════\n');

