const fs = require('fs-extra');
const { getPackages } = require('@pie-framework/build-helper');
const { resolve, join } = require('path');

const safeRead = (dir, file) => {
  try {
    console.log('[safeRead] dir: ', dir, file);
    return fs.readFileSync(join(dir, file), 'utf8');
  } catch (e) {
    console.log('e:', e);
    return undefined;
  }
};

exports.load = () => {
  const packages = getPackages(resolve(__dirname, '../../'));

  const filtered = packages.filter(pk => !pk.dir.endsWith('demo'));

  console.log('files: ', filtered.length);

  return filtered.map(pk => {
    console.log('read files for: ', pk.dir);
    const nextChangelog = safeRead(pk.dir, 'NEXT.CHANGELOG.md');
    const changelog = safeRead(pk.dir, 'CHANGELOG.md');
    return { ...pk, nextChangelog, changelog };
  });
};
