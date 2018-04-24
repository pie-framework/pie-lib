# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="5.0.8"></a>
## [5.0.8](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.7...@pie-lib/editable-html@5.0.8) (2018-04-24)


### Bug Fixes

* **editor:** pass in className ([60b2c65](https://github.com/pie-framework/pie-lib/commit/60b2c65))




<a name="5.0.7"></a>
## [5.0.7](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.6...@pie-lib/editable-html@5.0.7) (2018-04-24)


### Bug Fixes

* **MarkButton:** change mark type to string ([e9b1ef2](https://github.com/pie-framework/pie-lib/commit/e9b1ef2))




<a name="5.0.6"></a>
## [5.0.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.5...@pie-lib/editable-html@5.0.6) (2018-04-24)


### Bug Fixes

* **lint:** lint fixes ([e30b47a](https://github.com/pie-framework/pie-lib/commit/e30b47a))




<a name="5.0.5"></a>
## [5.0.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.4...@pie-lib/editable-html@5.0.5) (2018-04-24)


### Bug Fixes

* **dependencies:** version bump ([dd82caf](https://github.com/pie-framework/pie-lib/commit/dd82caf))




<a name="5.0.4"></a>
## [5.0.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.3...@pie-lib/editable-html@5.0.4) (2018-04-24)


### Bug Fixes

* **dependencies:** bump slate-edit-list to 0.11.3 ([e82adc7](https://github.com/pie-framework/pie-lib/commit/e82adc7))
* **image:** fix up image plugin ([c7229eb](https://github.com/pie-framework/pie-lib/commit/c7229eb)), closes [#4](https://github.com/pie-framework/pie-lib/issues/4)




<a name="5.0.3"></a>
## [5.0.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.2...@pie-lib/editable-html@5.0.3) (2018-04-20)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="5.0.2"></a>
## [5.0.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.1...@pie-lib/editable-html@5.0.2) (2018-04-20)


### Bug Fixes

* **test:** normalize tests ([b86b3d9](https://github.com/pie-framework/pie-lib/commit/b86b3d9))




<a name="5.0.1"></a>
## [5.0.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@5.0.0...@pie-lib/editable-html@5.0.1) (2018-04-19)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="4.0.2"></a>
## [4.0.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@4.0.1...@pie-lib/editable-html@4.0.2) (2018-04-16)


### Bug Fixes

* **dependencies:** update dependencies ([8a5c1b2](https://github.com/pie-framework/pie-lib/commit/8a5c1b2))
* **serialization:** fix serialization ([9191bb6](https://github.com/pie-framework/pie-lib/commit/9191bb6))




<a name="4.0.1"></a>
## [4.0.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@3.1.1...@pie-lib/editable-html@4.0.1) (2018-04-16)


### Bug Fixes

* **dependencies:** version bump react and material-ui ([05d72cf](https://github.com/pie-framework/pie-lib/commit/05d72cf))
* **font:** set Roboto as font ([d142ce9](https://github.com/pie-framework/pie-lib/commit/d142ce9))




<a name="3.1.1"></a>
## [3.1.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@3.1.0...@pie-lib/editable-html@3.1.1) (2018-04-13)


### Bug Fixes

* **serializtion:** bump slate dependencies to fix serialization issues ([af11784](https://github.com/pie-framework/pie-lib/commit/af11784))




<a name="3.1.0"></a>
# [3.1.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@3.0.1...@pie-lib/editable-html@3.1.0) (2018-04-12)


### Features

* **ui:** polish disabled state, polish sizing logic ([9be2757](https://github.com/pie-framework/pie-lib/commit/9be2757))




<a name="3.0.1"></a>
## [3.0.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@3.0.0...@pie-lib/editable-html@3.0.1) (2018-04-05)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="3.0.0"></a>
# [3.0.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@2.2.5...@pie-lib/editable-html@3.0.0) (2018-04-02)


### Bug Fixes

* **EditableHtml:** wrap the Editor with a component that checks markup against value ([57b7dda](https://github.com/pie-framework/pie-lib/commit/57b7dda))
* **Editor:** use  `object` instead of  `kind` w/ slate@0.33.0 ([3bb0cca](https://github.com/pie-framework/pie-lib/commit/3bb0cca))
* **list:** use logic from 'slate-edit-list' ([d0be5fe](https://github.com/pie-framework/pie-lib/commit/d0be5fe))
* **types:** fix type checking ([a088983](https://github.com/pie-framework/pie-lib/commit/a088983))


### Features

* **bulleted-list:** add new plugin, add activePlugins prop, export DEFAULT_PLUGINS. ([6268832](https://github.com/pie-framework/pie-lib/commit/6268832))
* **EditableHtml:** export `Editor` ([c3e53fe](https://github.com/pie-framework/pie-lib/commit/c3e53fe))


### BREAKING CHANGES

* **Editor:** 'math' and 'image' plugins have been disabled pending fixes.




<a name="2.2.5"></a>
## [2.2.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/editable-html@2.2.4...@pie-lib/editable-html@2.2.5) (2018-03-28)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="2.2.4"></a>
## 2.2.4 (2018-03-06)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="2.2.3"></a>
## 2.2.3 (2018-03-06)




**Note:** Version bump only for package @pie-lib/editable-html

<a name="2.2.2"></a>
## 2.2.2 (2018-03-06)




**Note:** Version bump only for package @pie-lib/editable-html
