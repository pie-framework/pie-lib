/**
 * Minimal ESM integrity check for pie-lib.
 *
 * NOTE: Many pie-lib packages are UI-oriented and may touch DOM globals
 * at module evaluation time. Running a Node ESM `import()` here is therefore
 * both noisy and misleading.
 *
 * This check validates that:
 * - ESM artifacts exist for each non-blacklisted package
 * - The files are non-empty and look like ESM bundles
 */

import { readdirSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const packagesDir = join(root, 'packages');

const blacklist = new Set(['demo', 'pie-toolbox', 'test-utils']);

const isDir = async (p) => {
  try {
    const s = await stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
};

const isFile = async (p) => {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
};

async function main() {
  const pkgs = readdirSync(packagesDir).filter((p) => !blacklist.has(p));
  const failures = [];

  for (const p of pkgs) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await isDir(join(packagesDir, p)))) continue;

    const esmEntry = join(packagesDir, p, 'esm', 'index.js');
    // eslint-disable-next-line no-await-in-loop
    const exists = await isFile(esmEntry);
    if (!exists) {
      failures.push(`${p}: missing esm/index.js`);
      continue;
    }

    // Basic content sanity (avoid importing empty/corrupt files).
    // eslint-disable-next-line no-await-in-loop
    const content = await readFile(esmEntry, 'utf8');
    if (content.trim().length < 20) {
      failures.push(`${p}: esm/index.js looks too small`);
      continue;
    }

    // Heuristic: Rollup ESM bundles should contain at least one import/export.
    // This avoids executing the module (which can require a browser DOM).
    if (!content.includes('export ') && !content.includes('import ')) {
      failures.push(`${p}: esm/index.js not obviously ESM`);
    }
  }

  if (failures.length) {
    // eslint-disable-next-line no-console
    console.error(`ESM integrity failures (${failures.length}):`);
    for (const f of failures) {
      // eslint-disable-next-line no-console
      console.error(`- ${f}`);
    }
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(
    `ESM integrity OK (${pkgs.length} packages checked, blacklist: ${[...blacklist].join(', ')})`
  );
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


