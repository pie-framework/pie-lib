# pie-lib

Some reusable react components.

Elements are in `packages`.

# install

```shell
npm install -g lerna # don't use for now
npm install
```

# develop

* the packages use `independent` versioning, meaning that a change in 1 package won't bump another package's version.
* use [conventional commits syntax][ccs] when commiting, lerna will detect the appropriate version bump.

# running

most packages have a `demo` directory in which you can run: `../node_modules/.bin/webpack-dev-server --hot --inline` in.

# release/publish

```bash
# run lint
npm run lint

lerna publish --conventional-commits # will add conventional commits to each packages CHANGELOG.md
# you can add --skip-npm and/or --skip-git if you want to bypass publishing to either.
```

### dependencies
* [lerna js][lerna] for handling multiple packages in a mono repo
* [pie][pie] to test/build the pies

[lerna]: https://lernajs.io/
[pie]: http://pie-framework.org
[ccs]: https://conventionalcommits.org/
