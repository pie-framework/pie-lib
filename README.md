# @pie-lib/\*

Some reusable react components, mostly used in [pie][pie] components.

Elements are in `packages`.

## install

```bash
yarn install
./node_modules/.bin/lerna bootstrap
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

- exact versions in demo
- deploy `next` demo on `develop`
- release `next` on `develop`
- deploy `latest` demo on `master`
- release `latest` on `master`

### test a single package

Just point jest to the dir/file:

```bash
./node_modules/.bin/jest packages/pkg-name/src/
```

## contributing

- the packages use `independent` versioning, meaning that a change in 1 package won't bump another package's version.
- use [conventional commits syntax][ccs] when commiting, lerna will detect the appropriate version bump.

### dependencies

[lerna]: https://lernajs.io/
[pie]: http://pie-framework.org
[ccs]: https://conventionalcommits.org/

## Test issues

Sometimes the project test set up can get out of synch

- try `lerna bootstrap`, `npm run build`, `rm -fr packages/test-utils/node_modules` and run again.

## Building and deploying a pre-release

```shell
# make sure the local demo is working first: scripts/dev then:
cd demo
./node_modules/.bin/next build
./node_modules/.bin/next export
cd out
# you can now deploy using now (or if you have another static site handler)
now .
```
