#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const PACKAGES_DIR = path.resolve(__dirname, '../packages');
const FILE_EXTS = ['.js', '.jsx'];

const getPackages = () =>
  fs.readdirSync(PACKAGES_DIR).filter((name) => {
    const fullPath = path.join(PACKAGES_DIR, name);
    return fs.existsSync(path.join(fullPath, 'lib')) && fs.statSync(fullPath).isDirectory();
  });

const resolveLibFile = (absPath) => {
  for (const ext of FILE_EXTS) {
    const full = absPath + ext;
    if (fs.existsSync(full)) return full;
  }
  return fs.existsSync(absPath) ? absPath : null;
};

const isOutsidePackage = (absPath, pkgRoot) => !absPath.startsWith(pkgRoot);

const processFile = (filePath, pkgName, pkgRoot, libRoot) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  content = content.replace(/require\(["'](.+?)["']\)/g, (match, requirePath) => {
    if (!requirePath.startsWith('.')) return match;

    const absOriginalImportPath = path.resolve(path.dirname(filePath), requirePath);
    if (!isOutsidePackage(absOriginalImportPath, pkgRoot)) return match;

    // Replace /src/ with /lib/ in the import path
    const adjustedLibPath = absOriginalImportPath.replace('/src/', '/lib/');
    const resolvedLibFile = resolveLibFile(adjustedLibPath);
    if (!resolvedLibFile) return match;

    const fileName = path.basename(resolvedLibFile);
    const sharedDir = path.join(libRoot, 'shared');
    const destPath = path.join(sharedDir, fileName);

    fs.mkdirSync(sharedDir, { recursive: true });
    fs.copyFileSync(resolvedLibFile, destPath);

    const relativePath = path.relative(path.dirname(filePath), destPath);
    const normalizedPath = './' + relativePath.replace(/\\/g, '/').replace(/\.(js|jsx)$/, '');
    const newRequirePath = normalizedPath;

    console.log(`[${pkgName}] ✅ require("${requirePath}") → require("${newRequirePath}")`);
    modified = true;

    return `require("${newRequirePath}")`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
};

const processPackage = async (pkgName) => {
  const pkgRoot = path.join(PACKAGES_DIR, pkgName);
  const libRoot = path.join(pkgRoot, 'lib');

  const files = await glob(['**/*.js', '**/*.jsx'], { cwd: libRoot, absolute: true });

  for (const file of files) {
    processFile(file, pkgName, pkgRoot, libRoot);
  }
};

(async () => {
  const packages = getPackages();

  for (const pkg of packages) {
    console.log(`🔍 Processing: ${pkg}`);
    await processPackage(pkg);
  }

  console.log('\n✅ Finished patching cross-package require() calls.\n');
})();
