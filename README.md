# @pie-lib/\*


Some reusable react components, mostly used in [pie][pie] components.

Elements are in `packages`.

## install

```bash
npm install -g lerna
npm install
```

## develop

```bash
npm run dev
# go to http://localhost:3000
```

## test

```
npm test
```

### test a single package

```bash
npm test -- --scope pkg # eg: npm test -- --scope charting
```

## contributing

* the packages use `independent` versioning, meaning that a change in 1 package won't bump another package's version.
* use [conventional commits syntax][ccs] when commiting, lerna will detect the appropriate version bump.

## build

```bash
npm run build
```

## release

```bash
lerna publish --conventional-commits
# will add conventional commits to each packages CHANGELOG.md
# you can add --skip-npm and/or --skip-git if you want to bypass publishing to either.
```

### dependencies

[lerna]: https://lernajs.io/
[pie]: http://pie-framework.org
[ccs]: https://conventionalcommits.org/
