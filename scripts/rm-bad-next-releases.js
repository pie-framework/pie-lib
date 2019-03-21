const { getPackages } = require('@pie-framework/build-helper');

const { resolve } = require('path');
const { execSync } = require('child_process');
const semver = require('semver');
const _ = require('lodash');

const pkgs = getPackages(resolve(__dirname, '..', 'packages'));

pkgs.forEach(p => {
  const version = p.pkg.version;

  if (!p.pkg.private) {
    const buffer = execSync(`npm view ${p.pkg.name}@next versions --json`);
    // console.log('buffer:', buffer);
    const s = buffer.toString().trim();

    const arr = JSON.parse(s);
    const greaterThan = arr.filter(v => {
      const isNewer = semver.gt(v, p.pkg.version) > 0;
      const isPrerelease = semver.prerelease(v) !== null;
      return isNewer && !isPrerelease;
    });

    console.log(p.pkg.name, p.pkg.version, 'greaterThan', greaterThan);
    // greaterThan.forEach(v => {
    //   const nv = `${p.pkg.name}@${v}`;
    //   console.log(`removing: ${nv}`);
    //   execSync(`npm unpublish ${nv}`);
    // });
  }
});
