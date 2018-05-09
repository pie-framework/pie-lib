# @pie-lib/\*

Some reusable react components, mostly used in [pie][pie] components.

Elements are in `packages`.

## install

```bash
npm install -g lerna
npm install
```

## Commands

| Action  | Cmd                                 | Notes                                                     |
| ------- | ----------------------------------- | --------------------------------------------------------- |
| test    | `npm test`                          |                                                           |
| lint    | `npm run lint`                      |                                                           |
| build   | `npm run build`                     |                                                           |
| release | `npm run release`                   |                                                           |
| dev     | `scripts/dev --scope $package-name` | run the demo site on localhost:3000 `--scope` if optional |

## develop

```bash
npm run dev --scope package-name
# go to http://localhost:3000
```

`--scope` - watch a local package - if you don't set scope nothing is watched!

Under the hood this is doing:

```bash
cd demo
# boot next
./node_modules/.bin/next
#If you want to do some live dev against the site, just set up a babel watch like so:
# watch math-input/src for changes and send to demo app.
./node_modules/.bin/babel packages/math-input/src --watch --out-dir demo/node_modules/@pie-lib/math-input/lib --ignore node_modules
```

Then you can make changes and the demo site will reload on those changes.

## test

```
npm test
```

### test a single package

> You'll need to have the depencencies installed for each package: `lerna exec yarn install`.

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
# be sure to have built at this point.
lerna publish --conventional-commits
# will add conventional commits to each packages CHANGELOG.md
# you can add --skip-npm and/or --skip-git if you want to bypass publishing to either.
```

### dependencies

[lerna]: https://lernajs.io/
[pie]: http://pie-framework.org
[ccs]: https://conventionalcommits.org/
