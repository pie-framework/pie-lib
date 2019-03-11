const fs = require('fs-extra');
const { getPackages } = require('@pie-framework/build-helper');
const { resolve, join } = require('path');

const safeRead = (dir, file) => {
  try {
    return fs.readFileSync(join(dir, file), 'utf8');
  } catch (e) {
    return '';
  }
};

exports.load = () => {
  const packages = getPackages(resolve(__dirname, '../../'));

  const filtered = packages.filter(pk => !pk.dir.endsWith('demo'));

  return filtered.map(pk => {
    const nextChangelog = safeRead(pk.dir, 'NEXT.CHANGELOG.md');
    const changelog = safeRead(pk.dir, 'CHANGELOG.md');
    return { ...pk, nextChangelog, changelog };
  });
};
