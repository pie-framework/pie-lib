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
| static  | `scripts/static`                    | build and deploy the static site to github                |

### test a single package

Just point jest to the dir/file:

```bash
./node_modules/.bin/jest packages/pkg-name/src/
```

## contributing

* the packages use `independent` versioning, meaning that a change in 1 package won't bump another package's version.
* use [conventional commits syntax][ccs] when commiting, lerna will detect the appropriate version bump.

### dependencies

[lerna]: https://lernajs.io/
[pie]: http://pie-framework.org
[ccs]: https://conventionalcommits.org/

## Test issues

Sometimes the project test set up can get out of synch

* try `lerna bootstrap`, `npm run build`, `rm -fr packages/test-utils/node_modules` and run again.
