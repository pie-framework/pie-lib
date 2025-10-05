#!/usr/bin/env node

/**
 * Discover all import statements from ESM bundles
 *
 * This script analyzes built ESM bundles and extracts all bare imports,
 * helping identify which dependencies need to be in the import map.
 *
 * Run: node scripts/discover-esm-imports.mjs
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '../packages');

console.log('🔍 Discovering imports from ESM bundles...\n');

const imports = new Set();

// Regex to match import statements
const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;

function extractImports(content) {
  const matches = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Skip relative imports (start with . or /)
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      continue;
    }

    matches.push(importPath);
  }

  return matches;
}

function analyzePackage(pkgName) {
  const esmPath = join(packagesDir, pkgName, 'esm/index.js');

  if (!existsSync(esmPath)) {
    return [];
  }

  const content = readFileSync(esmPath, 'utf8');
  return extractImports(content);
}

// Analyze all packages
const packages = readdirSync(packagesDir).filter((dir) => {
  const esmPath = join(packagesDir, dir, 'esm/index.js');
  return existsSync(esmPath);
});

console.log(`📦 Analyzing ${packages.length} packages...\n`);

const packageImports = {};

for (const pkgName of packages) {
  const pkgImports = analyzePackage(pkgName);

  if (pkgImports.length > 0) {
    packageImports[pkgName] = pkgImports;
    pkgImports.forEach((imp) => imports.add(imp));
  }
}

// Categorize imports
const categorized = {
  react: new Set(),
  materialUI: new Set(),
  lodash: new Set(),
  math: new Set(),
  d3: new Set(),
  pie: new Set(),
  other: new Set(),
};

imports.forEach((imp) => {
  if (imp.startsWith('react')) {
    categorized.react.add(imp);
  } else if (imp.startsWith('@material-ui/')) {
    categorized.materialUI.add(imp);
  } else if (imp.startsWith('lodash/')) {
    categorized.lodash.add(imp);
  } else if (imp.includes('mathjax') || imp.includes('speech-rule')) {
    categorized.math.add(imp);
  } else if (imp.startsWith('d3-')) {
    categorized.d3.add(imp);
  } else if (imp.startsWith('@pie-')) {
    categorized.pie.add(imp);
  } else {
    categorized.other.add(imp);
  }
});

// Display results
console.log('📊 DISCOVERED IMPORTS\n');
console.log('='.repeat(60));

function printCategory(name, imports) {
  if (imports.size === 0) return;

  console.log(`\n${name} (${imports.size}):`);
  Array.from(imports)
    .sort()
    .forEach((imp) => {
      console.log(`  • ${imp}`);
    });
}

printCategory('React Ecosystem', categorized.react);
printCategory('Material-UI', categorized.materialUI);
printCategory('Lodash', categorized.lodash);
printCategory('Math Libraries', categorized.math);
printCategory('D3 Libraries', categorized.d3);
printCategory('PIE Framework', categorized.pie);
printCategory('Other Libraries', categorized.other);

console.log('\n' + '='.repeat(60));
console.log(`\n✅ Total unique imports: ${imports.size}`);

// Generate import map suggestions
console.log('\n📝 SUGGESTED IMPORT MAP ENTRIES\n');
console.log('='.repeat(60));
console.log('\n// Add these to your import map:\n');

const suggestions = {};

imports.forEach((imp) => {
  // Get base package name (before /)
  const parts = imp.split('/');
  let base;

  if (parts[0].startsWith('@')) {
    // Scoped package like @material-ui/core
    base = `${parts[0]}/${parts[1]}`;
  } else {
    // Regular package like lodash
    base = parts[0];
  }

  // Determine if we need a trailing slash wildcard
  if (parts.length > (base.includes('@') ? 2 : 1)) {
    // Has sub-paths, need wildcard
    suggestions[`${base}/`] = `https://esm.sh/${base}@VERSION/`;
  }

  // Also add base
  suggestions[base] = `https://esm.sh/${base}@VERSION`;
});

// Sort and display
Object.keys(suggestions)
  .sort()
  .forEach((key) => {
    console.log(`  "${key}": "${suggestions[key]}",`);
  });

console.log('\n' + '='.repeat(60));

// Show which packages use which imports
console.log('\n📋 PACKAGES BY IMPORT\n');
console.log('='.repeat(60));

for (const [pkgName, pkgImports] of Object.entries(packageImports)) {
  if (pkgImports.length > 0) {
    console.log(`\n@pie-lib/${pkgName}:`);
    pkgImports.forEach((imp) => {
      console.log(`  → ${imp}`);
    });
  }
}

console.log('\n✨ Done!');
