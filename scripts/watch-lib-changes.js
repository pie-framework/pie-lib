const chokidar = require('chokidar');
const { exec } = require('child_process');

let timeout = null;
const DEBOUNCE_MS = 800;

const runPatch = () => {
  console.log('[watcher] Running patch script...');
  exec('node scripts/copy-external-imports.js', (err, stdout, stderr) => {
    if (err) {
      console.error('[watcher] Patch script failed:', err);
      return;
    }
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  });
};

console.log('[watcher] Watching lib/**/*.js for changes...');

chokidar
  .watch('packages/**/lib/**/*.js', {
    ignoreInitial: true,
  })
  .on('all', (event, path) => {
    console.log(`[watcher] Detected ${event}: ${path}`);
    clearTimeout(timeout);
    timeout = setTimeout(runPatch, DEBOUNCE_MS);
  });
