const { execSync } = require('child_process');

const getBranch = () =>
  execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

const getSha = short =>
  execSync(`git rev-parse ${short ? '--short' : ''} HEAD`)
    .toString()
    .trim();

module.exports = () => {
  const branch = getBranch();
  const sha = getSha();
  const short = getSha(true);
  return { branch, sha, short };
};
