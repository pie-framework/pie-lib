# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@2.0.4...@pie-lib/pie-toolbox@2.0.5) (2024-09-25)


### Bug Fixes

* use head, not body ([9efd05b](https://github.com/pie-framework/pie-lib/commit/9efd05b48fd13cdec53af1aad41396d4fdfb5f96))





## [2.0.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@2.0.3...@pie-lib/pie-toolbox@2.0.4) (2024-09-25)


### Bug Fixes

* experiment with mra (overwriting mr instance with mra instance) ([bb9aa6c](https://github.com/pie-framework/pie-lib/commit/bb9aa6c0012b1bbd606f9af70c8913dc1a9af329))





## [2.0.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@2.0.2...@pie-lib/pie-toolbox@2.0.3) (2024-09-24)


### Bug Fixes

* trigger build for pslb ([6e06089](https://github.com/pie-framework/pie-lib/commit/6e06089d3fbd32e0ef30717a05a3f01561fde1cd))





## [2.0.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@2.0.1...@pie-lib/pie-toolbox@2.0.2) (2024-09-19)


### Bug Fixes

* add preLoad substitution ([df0981b](https://github.com/pie-framework/pie-lib/commit/df0981bdf8cd9ad1455d7665af704c54ec0264f6))





## [2.0.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@2.0.0...@pie-lib/pie-toolbox@2.0.1) (2024-09-19)


### Bug Fixes

* increase waiting time for math-rendering ([0a69dd3](https://github.com/pie-framework/pie-lib/commit/0a69dd3a97c5774bce00b230f25ca68468063f0c))





# [2.0.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.33.1...@pie-lib/pie-toolbox@2.0.0) (2024-09-19)


### Features

* major changes to math-rendering-accessible PD-3989, PD-4103, PD-3865 ([6f6f06c](https://github.com/pie-framework/pie-lib/commit/6f6f06c1235e55bc0b80642f75023b6ea745be8d))


### BREAKING CHANGES

* big refactoring on the implementation of math-rendering-accessible





## [1.33.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.33.0...@pie-lib/pie-toolbox@1.33.1) (2024-09-19)


### Bug Fixes

* revert changes made for PD-3989 ([79581d3](https://github.com/pie-framework/pie-lib/commit/79581d32024c413d0b31da6e0dca21e5fbff1182))





# [1.33.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.32.1...@pie-lib/pie-toolbox@1.33.0) (2024-09-18)


### Bug Fixes

* handle the case when renderMath (MathJax) is used only for mmlOutput, and it was not yet initialised PD-4103 ([368c9bc](https://github.com/pie-framework/pie-lib/commit/368c9bc23363a30b914b4d9ba02ed6fa350169f3))


### Features

* eliminate Promises and make mra efficient PD-3989 ([e19e925](https://github.com/pie-framework/pie-lib/commit/e19e92513cc1fc7844957250514e41407d481393))





## [1.32.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.32.0...@pie-lib/pie-toolbox@1.32.1) (2024-09-16)


### Bug Fixes

* **editable-html:** fix Spanish input issue on iPad and resolve keypad interaction bugs PD-4061 & PD-4021 ([4874314](https://github.com/pie-framework/pie-lib/commit/4874314ec7b4d5e06c70dfe552fc6758fa5e134d))





# [1.32.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.31.4...@pie-lib/pie-toolbox@1.32.0) (2024-09-16)


### Bug Fixes

* made sure enter handling is happening only after all the other plugins are checked [PD-4039] ([6c613ef](https://github.com/pie-framework/pie-lib/commit/6c613efc99f99a389353e007200910ac2592aa9e))
* **editable-html:** move custom plugins buttons before response area PD-4027 ([632ae3c](https://github.com/pie-framework/pie-lib/commit/632ae3c3ab7df3596f1e23898c17f4ae9d0e6dc3))


### Features

* **mask-markup:** changed chip backgorund color to white & added opacity 0.6 for disabled class PD-4042 ([2eaf520](https://github.com/pie-framework/pie-lib/commit/2eaf5203a4e65215bf9a33ae0f210e41c3ce6f65))





## [1.31.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.31.3...@pie-lib/pie-toolbox@1.31.4) (2024-09-10)


### Bug Fixes

* **drag:** clean up & refactor styles for placeholder PD-3652 ([8d20af3](https://github.com/pie-framework/pie-lib/commit/8d20af343b837ffe45e47f258c87ab2708747d67))
* **drag:** moving styles for disabling long touch default events PD-3652 ([857c1cd](https://github.com/pie-framework/pie-lib/commit/857c1cd183b32387ecacf9cfa9cef89712047666))
* **editable-html:** Add accessible aria-label to extended-text-entry, response-area editor for improved accessibility PD-2451 ([48f287b](https://github.com/pie-framework/pie-lib/commit/48f287b5c0f68abeed48015ccd9f5def19daeb53))
* **editable-html:** revert changes from feat/PD-2450 due to label not being correctly recognized by screen readers during keyboard navigation in the editor PD-2451 ([c53e671](https://github.com/pie-framework/pie-lib/commit/c53e671801d99bcc5aa161d7e766a07ee9e01eff))
* **placeholder:** apply new class - noSelectStyles to placeholder, board and categorizeBoard classes PD-3652 ([2a08878](https://github.com/pie-framework/pie-lib/commit/2a0887842af95a3879bd4f80d4ceb23eb3b32632))
* **placeholder:** Ensure noSelectStyles always applied in PlaceHolder component PD-3652 ([0d62106](https://github.com/pie-framework/pie-lib/commit/0d62106d1cdffb9fd69bc08691624a67a133cca9))





## [1.31.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.31.2...@pie-lib/pie-toolbox@1.31.3) (2024-09-10)


### Bug Fixes

* table and lists buttons can not be disabled (discovered while implementing PD-4065) ([8d69c10](https://github.com/pie-framework/pie-lib/commit/8d69c108dedb624fb59825db63068f60759e06a3))





## [1.31.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.31.1...@pie-lib/pie-toolbox@1.31.2) (2024-09-04)


### Bug Fixes

* revert experiments with mra ([90e46f4](https://github.com/pie-framework/pie-lib/commit/90e46f4623ed93d31abeeffd6ab21b3e028fc17c))





## [1.31.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.31.0...@pie-lib/pie-toolbox@1.31.1) (2024-09-03)


### Bug Fixes

* experiment with mra ([b46be25](https://github.com/pie-framework/pie-lib/commit/b46be25a94b6b6d713193e741aac6db4ee3a8cb6))





# [1.31.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.30.2...@pie-lib/pie-toolbox@1.31.0) (2024-09-03)


### Features

* experiment with mra ([f99ddb0](https://github.com/pie-framework/pie-lib/commit/f99ddb0c767c952774b1d4e576c96328f576591e))





## [1.30.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.30.1...@pie-lib/pie-toolbox@1.30.2) (2024-08-29)


### Bug Fixes

* trigger build ([afcc754](https://github.com/pie-framework/pie-lib/commit/afcc75469374b074fe02768960e783491d551f26))





## [1.30.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.30.0...@pie-lib/pie-toolbox@1.30.1) (2024-08-29)


### Bug Fixes

* sanity checks ([fba0dd9](https://github.com/pie-framework/pie-lib/commit/fba0dd9dd4706eccc15237c174ce410066a51775))





# [1.30.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.29.3...@pie-lib/pie-toolbox@1.30.0) (2024-08-27)


### Bug Fixes

* **editable-html:** change media dialog default selected tab PD-4026 ([10b4045](https://github.com/pie-framework/pie-lib/commit/10b404557ddfdab6dc3fb69397454f2309636608))


### Features

* **editable-html:** add superscript and subscript to rich editors PD-3990 ([9dc943f](https://github.com/pie-framework/pie-lib/commit/9dc943f9d1d87459fa61f41de8985aacc213a180))
* **editable-html:** create icon componenets(svg) for superscript and subscript PD-3990 ([4e4a1d2](https://github.com/pie-framework/pie-lib/commit/4e4a1d20c1c5174179269360a16d93fb72054f23))





## [1.29.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.29.2...@pie-lib/pie-toolbox@1.29.3) (2024-08-22)

### Bug Fixes

- **editable-html:** Adjusted the class name checks in the Editor component to use dynamic references instead of hardcoded values PD-4021 ([a16fe34](https://github.com/pie-framework/pie-lib/commit/a16fe34f76555d1abd342d622340d2d34847ced1))
- **editable-html:** Improve handling of onBlur to prevent input value reset when using special character keypads PD-4021 ([9d0d0ee](https://github.com/pie-framework/pie-lib/commit/9d0d0ee7667bebeebb4344c3a768dc1033411b87))

## [1.29.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.29.1...@pie-lib/pie-toolbox@1.29.2) (2024-08-19)

### Bug Fixes

- **mask-markup:** Added unit tests for new logic updateDimensions and getRootDimensions PD-3841 ([217e45a](https://github.com/pie-framework/pie-lib/commit/217e45a72f32466c87b9b7f6836a739b12b61710))
- changed labeling for insert media [PD-3855](<[cddff34](https://github.com/pie-framework/pie-lib/commit/cddff34c0319cfbb822e04a7cead299c58d5d6e9)>)

## [1.29.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.29.0...@pie-lib/pie-toolbox@1.29.1) (2024-08-06)

### Bug Fixes

- **charting:** update snapshots PD-4000 ([f5dfc20](https://github.com/pie-framework/pie-lib/commit/f5dfc20ac2a246f5935496ab7632c02bb9027116))

# [1.29.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.28.1...@pie-lib/pie-toolbox@1.29.0) (2024-08-06)

### Bug Fixes

- **editable-html:** add Response Area button when the cursor is positioned in a table PD-3996 ([d9a77d2](https://github.com/pie-framework/pie-lib/commit/d9a77d20970955d917f6c381b7d9c3f7c059ae93))
- **graphing:** fix tests and increase left/right padding PD-3792 ([79655ef](https://github.com/pie-framework/pie-lib/commit/79655effc32a49e6af313e82f32e6856c4d7026a))
- **graphing:** fixed padding from domain and range PD-3791 ([cc6f659](https://github.com/pie-framework/pie-lib/commit/cc6f65992a8869e5a82efa9884c04dbb58db684e))
- **graphing:** tighten up spacing Graphing PD-3792 ([e697c88](https://github.com/pie-framework/pie-lib/commit/e697c887a208878303c492e0fadeb6c8f770e064))
- **mask-markup:** add minWidth, minHeight in case width and height are not defined PD-3841 ([c08cc9e](https://github.com/pie-framework/pie-lib/commit/c08cc9e583b7455d666a5aad8e2a98e71c01979b))
- **mask-markup:** add props back due to merge conflicts PD-3956 ([7b486fb](https://github.com/pie-framework/pie-lib/commit/7b486fb218471faabb15c760beb6a75efec2ff0c))
- **mask-markup:** add props back due to merge conflicts PD-3956 ([e1a79ed](https://github.com/pie-framework/pie-lib/commit/e1a79ed034a0fa16e30500b09562a294e6a57edd))
- **mask-markup:** add sanity check for parseFloat PD-3841 ([21895ba](https://github.com/pie-framework/pie-lib/commit/21895ba8baf830c78829448c76d089e05dfea36e))
- **mask-markup:** add sanity check for ref, simplify creation of new object PD-3841 ([01c2157](https://github.com/pie-framework/pie-lib/commit/01c2157e4f59dc18bfd939034fcc30693a195834))
- **mask-markup:** add style back PD-3956 ([77b07c1](https://github.com/pie-framework/pie-lib/commit/77b07c1b5be54fd08cd8517031a1a09d0c9b63e6))
- **mask-markup:** conclude merge with develop PD-3956 ([2181cef](https://github.com/pie-framework/pie-lib/commit/2181cef761ce254e506d162e5bd0463976cdca3d))
- delete unneeded code PD-3956 ([7723234](https://github.com/pie-framework/pie-lib/commit/772323429c744fdd432a5eb202c42f6620ea8f74))
- delete unneeded code PD-3956 ([ff29ad3](https://github.com/pie-framework/pie-lib/commit/ff29ad3dcd95d2a61144c10b59c4f96a68a808fc))
- made sure arrow down is not removed randomly [PD-3569](<[efa5062](https://github.com/pie-framework/pie-lib/commit/efa50624108ef47b64abcb74c88350c0f3c64f8c)>)

### Features

- **mask-markup:** adjust logic if dimensions are configured in model, update snapshots PD-3841 ([80bd45a](https://github.com/pie-framework/pie-lib/commit/80bd45a79df13f6179bded3fbdf51610c5d8ef46))
- **mask-markup:** change behaviour of choicePosition pool choices PD-3956 ([7501a5f](https://github.com/pie-framework/pie-lib/commit/7501a5f9ac8a27649ff33797653b30ccf2d0d41a))
- **mask-markup:** Change the behavior of choicesPosition PD-3956 ([6214cc7](https://github.com/pie-framework/pie-lib/commit/6214cc7e40032e5758412e677917860426811ee0))
- **mask-markup:** computing sould work both for numbers and strings PF-3841 ([7992856](https://github.com/pie-framework/pie-lib/commit/7992856d04fff031ee510ad19909403a5eb1ef12))
- made sure google drive videos are allowed to be embedded [PD-3855](<[fb46905](https://github.com/pie-framework/pie-lib/commit/fb469053f0df70fc814e3491a3c8c7e192965f3b)>)

## [1.28.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.28.0...@pie-lib/pie-toolbox@1.28.1) (2024-08-01)

### Bug Fixes

- initialize MathJax if there's another version that was initialized previously PD-3988 ([b1289a0](https://github.com/pie-framework/pie-lib/commit/b1289a0e3249fce2ee3fb466e97b39bdefaffc99))

# [1.28.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.27.0...@pie-lib/pie-toolbox@1.28.0) (2024-07-26)

### Features

- **categorize,drag-in-the-blank,ica,match-list:** avoid allocating more vertical space & add background to answers pool area PD-3944 ([d24a18c](https://github.com/pie-framework/pie-lib/commit/d24a18c7db95e85818427b530f25755b42d6e1fb))
- **categorize,drag-in-the-blank,ica,match-list:** revert white background from chip class PD-3944 ([27d02e8](https://github.com/pie-framework/pie-lib/commit/27d02e81e23f3fffeac9f5fa229109f452763b94))
- **categorize,drag-in-the-blank,placement-ordering,match-list:** dashed border for response areas PD-3946 ([f3f62ba](https://github.com/pie-framework/pie-lib/commit/f3f62bafd6bc8ebe0ffaefb15479e8e8ff7378a2))
- **editable-html:** Add accessible label to extended-text-entry, response-area editor for improved accessibility PD-2450 ([f0d28a9](https://github.com/pie-framework/pie-lib/commit/f0d28a92e91d79cf3534b7ec64f3f7af7e0efaea))
- **placeholder:** change background color PD-3944 ([db0d7fd](https://github.com/pie-framework/pie-lib/commit/db0d7fd849a0f458f6dd46c3788678d9e81200ef))
- **placeholder:** changed backgroundColor to use colors from color scheme PD-3944 ([9e64449](https://github.com/pie-framework/pie-lib/commit/9e6444918a5f8e73afd491274a7da34242e576df))
- **placeholder:** for placement-ordering adjust style based on type PD-3946 ([2a2cde8](https://github.com/pie-framework/pie-lib/commit/2a2cde822ce0d72121c558ba9366a339fbe596a9))
- **placeholder:** remove border from board class as no stroke is needed PD-3944 ([d6f135f](https://github.com/pie-framework/pie-lib/commit/d6f135f4b8fc28c1b3266414303a60014224e432))
- **placeholder, blank:** update colors to use from color scheme PD-3946 ([d1bc881](https://github.com/pie-framework/pie-lib/commit/d1bc8815a2718f0de00589172913e761e8371ec3))

# [1.27.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.26.2...@pie-lib/pie-toolbox@1.27.0) (2024-07-25)

### Bug Fixes

- **editable-html:** remove tabindex from editor-and-toolbar component as it was causing an issue where two tab presses were required to focus on the editor PD-2451 ([b1e5ca0](https://github.com/pie-framework/pie-lib/commit/b1e5ca0ef6a6f5503e871106f4cf2b9a6f8be821))

### Features

- added new colors ([d90a51a](https://github.com/pie-framework/pie-lib/commit/d90a51a405437ff6ac8d9858b6bbf9cb0660ad7e))
- **drag-in-the-blank:** use right-angle corners for answer choices & response areas PD-3950 ([84e5a0a](https://github.com/pie-framework/pie-lib/commit/84e5a0a2b3b15f595b71507efefcea3a984a646c))
- **editable-html:** get rif of download option inline audio PD-3845 ([6be99b6](https://github.com/pie-framework/pie-lib/commit/6be99b69ea1c9cc1ac8e91dd0b5eb184865f9c05))

## [1.26.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.26.1...@pie-lib/pie-toolbox@1.26.2) (2024-07-19)

### Bug Fixes

- **editable-html:** revert changes PD-3630 ([9ed0550](https://github.com/pie-framework/pie-lib/commit/9ed0550ac56959cb1b2d9ee5993989fbfde4fc4d))

## [1.26.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.26.0...@pie-lib/pie-toolbox@1.26.1) (2024-07-17)

### Bug Fixes

- **graphing:** faded labels on touchscreen devices PD-3945 ([cf33d29](https://github.com/pie-framework/pie-lib/commit/cf33d294e19c47cb9429eb1fd2daa451bd5c32fc))
- **math-preview:** ensure consistent styling for MathQuill elements within the editor and pad input container PD-3627 ([273cd24](https://github.com/pie-framework/pie-lib/commit/273cd247ee62d66c1c08d25a564dab116736b65c))

# [1.26.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.25.3...@pie-lib/pie-toolbox@1.26.0) (2024-07-16)

### Bug Fixes

- **editable-html:** introduce setActiveKeypad utility for consistent keypad lifecycle management, this utility ensures that only one keypad remains active at any time by automatically closing any previously active keypad when a new one is set PD-3630 ([e089fb8](https://github.com/pie-framework/pie-lib/commit/e089fb82a775d03e5d54d8378676a1720b2c937a))
- made sure special characters popup shows things on 4 rows [PD-3629](<[9a97e02](https://github.com/pie-framework/pie-lib/commit/9a97e0294330212e6f6cd380a21c77b0afea93d1)>)
- **math-preview:** enforce consistent styling for MathQuill elements PD-3627 ([6340792](https://github.com/pie-framework/pie-lib/commit/63407926a6d638288832f32fbd7fa344fbc99116))
- add cursor pointer PD-3631 ([86c8cf1](https://github.com/pie-framework/pie-lib/commit/86c8cf1add119eaa6838783150de010065b7808b))

### Features

- rotate inputs if they don't fit inside the space ([5f5ef67](https://github.com/pie-framework/pie-lib/commit/5f5ef67b038dea60c4067faa95fde47da7b8b378))
- rotate math instamces if they don't fit inside the space PD-3622 ([4b8d594](https://github.com/pie-framework/pie-lib/commit/4b8d5946caf4cf9c6306dc8d3b33ccc0708347ac))

## [1.25.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.25.2...@pie-lib/pie-toolbox@1.25.3) (2024-07-10)

### Bug Fixes

- sanity checks ([5039086](https://github.com/pie-framework/pie-lib/commit/503908682b2fe64ff9bb7235817e3c80663eb62d))

## [1.25.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.25.1...@pie-lib/pie-toolbox@1.25.2) (2024-07-10)

### Bug Fixes

- made sure blockquote and h3 are not visible by default [PD-3878](<[e799fd3](https://github.com/pie-framework/pie-lib/commit/e799fd31cd0da8db764bb14fb4e513670d1cf761)>)
- made sure data attributes is not preventing toggling of blockquote and h3 [PD-3878](<[8228620](https://github.com/pie-framework/pie-lib/commit/8228620e98cd079bf0542b91cd8e86bbc1b6aa17)>)
- **charting:** labels should not be marked based on correctness if are not editable PD-3799 ([7e9ec0d](https://github.com/pie-framework/pie-lib/commit/7e9ec0d06b0583e2a461d927b0ae8397a0b8949f))
- **graphing:** Prevent editor from gaining focus after clicking Done on axis labels PD-3924 ([fb0725d](https://github.com/pie-framework/pie-lib/commit/fb0725dd418b9ac19abfad0a967d0637635871d8))

## [1.25.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.25.0...@pie-lib/pie-toolbox@1.25.1) (2024-07-04)

### Bug Fixes

- **categorize:** export new method PD-3895 ([c052fda](https://github.com/pie-framework/pie-lib/commit/c052fdaad3d017b2ba01fa4cd03aacaac340c0cf))
- **categorize:** refactor remove choice from alternates algorithm to avoid deleteing unwanted choices PD-3895 ([7545746](https://github.com/pie-framework/pie-lib/commit/7545746e99f61810949b78a44393915226528bed))
- **drag-in-the-blank:** prevent line wrapping for response area PD-3653 ([d26928d](https://github.com/pie-framework/pie-lib/commit/d26928df06723fe9d6e24043afb643f95470db6b))
- **editable-html:** prevent editor from regaining focus when using Spanish or special character keypad PD-3834 ([1a69b7d](https://github.com/pie-framework/pie-lib/commit/1a69b7d18aa07fe6730e5b1d28bd290f585f1527))
- **editable-html/math-templated:** render math content PD-3879 ([4369ab8](https://github.com/pie-framework/pie-lib/commit/4369ab8e5268ad94df0ffabc3c20aed80faf778a))
- **graphing:** app crashes when user start writing in a label field ([38d2da6](https://github.com/pie-framework/pie-lib/commit/38d2da6f86207633a314e87361172e8a5cf03dd2))

# [1.25.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.24.2...@pie-lib/pie-toolbox@1.25.0) (2024-06-26)

### Bug Fixes

- **editable-html:** adjust container based on math toolbar and keypad PD-3028 ([a4ab477](https://github.com/pie-framework/pie-lib/commit/a4ab47713520e8b3835a3a1a5e04612f6bdd27da))

### Features

- enter adds a new paragraph, regards of the block that is splitted [PD-3773](<[610935c](https://github.com/pie-framework/pie-lib/commit/610935c38275efedc22e415457aba245b7689d3a)>)

## [1.24.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.24.1...@pie-lib/pie-toolbox@1.24.2) (2024-06-24)

### Bug Fixes

- implemented undo and redo buttons [PD-3775](<[217e695](https://github.com/pie-framework/pie-lib/commit/217e695e553e0ed11ace41719128777698aa86e3)>)
- made sure styles for h3 and blockquote are set properly ([ccddb38](https://github.com/pie-framework/pie-lib/commit/ccddb384af15c9d32ad6c6c0fd89798f38cdc18c))

## [1.24.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.24.0...@pie-lib/pie-toolbox@1.24.1) (2024-06-24)

### Bug Fixes

- update mathml-to-latex PD-3868 ([a171e95](https://github.com/pie-framework/pie-lib/commit/a171e956ee53e4e43e742465ef498e8a368d3e90))

# [1.24.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.23.1...@pie-lib/pie-toolbox@1.24.0) (2024-06-24)

### Features

- ability to turn on or off plugins as h3, blockquote, bold, italic, strikethrough, underline PD-3772 ([62a925c](https://github.com/pie-framework/pie-lib/commit/62a925c3a05c2d73c5ed23595f2e02978ee265fb))
- **editable-html:** math-templated updates. Show index from 1, update latex even if it's an empty string PD-3813 ([5cc38ec](https://github.com/pie-framework/pie-lib/commit/5cc38ec8ec3d2ec7f57c58a782a4f49e446f4feb))

## [1.23.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.23.0...@pie-lib/pie-toolbox@1.23.1) (2024-06-19)

### Bug Fixes

- use latest version for mathquill ([ac02a23](https://github.com/pie-framework/pie-lib/commit/ac02a2369536bdcb33c21ff313ade5137a9e1fa3))

# [1.23.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.22.0...@pie-lib/pie-toolbox@1.23.0) (2024-06-19)

### Bug Fixes

- fixed some edge cases for blockquote handling [PD-3771](<[dac9791](https://github.com/pie-framework/pie-lib/commit/dac97910f9f062bceb80be03219ed10587372792)>)
- overlines PD-3206, logaritmic expressions PD-3186 (PD-1311), long division PD-3179 ([59e6078](https://github.com/pie-framework/pie-lib/commit/59e60781111a97818e52b02eb7a5b0b53aa2a72b))

### Features

- **editable-html:** math-templated design updates and refactor PD-3817 ([ee97f7f](https://github.com/pie-framework/pie-lib/commit/ee97f7f67a6205a83f25de675f9a85d7e8f0d68f))
- **editable-html:** remove unwanted chages PD-3817 ([79a6b9b](https://github.com/pie-framework/pie-lib/commit/79a6b9b66d61538f747cd484a215a0d48275e0a5))
- implemented blockquote button [PD-3771](<[cf0f4ac](https://github.com/pie-framework/pie-lib/commit/cf0f4ac671041da35d09e53a406a42dc5da2082d)>)
- implemented h3 functionality [PD-3772](<[ed8e20e](https://github.com/pie-framework/pie-lib/commit/ed8e20efb7d25c50d296edde69611bf862196bfd)>)
- wip PD-3817 ([e774b97](https://github.com/pie-framework/pie-lib/commit/e774b9721bf81875dc5d14b40934ed44c8ac9628))
- **editable-html:** wip response areas for math-templated PD-3817 ([a946379](https://github.com/pie-framework/pie-lib/commit/a946379bd358c0cca783cd04495b900303ce52c1))

# [1.22.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.21.3...@pie-lib/pie-toolbox@1.22.0) (2024-06-13)

### Features

- **graphing:** Adjust keyLegend to show/hide legend based on isLabelAvailable + adjust height PD-3787 ([ce0cf14](https://github.com/pie-framework/pie-lib/commit/ce0cf143549ef04362b4a1a98ee6bdd1aaa63a36))
- **graphing:** adjust label styles PD-3786 ([bfcb63a](https://github.com/pie-framework/pie-lib/commit/bfcb63a4d79d38951f0e9b58b3c35ef079ea6d61))
- **graphing:** cleanup and refactor PD-3735 ([9e7f27d](https://github.com/pie-framework/pie-lib/commit/9e7f27de9abc07f9095dd0c2218737ef4268e762))
- **graphing:** fix tests PD-3735 ([0d4f1b8](https://github.com/pie-framework/pie-lib/commit/0d4f1b808dbb4e995eab43bae4ee2536fc049b29))
- (graphing) redesign graph objects - change colors and add icons PD-3785 ([ccb8375](https://github.com/pie-framework/pie-lib/commit/ccb8375bbd7c526329d910f060e769baf4b09726))
- (graphing) Redesign treatments for points that are correctly positioned but either mislabeled or missing labels PD-3786 ([2db58e8](https://github.com/pie-framework/pie-lib/commit/2db58e865cb90b7e6d3ba81cf9935485c2ef3f04))

## [1.21.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.21.2...@pie-lib/pie-toolbox@1.21.3) (2024-06-13)

### Bug Fixes

- made sure lists work properly and are merged if one after another [PD-3391](<[2dd55cd](https://github.com/pie-framework/pie-lib/commit/2dd55cd41e2f0d6cb7d69a2adfb30ae9d3a3f524)>)
- upgrade mathml-to-latex version PD-3180 ([ee10da5](https://github.com/pie-framework/pie-lib/commit/ee10da5ba9ee6b1aea6cdaa22daab65e4e9c4b7f))

## [1.21.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.21.1...@pie-lib/pie-toolbox@1.21.2) (2024-06-13)

### Bug Fixes

- **editable-html:** eliminate custom onFocus and onBlur functions from CustomToolbar component, use them for accessibility (ref PD-2455) only in DefaultToolbar PD-3839 ([f1dc949](https://github.com/pie-framework/pie-lib/commit/f1dc9497f78c3001a799a51e37755a38ab487a14))

## [1.21.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.21.0...@pie-lib/pie-toolbox@1.21.1) (2024-06-05)

### Bug Fixes

- math-templated: needs Response Areas button when cursor is inside a table PD-3811 ([f87d83f](https://github.com/pie-framework/pie-lib/commit/f87d83f153ec4fdf94f007c2454b1491d0dd8560))

# [1.21.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.20.1...@pie-lib/pie-toolbox@1.21.0) (2024-06-03)

### Features

- **editable-html:** add aria label for list buttons PD-2455 ([ffd0ef8](https://github.com/pie-framework/pie-lib/commit/ffd0ef877b1b9f7ae23fc1976e8b91867dad5cc2))
- **editable-html:** enhance keyboard navigation and accessibility for editor and toolbar, Make the editor and toolbar fully navigable using the keyboard, Convert toolbar items to buttons for better accessibility, Ensure toolbar buttons are actionable with keyboard interactions, Add aria-labels to toolbar buttons for improved screen reader support PD-2455 ([a95c8eb](https://github.com/pie-framework/pie-lib/commit/a95c8eb91d9826831d66ba555b80ac3505cd95fc))
- **editable-html:** enhance keyboard navigation and accessibility for editor and toolbar, Make the editor and toolbar fully navigable using the keyboard, Convert toolbar items to buttons for better accessibility, Ensure toolbar buttons are actionable with keyboard interactions, Add aria-labels to toolbar buttons for improved screen reader support PD-2455 ([43b0677](https://github.com/pie-framework/pie-lib/commit/43b0677d4b97bcc1585d694b9e576ad390de4d72))
- **editable-html:** WIP enhance keyboard accessibility for toolbar and buttons PD-2455 ([975e2d6](https://github.com/pie-framework/pie-lib/commit/975e2d67410896137ef9fc5792c4c2de4983a3ce))
- (graphing) View, points, edges, and arrows should all be black PD-3733 ([783d1fb](https://github.com/pie-framework/pie-lib/commit/783d1fbf43c1ecb26ec9623a609dad8cccb0a9f9))

## [1.20.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.20.0...@pie-lib/pie-toolbox@1.20.1) (2024-06-03)

### Bug Fixes

- **feedback:** create new functions without using promise PD-1273 ([450527d](https://github.com/pie-framework/pie-lib/commit/450527d50c2e35404cf794ac8024204d056ef2b6))
- made sure a table has a node before and after it [PD-3788] so user can focus on those ([a869a47](https://github.com/pie-framework/pie-lib/commit/a869a473f05b4ff1072a840677a2e2dad456c577))

# [1.20.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.19.1...@pie-lib/pie-toolbox@1.20.0) (2024-05-27)

### Features

- **graphing:** label's behaviour like other tools PD-3736 ([2d3fb4e](https://github.com/pie-framework/pie-lib/commit/2d3fb4ec8900b32976312bc6e7716babb34be66d))
- **graphing:** limit labeling the points of othe tools tha point PD-3736 ([8bc713b](https://github.com/pie-framework/pie-lib/commit/8bc713b6d9848588eb86b4f0173a413c42c396b9))
- **graphing:** write tests in tools for new case PD-3736 ([88dd39d](https://github.com/pie-framework/pie-lib/commit/88dd39dcbb0901205345b560f482999890ab16ce))
- **math-input:** Enhance announcement logic PD-2488 ([6cd0c7b](https://github.com/pie-framework/pie-lib/commit/6cd0c7b8f4f097d1376fd92d89952b36d8c43a98))
- **math-input:** Replace direct DOM manipulation with React.createRef for better lifecycle management and test fixes PD-2488 ([9059a91](https://github.com/pie-framework/pie-lib/commit/9059a916353badd1f85aa2952f58acc80d5db5d8))
- **math-input:** WIP Implement custom event-based announcements for accessibility PD-2488 ([d8c8c36](https://github.com/pie-framework/pie-lib/commit/d8c8c36f343823eb247df54e43fb6f351dc9808d))
- (graphing) Change the shade of gray used for background objects PD-3734 ([1a43f3b](https://github.com/pie-framework/pie-lib/commit/1a43f3b60efa6bd8694c4972e25b717d27e28604))
- (graphing) Update snapshot tests PD-3734 ([9179add](https://github.com/pie-framework/pie-lib/commit/9179adda66bd6163d77195afd5d3c9510e35fdc2))

## [1.19.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.19.0...@pie-lib/pie-toolbox@1.19.1) (2024-05-27)

### Bug Fixes

- made sure deletion works properly in table editing [PD-2126](<[d2e24c1](https://github.com/pie-framework/pie-lib/commit/d2e24c1f902d3ca62842e22cf2929e16e62adb5b)>)
- **math-input:** fixed wrong math editor for grade 1-2 PD-3740 ([948c00f](https://github.com/pie-framework/pie-lib/commit/948c00fd81dcf3f223a58001232dbf882b7ee57d))

# [1.19.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.18.0...@pie-lib/pie-toolbox@1.19.0) (2024-05-24)

### Features

- insert customizable mask wip PD-632 ([6bd6308](https://github.com/pie-framework/pie-lib/commit/6bd6308915a37aa650e776a388ffd786230c9587))

# [1.18.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.5...@pie-lib/pie-toolbox@1.18.0) (2024-05-21)

### Features

- insert new Response Area Type: math-templated PD-632 ([26ed371](https://github.com/pie-framework/pie-lib/commit/26ed371719f1122d8ac1900a9811b78c8e2503a4))

## [1.17.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.4...@pie-lib/pie-toolbox@1.17.5) (2024-05-14)

### Bug Fixes

- **correct-answer-toggle:** enchance with touch event the expander PD-3640 ([960ece2](https://github.com/pie-framework/pie-lib/commit/960ece24b9df8a0b0640558e82e7aa6c1be7735e))

## [1.17.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.3...@pie-lib/pie-toolbox@1.17.4) (2024-05-13)

### Bug Fixes

- sanity checks ([fe3fe79](https://github.com/pie-framework/pie-lib/commit/fe3fe7922a0a9d6deeaf4bc31d41f4b69f072837))
- **charting:** enhance getClientPoint from grid-draggable with comments and sanity checks PD-3650 ([77d8ae5](https://github.com/pie-framework/pie-lib/commit/77d8ae5a9256900eb7eefc05336c21f79a4b6b46))
- **editable-html:** add special characters in table toolbar PD-2127 ([4a5a4bc](https://github.com/pie-framework/pie-lib/commit/4a5a4bc06906e56cbb860720d5f859080f79aaa5))
- **mask-markup:** Clear MathJax containers and reset LaTeX on markup updates for accurate re-rendering. ([81c7f4e](https://github.com/pie-framework/pie-lib/commit/81c7f4e9ee8634ac0e4297f607f751a11a16860d))
- **math-input:** refresh content on click PD-3191 ([2146714](https://github.com/pie-framework/pie-lib/commit/2146714e8ef9ea59920337de30e1550fa1b27e58))
- add 1 000 000 max character limit on all html editors PD-3709 ([c59b6d6](https://github.com/pie-framework/pie-lib/commit/c59b6d602c62e75aba7b72e8b5cf02b779ca6926))
- **math-rendering-accessible:** Eliminate console logs added temporarily for debugging PD-3751 ([16d9495](https://github.com/pie-framework/pie-lib/commit/16d94953aa4237ad4e142cb55d7e5da83ce86d8c))
- charting - bottom label is not moving with the content ([b5fed7e](https://github.com/pie-framework/pie-lib/commit/b5fed7e73dacb01104dfbb2e9c9851e1c3bac168))
- charting - in bars handle disapear after drag ([4a56cda](https://github.com/pie-framework/pie-lib/commit/4a56cda590f6b6812c56afedd93d87214afdf495))
- provided getFousedValue properly [PD-2127](<[b53ca49](https://github.com/pie-framework/pie-lib/commit/b53ca49af9347b659b89902ea70cee287deb0377)>)
- **charting:** enhance getClientPoint to check for mouse or touch events PD-3650 & PD-3651 + fix tests for grid-draggable ([fd1c700](https://github.com/pie-framework/pie-lib/commit/fd1c7005bb25f3190ea49d575830e50fa8aebe6f))

## [1.17.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.2...@pie-lib/pie-toolbox@1.17.3) (2024-05-07)

### Bug Fixes

- **math-rendering-accessible:** Specify parameters for element and render options when invoking the previous renderMath function PD-3731 ([6db4f58](https://github.com/pie-framework/pie-lib/commit/6db4f58d53949158bb5fbf3558d60c362d832b00))

## [1.17.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.1...@pie-lib/pie-toolbox@1.17.2) (2024-05-07)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.17.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.17.0...@pie-lib/pie-toolbox@1.17.1) (2024-05-03)

### Bug Fixes

- **drag:** add different style for categorize PD-3680 ([48c20e1](https://github.com/pie-framework/pie-lib/commit/48c20e1512e7fcbc8fd6ff044cd5c2b229d48bbf))
- **math-editor:** Change double prime notation from double-quote to two single-quotes in Geometry math editor PD-3539 ([be65a3a](https://github.com/pie-framework/pie-lib/commit/be65a3a570d22d023cb57089719e4c97a0ab03b2))
- **math-editor:** Correct font styling for prime notation, resolve issues with prime and double prime notations in the math editor, ensuring they render correctly during authoring and in the final display PD-3537, PD-3540 ([f2bfd18](https://github.com/pie-framework/pie-lib/commit/f2bfd1822359adc38005151af89b0862911ba642))
- **math-editor:** Ignore ESLint warnings for latex and write properties in doublePrimeArcSecond PD-3539, PD-3538 ([07c64d5](https://github.com/pie-framework/pie-lib/commit/07c64d504ce6613b2455ebf91899273c069dbe1c))

# [1.17.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.7...@pie-lib/pie-toolbox@1.17.0) (2024-05-01)

### Features

- testing builds ([5718bff](https://github.com/pie-framework/pie-lib/commit/5718bff2843cb899db222c3573f9531ee042df88))

## [1.16.7](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.6...@pie-lib/pie-toolbox@1.16.7) (2024-05-01)

### Bug Fixes

- testing builds ([0782b58](https://github.com/pie-framework/pie-lib/commit/0782b582d6682ea45d798dc51dbf7bf6fa989a90))

## [1.16.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.5...@pie-lib/pie-toolbox@1.16.6) (2024-05-01)

### Bug Fixes

- testing builds ([1ff0677](https://github.com/pie-framework/pie-lib/commit/1ff0677e0caca36ff720ef330bd24cb8367b5157))

## [1.16.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.4...@pie-lib/pie-toolbox@1.16.5) (2024-05-01)

### Bug Fixes

- testing builds ([58d500b](https://github.com/pie-framework/pie-lib/commit/58d500b2ea8273a4d0c055db19fd611a6ff9bf9c))

## [1.16.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.3...@pie-lib/pie-toolbox@1.16.4) (2024-04-29)

### Bug Fixes

- compare MathJax custom key PD-3683 ([a62e7cb](https://github.com/pie-framework/pie-lib/commit/a62e7cbcd64e54142c00304168cd0bcf1481d354))

## [1.16.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.2...@pie-lib/pie-toolbox@1.16.3) (2024-04-29)

### Bug Fixes

- **math-rendering-accessible:** Refactor package to initiate MathJax loading only if no instance from our legacy or accessibility packages is defined, and to exclusively apply placeholders before MathJax instantiation PD-3683 ([b99303c](https://github.com/pie-framework/pie-lib/commit/b99303c6f1f91841c9c6976851aec0b87e7008aa))

## [1.16.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.1...@pie-lib/pie-toolbox@1.16.2) (2024-04-23)

### Bug Fixes

- **math-rendering-accessible:** Add initialization for MathJax script when the legacy math-rendering method isn't detected and the @pie-lib/math-rendering-accessible script is not initialized PD-3644 ([23ba1e5](https://github.com/pie-framework/pie-lib/commit/23ba1e582eb92de8fe758a765811470ef18215cb))

## [1.16.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.16.0...@pie-lib/pie-toolbox@1.16.1) (2024-04-22)

### Bug Fixes

- **math-rendering-accessible:** Add initialization for MathJax script when the legacy math-rendering method isn't detected and the @pie-lib/math-rendering-accessible@1 window key property is empty PD-3644 ([a8f58c0](https://github.com/pie-framework/pie-lib/commit/a8f58c00391c1a9fffb666f16da9d71f518fe0e6))

# [1.16.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.15.1...@pie-lib/pie-toolbox@1.16.0) (2024-04-22)

### Features

- **inline-dropdown:** make the dropdown accessible PD-2449 ([dbfa49d](https://github.com/pie-framework/pie-lib/commit/dbfa49dae750ca688db8e0bdc8f84cc04e83f4f1))
- **inline-dropdown:** make the dropdown accessible wip PD-2449 ([d2dbd47](https://github.com/pie-framework/pie-lib/commit/d2dbd47a61672bdef7fd10f29e9455d6fa0a9b4a))
- **inline-dropdown:** make the dropdown accessible wip PD-2449 ([3c4124d](https://github.com/pie-framework/pie-lib/commit/3c4124d5e7fced7ade7a8e01afb37cd73b2c076a))

## [1.15.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.15.0...@pie-lib/pie-toolbox@1.15.1) (2024-04-22)

### Bug Fixes

- when used in mmlOutput, we don't have to wait to decide what math-rendering package we should instantiate, as we already have it instantiated at that point PD-3673 ([bb0e728](https://github.com/pie-framework/pie-lib/commit/bb0e728ef310aa828f6ad3153f2b1d88b19a0091))
- **math-rendering-accessible:** Add initialization for MathJax script when the legacy math-rendering method isn't detected and the @pie-lib/math-rendering-accessible@1 property is absent from the window object PD-3644 ([04e7b05](https://github.com/pie-framework/pie-lib/commit/04e7b057b519f9152a9a1c2c09cf2d59a9c013ef))

# [1.15.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.14.1...@pie-lib/pie-toolbox@1.15.0) (2024-04-18)

### Bug Fixes

- **config-ui/alert-dialog:** fixed font sizes to not be too small or client env PD-3655 ([48fcf97](https://github.com/pie-framework/pie-lib/commit/48fcf97f9fed1d6c0493628ff77e5a433be4382b))
- **render-ui/preview-prompt:** fix image alignment for multiple prompts on screen PD-3607 ([6dbadd3](https://github.com/pie-framework/pie-lib/commit/6dbadd34eabe6793a3dd943c643a7b566a9c0bdd))

### Features

- **charting, plot:** Charting Item Label Characters Limit SC-30682 ([0417234](https://github.com/pie-framework/pie-lib/commit/0417234677eff3fe7f458eb11f24d1731c23c5bd))

## [1.14.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.14.0...@pie-lib/pie-toolbox@1.14.1) (2024-04-08)

### Bug Fixes

- **graphing-solution-set:** Fixed CSS padding for buttons ([b008115](https://github.com/pie-framework/pie-lib/commit/b0081152c1c35e9d670a3fccd4b2e19a165fde21))

# [1.14.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.13.1...@pie-lib/pie-toolbox@1.14.0) (2024-04-08)

### Features

- **graphing-solution-set:** Modified HTML and CSS as per SC-30530 requirements. ([3697a7f](https://github.com/pie-framework/pie-lib/commit/3697a7fdcfea8f151dc1ec305faf4eb5bf4e014b))

## [1.13.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.13.0...@pie-lib/pie-toolbox@1.13.1) (2024-04-01)

### Bug Fixes

- **graphing:** Fixed issue when incomplete tool is hidden on changing current tool | SC-30392 ([cec6e5d](https://github.com/pie-framework/pie-lib/commit/cec6e5df37adc639e5e15f95889aefd11f3b5171))

# [1.13.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.12.3...@pie-lib/pie-toolbox@1.13.0) (2024-04-01)

### Features

- **inline-dropdown:** Implement screen reader-specific labels for inline dropdowns PD-2465 ([1fd0941](https://github.com/pie-framework/pie-lib/commit/1fd0941dca8ccaf0f487ad279aa42632d24593ad))

## [1.12.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.12.2...@pie-lib/pie-toolbox@1.12.3) (2024-03-29)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.12.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.12.1...@pie-lib/pie-toolbox@1.12.2) (2024-03-28)

### Bug Fixes

- **math-input:** do not return grade 8 set for mode language PD-3603 ([cc5ed83](https://github.com/pie-framework/pie-lib/commit/cc5ed83d520ae658dcd6077c9556b00016fe2cd3))

## [1.12.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.12.0...@pie-lib/pie-toolbox@1.12.1) (2024-03-25)

### Bug Fixes

- **math-rendering-accessible:** If MathJax is set up using the Pie Lib package for math rendering then use it PD-1870 ([759f076](https://github.com/pie-framework/pie-lib/commit/759f0767b465f7404ba44f33541a5560dfefd338))

# [1.12.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.11.1...@pie-lib/pie-toolbox@1.12.0) (2024-03-21)

### Bug Fixes

- **math-rendering-accessible:** add function to clean up excess mjx-container elements PD-3564 ([d14f6af](https://github.com/pie-framework/pie-lib/commit/d14f6af5a0ebe80c5ff8251208678ba0d409f785))
- **math-rendering-accessible:** add sanity checks PD-1870 ([c62b188](https://github.com/pie-framework/pie-lib/commit/c62b188ffe4d954fdcf90360ba5ff8a39c9c602f))

### Features

- Replace math-rendering package with math-rendering-accessible-package for accessibility PD-1870 ([5cd58d1](https://github.com/pie-framework/pie-lib/commit/5cd58d1f9252826b5dbcac3df354da21d9fd80e2))

## [1.11.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.11.0...@pie-lib/pie-toolbox@1.11.1) (2024-03-20)

### Bug Fixes

- **graphing-utils:** Fixed missing imports in graphing-utils.js ([36b511d](https://github.com/pie-framework/pie-lib/commit/36b511d555c176ec119605fc9d9fe926bc6a31d2))

# [1.11.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.10.1...@pie-lib/pie-toolbox@1.11.0) (2024-03-20)

### Bug Fixes

- **graphing-solution-set:** Fixed issue while switching no of lines ([d2dfd59](https://github.com/pie-framework/pie-lib/commit/d2dfd59589746a9d03f1547618a1979d4378619d))

### Features

- Add editable html configuration for rubric PD-3529 ([d96fba6](https://github.com/pie-framework/pie-lib/commit/d96fba6e5db7c5ad948c7b86a541aaf8e1443dcf))

## [1.10.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.10.0...@pie-lib/pie-toolbox@1.10.1) (2024-03-19)

### Bug Fixes

- temporary revert math-rendering-accessible updates ([e9e6fc1](https://github.com/pie-framework/pie-lib/commit/e9e6fc1341b96475a54303a53ebc355765bf4980))
- **graphing-solution-set:** Fixed issue with switching line type ([20daceb](https://github.com/pie-framework/pie-lib/commit/20daceb7b974cf1a7918cc725e32943d061ed05e))

# [1.10.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.9.0...@pie-lib/pie-toolbox@1.10.0) (2024-03-18)

### Features

- Replace math-rendering package with math-rendering-accessible-package for accessibility PD-1870 ([c157418](https://github.com/pie-framework/pie-lib/commit/c157418720bde12062d3bca21c502b48af01829e))

# [1.9.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.6...@pie-lib/pie-toolbox@1.9.0) (2024-03-15)

### Features

- **explicit-constructed-response:** add aria label for input items PD-2461 ([31972ea](https://github.com/pie-framework/pie-lib/commit/31972ea41dee7a8ba555a4bbeba7db7b971c66b4))
- **graphing-solution-set:** Added pie lib modules for GSS item | SC-27890 ([1b47294](https://github.com/pie-framework/pie-lib/commit/1b47294b0e142f0ba5f612aae6555a2f8b8b0e89))
- **graphing-solution-set:** Updated CSS for filled poygon ([876d5d0](https://github.com/pie-framework/pie-lib/commit/876d5d060fb74d9de694f92fb2ab6ebb095c4491))

## [1.8.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.5...@pie-lib/pie-toolbox@1.8.6) (2024-03-13)

### Bug Fixes

- **math-input:** fallback to grade set 8 if key is invalid PD-3549 ([adc9262](https://github.com/pie-framework/pie-lib/commit/adc9262ddc198daab8dce4e7a212c31ec3ce757c))

## [1.8.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.4...@pie-lib/pie-toolbox@1.8.5) (2024-03-13)

### Bug Fixes

- **math-rendering-accessible:** Exclude MathJax-processed elements from placeholder creation PD-1870 ([72ffc59](https://github.com/pie-framework/pie-lib/commit/72ffc5939101cdbe2eeaeca5035b6574c4629793))

## [1.8.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.3...@pie-lib/pie-toolbox@1.8.4) (2024-03-12)

### Bug Fixes

- remove usage of slate-dev-environment as the fix is not needed anymore and we're having versioning issues PD-3465 ([e956df0](https://github.com/pie-framework/pie-lib/commit/e956df074864b83000aa4bb913086ab536e73817))

## [1.8.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.2...@pie-lib/pie-toolbox@1.8.3) (2024-03-12)

### Bug Fixes

- **math-rendering-accessible:** enhanced math rendering logic to dynamically choose between '@pie-lib/math-rendering@2' and math-rendering-accessible if both are used PD-1870 ([5215bbe](https://github.com/pie-framework/pie-lib/commit/5215bbebbd53821c95120505f542b16c3e75f347))

## [1.8.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.1...@pie-lib/pie-toolbox@1.8.2) (2024-03-07)

### Bug Fixes

- **config-ui:** adjust the value with the new min and max props received PD-3509 ([3c00a7f](https://github.com/pie-framework/pie-lib/commit/3c00a7f01d48f3b8a85f3811805b72a146ff58d2))

## [1.8.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.8.0...@pie-lib/pie-toolbox@1.8.1) (2024-03-04)

### Bug Fixes

- remove console logs ([deb4d8e](https://github.com/pie-framework/pie-lib/commit/deb4d8e4d9d7f5edfddd9907e828a896441ec972))
- **charting:** change drag handle area into ellipse PD-3501 ([72e8163](https://github.com/pie-framework/pie-lib/commit/72e8163095f0d2005bfeb01de573a2c973aa4dce))

# [1.8.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.7.4...@pie-lib/pie-toolbox@1.8.0) (2024-02-29)

### Bug Fixes

- **math-rendering:** Prevent duplicate rendering by skipping math rendering if MathJax is already initialized through math-rendering-accessibility PD-1870 ([4c3b2cb](https://github.com/pie-framework/pie-lib/commit/4c3b2cbbe4c0f589f9ce020812442b00c62d7232))

### Features

- **math-rendering-accessible:** Accessible Math Rendering Compatible with Legacy System, if MathJax is instantiated by math-rendering, the math-rendering instance is used PD-1870 ([4ea605d](https://github.com/pie-framework/pie-lib/commit/4ea605d2603c09d202d32d52811f84eff9b77a5a))

## [1.7.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.7.3...@pie-lib/pie-toolbox@1.7.4) (2024-02-20)

### Bug Fixes

- made sure cancelling image upload is not blocking the editor [PD-3439](<[1f66e5a](https://github.com/pie-framework/pie-lib/commit/1f66e5a8173d701c6747c40ad00d5c55406bc13b)>)
- **charting:** enhanced readability of math input labels by enlarging font size and added padding to prevent overlap with tick marks PD-3385 ([d922c1d](https://github.com/pie-framework/pie-lib/commit/d922c1db28da041418debb2d84559e0f22075451))

## [1.7.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.7.2...@pie-lib/pie-toolbox@1.7.3) (2024-02-19)

### Bug Fixes

- update mathml-to-latex PD-3372 ([4675e59](https://github.com/pie-framework/pie-lib/commit/4675e5958b7bb231399c924c8df11be583647182))

## [1.7.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.7.1...@pie-lib/pie-toolbox@1.7.2) (2024-02-15)

### Bug Fixes

- **math-rendering:** add sanity check for Typeset function, remove certain options from the MathJax configuration because they were ineffective and were causing warnings about non-existence on the instance ([deac57d](https://github.com/pie-framework/pie-lib/commit/deac57dc22f0b3d08b72bacc15a7e5abfcfde3ad))
- **render-ui/preview-prompt:** fix image alignment not being set on first render PD-3455 ([d18453a](https://github.com/pie-framework/pie-lib/commit/d18453a45338503f9374d84f68a19226f2b484d5))

## [1.7.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.7.0...@pie-lib/pie-toolbox@1.7.1) (2024-02-13)

### Bug Fixes

- **math-rendering-accessible:** set same key as in math-rendering for testing purpose PD-1870 ([748f76d](https://github.com/pie-framework/pie-lib/commit/748f76d0c05e44a0fcb39e86113084badf956c7b))

# [1.7.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.6.0...@pie-lib/pie-toolbox@1.7.0) (2024-02-12)

### Bug Fixes

- Expose math-rendering-accessible and add it to pslb module as well (for print) ([ee3b625](https://github.com/pie-framework/pie-lib/commit/ee3b6256339c1fdb5a998d5959806f7acd0a4be2))

### Features

- add configuration for custom buttons on multiple choice PD-3395 ([0b88ab9](https://github.com/pie-framework/pie-lib/commit/0b88ab9e534934bf7905ce709ccd7f02c9287533))
- **math-rendering-accessible:** created new math rendering package in order to introduce accessibility features PD-3418 ([125c4b3](https://github.com/pie-framework/pie-lib/commit/125c4b3fc1cf7203fea27a00f87ff25fd515396a))
- **math-rendering-accessible:** created new math rendering package with accessibility features ([504171d](https://github.com/pie-framework/pie-lib/commit/504171dc4f3302b5ef11761e1e8a64585b6f596a))

# [1.6.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.8...@pie-lib/pie-toolbox@1.6.0) (2024-02-09)

### Features

- **config-ui:** Modified NumberTextFieldCustom to disable Inc/Dec buttons | SC-28868 ([8cb053e](https://github.com/pie-framework/pie-lib/commit/8cb053e578db8e5daae28adf7737699c3d6a82f5))

## [1.5.8](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.7...@pie-lib/pie-toolbox@1.5.8) (2024-02-07)

### Bug Fixes

- **prompt-preview:** fix text alignment for studio imported prompts PD-3423 ([094846b](https://github.com/pie-framework/pie-lib/commit/094846b39f9c34b68d15e6631b1439aabd87e358))

## [1.5.7](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.6...@pie-lib/pie-toolbox@1.5.7) (2024-01-24)

### Bug Fixes

- **config-ui:** fix classes undefined error in number text field PD-3404 ([1afcf14](https://github.com/pie-framework/pie-lib/commit/1afcf14afce79c748ad404642daa5d013411c6d6))
- **config-ui:** fix import PD-3404 ([c9d660e](https://github.com/pie-framework/pie-lib/commit/c9d660e503493fa8c1ee8e18dc3b8d8087123694))

## [1.5.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.5...@pie-lib/pie-toolbox@1.5.6) (2024-01-23)

### Bug Fixes

- **graphing:** resolve polygon closure issue on touch devices post PD-3392 implementation ([77f6b82](https://github.com/pie-framework/pie-lib/commit/77f6b82e3f148e407a340e7fde409dcec89faf76))
- **graphing:** resolve polygon closure issue post PD-3392 implementation ([55eec17](https://github.com/pie-framework/pie-lib/commit/55eec17f44fd605522e1f414a2615b7e9a7a76f4))

## [1.5.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.4...@pie-lib/pie-toolbox@1.5.5) (2024-01-23)

### Bug Fixes

- **graphing:** disable click on background shapes in label model PD-3392 ([7bd8e1b](https://github.com/pie-framework/pie-lib/commit/7bd8e1b8e4f5ec8d17933b9c7e23358731cda5cb))

## [1.5.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.3...@pie-lib/pie-toolbox@1.5.4) (2024-01-22)

### Bug Fixes

- **graphing:** made background shapes clickable PD-3392 ([f7c988a](https://github.com/pie-framework/pie-lib/commit/f7c988ad3ccc0d3ffe018ca69fdca0c9ad8540de))

## [1.5.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.2...@pie-lib/pie-toolbox@1.5.3) (2024-01-22)

### Bug Fixes

- **charting:** add transparent circle handle for improved drag functionality on touch devices PD-3387 ([96e5063](https://github.com/pie-framework/pie-lib/commit/96e5063f2b6d2ada3a842e37cde3063875f6b593))
- **charting:** added larger transparent circle for drag handle in line dot chart to enhance touch device usability and accessibility PD-3383 ([e0c63f1](https://github.com/pie-framework/pie-lib/commit/e0c63f107b9462582a3343d50c03f08ba8d317ab))
- **graphing:** Remove fontSize dependency from coordinate calculations PD-3384 ([3b918d8](https://github.com/pie-framework/pie-lib/commit/3b918d804cdef621bbe0b1012402dd3eeb8a171a))

## [1.5.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.5.1...@pie-lib/pie-toolbox@1.5.2) (2024-01-15)

### Bug Fixes

- **charting:** enable Category Drag Handle icon on iPad PD-3366 ([dceb727](https://github.com/pie-framework/pie-lib/commit/dceb727c8a3cd7562b875731359d3522309e2e1a))
- **charting:** Fix positioning for math-containing labels with fixed positioning addressing a layout issue on various devices, including iPads PD-3367 ([b4da76b](https://github.com/pie-framework/pie-lib/commit/b4da76b1c317a6e31ba7ddac9a08dd0c1eb60385))
- **charting:** handle touch events for plot chart PD-3366 ([5ba709d](https://github.com/pie-framework/pie-lib/commit/5ba709d1c7ddcb7d4ae41db03deaad836621951f))
- **editable-html:** make sure that image dimensions prop update after setting client config PD-3381 ([4f31bc4](https://github.com/pie-framework/pie-lib/commit/4f31bc41024de82090a52f440ce64d76d0028baa))

## [1.5.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.8...@pie-lib/pie-toolbox@1.5.1) (2024-01-11)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.4.8](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.7...@pie-lib/pie-toolbox@1.4.8) (2024-01-08)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.4.7](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.6...@pie-lib/pie-toolbox@1.4.7) (2024-01-08)

### Bug Fixes

- **math-input:** prevent newLine insertion on Enter in math editor PD-3296 ([46e44e0](https://github.com/pie-framework/pie-lib/commit/46e44e0ed24597cb8a5a18924afa4b4347e348c7))

## [1.4.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.5...@pie-lib/pie-toolbox@1.4.6) (2024-01-08)

### Bug Fixes

- **rubric:** update maxPoints value model when changed PD-3348 ([1496cb3](https://github.com/pie-framework/pie-lib/commit/1496cb3e3f87f1c7870fa74696313748a784231f))

## [1.4.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.4...@pie-lib/pie-toolbox@1.4.5) (2024-01-04)

### Bug Fixes

- **drag:** Implement zoom level detection and touch coordinate adjustments for drag preview in OT PD-3352 ([4635c18](https://github.com/pie-framework/pie-lib/commit/4635c1840844ac1373679e6413f7c7b3c8698a8d))

## [1.4.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.3...@pie-lib/pie-toolbox@1.4.4) (2024-01-04)

### Bug Fixes

- **graphing:** treat corner cases for max and min points PD-3037 ([a675989](https://github.com/pie-framework/pie-lib/commit/a675989c04133a202ec52dde50fca9b0409928da))

## [1.4.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.2...@pie-lib/pie-toolbox@1.4.3) (2024-01-02)

### Bug Fixes

- **charting:** use default color for non-editable category labels PD-2068 ([f26ac8b](https://github.com/pie-framework/pie-lib/commit/f26ac8b7ad216d4f763feb6bfee3923e92e81c6d))
- **render-ui:** use black text for even table rows PD-2060 ([f557810](https://github.com/pie-framework/pie-lib/commit/f557810e373b93e73fd17c0d4708cbdff6dbc57c))

## [1.4.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.1...@pie-lib/pie-toolbox@1.4.2) (2024-01-02)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.4.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.4.0...@pie-lib/pie-toolbox@1.4.1) (2023-12-19)

### Bug Fixes

- **charting:** adjust color contrast and pixel gridlines position PD-2068 ([01e3b5c](https://github.com/pie-framework/pie-lib/commit/01e3b5c1a2edacc20811a9102b4bccdb0c756a76))

# [1.4.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.3.0...@pie-lib/pie-toolbox@1.4.0) (2023-12-19)

### Bug Fixes

- **rubric:** add new rubric typr to enum PD-2555 ([8511cb6](https://github.com/pie-framework/pie-lib/commit/8511cb6aa6dcdc49c4cb3b568e91e1cb8c99350c))

### Features

- **complex-rubric:** solve conflicts PD-2555 ([70e74fb](https://github.com/pie-framework/pie-lib/commit/70e74fb2b53bfa3902c96e9613b0909c33f92e45))
- **rubric:** adjust logic for rubricless, new type of rubric PD-2555 ([8d106d3](https://github.com/pie-framework/pie-lib/commit/8d106d3f0fe4442a8078765e8a0c61b0919106f7))
- **rubric:** solve conflicts PD-2555 ([7bdf6de](https://github.com/pie-framework/pie-lib/commit/7bdf6dec06fa85ec8bc4c32908078c7a80ec3788))
- **rubric:** update snapshots PD-2555 ([daf65e8](https://github.com/pie-framework/pie-lib/commit/daf65e8efb014193f789dc31a39426a1c6ff37c6))

# [1.3.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.2.4...@pie-lib/pie-toolbox@1.3.0) (2023-12-18)

### Bug Fixes

- **charting:** ensure visibility of SVG drag icon PD-3271 ([66131cf](https://github.com/pie-framework/pie-lib/commit/66131cfa9cd8b5c48f87943951496b6729dfd430))
- **text-select:** always display token text in black and update design PD-2067 ([3164383](https://github.com/pie-framework/pie-lib/commit/31643832f9dd46f726d0c0249c90f8ca8727c4b5))

### Features

- **rubric:** change max points logic PD-3307 ([094dbc3](https://github.com/pie-framework/pie-lib/commit/094dbc367b168a41ffca96a162715ab2911dc64d))

## [1.2.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.2.3...@pie-lib/pie-toolbox@1.2.4) (2023-12-11)

### Bug Fixes

- export named components, instead of defaults, for pslb; keeping defaults to assure backwards compatibility ([17a01e1](https://github.com/pie-framework/pie-lib/commit/17a01e17aa4a6eaa3410486f9cd016c5b330c61c))

## [1.2.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.2.2...@pie-lib/pie-toolbox@1.2.3) (2023-12-08)

### Bug Fixes

- last try with circle ci ([51aff13](https://github.com/pie-framework/pie-lib/commit/51aff13903de5d0ebe7af07e7115305f075f5932))

## [1.2.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.2.1...@pie-lib/pie-toolbox@1.2.2) (2023-12-08)

### Bug Fixes

- trigger build ([8698df1](https://github.com/pie-framework/pie-lib/commit/8698df1652614f593157444d030cbecc5bf6f94a))

## [1.2.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.2.0...@pie-lib/pie-toolbox@1.2.1) (2023-12-05)

**Note:** Version bump only for package @pie-lib/pie-toolbox

# [1.2.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.1.2...@pie-lib/pie-toolbox@1.2.0) (2023-12-04)

### Features

- **rubric:** add validations controller and ui PD-3260 ([65197e0](https://github.com/pie-framework/pie-lib/commit/65197e0a50df37bb05866b0a1eaa13100cf42fb6))

## [1.1.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.1.1...@pie-lib/pie-toolbox@1.1.2) (2023-12-04)

### Bug Fixes

- **translator:** update message according to requirement PD-2996 ([8ff181a](https://github.com/pie-framework/pie-lib/commit/8ff181a17a308b6acbb868ec349069b397c4663a))

## [1.1.1](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.1.0...@pie-lib/pie-toolbox@1.1.1) (2023-11-27)

### Bug Fixes

- prevent breaking change (caused by the revert 326b55b6ebd83f3d3ee9bdd09a2b172365131fe3) ([aa0d776](https://github.com/pie-framework/pie-lib/commit/aa0d77604f17e8c055e9915543491f5a0eb9e6fd))

# [1.1.0](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.19...@pie-lib/pie-toolbox@1.1.0) (2023-11-27)

### Features

- **translator:** add new messages for categorize PD-2996 ([49151fc](https://github.com/pie-framework/pie-lib/commit/49151fc3cf3a2b677127709c0d568c89950c0d21))

## [1.0.19](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.18...@pie-lib/pie-toolbox@1.0.19) (2023-11-27)

### Bug Fixes

- **graphing:** compute markLabel coordinates based on parent PD-3265 ([a9237b5](https://github.com/pie-framework/pie-lib/commit/a9237b57f1e26b3ff5635baa79a100a80f2c664c))

## [1.0.18](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.17...@pie-lib/pie-toolbox@1.0.18) (2023-11-23)

### Bug Fixes

- **charting:** add PropTypes PD-3130 ([432ed72](https://github.com/pie-framework/pie-lib/commit/432ed7243b3d2f9dc64d3a92dce9e0d1b92d696e))
- **charting:** Refactor autoFocus handling for category addition PD-3130 ([a11e895](https://github.com/pie-framework/pie-lib/commit/a11e8955ee6436df33b6eeaed9f4d525fa882153))

## [1.0.17](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.16...@pie-lib/pie-toolbox@1.0.17) (2023-11-23)

### Bug Fixes

- re-added mathML conversion ability PD-3011 ([e10b542](https://github.com/pie-framework/pie-lib/commit/e10b54206db7058cb0a1e28cc8e877e61c005471))

## [1.0.16](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.15...@pie-lib/pie-toolbox@1.0.16) (2023-11-23)

### Bug Fixes

- **charting:** Fix: Update SVG style attribute to JSX format ([0a38eda](https://github.com/pie-framework/pie-lib/commit/0a38eda8658348e3199ea2ffbd33be7267ab2fd2))

## [1.0.15](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.14...@pie-lib/pie-toolbox@1.0.15) (2023-11-21)

### Bug Fixes

- **charting:** Fix SVG visibility by overriding global overflow rule in pie-components PD-3271 ([0c26a23](https://github.com/pie-framework/pie-lib/commit/0c26a23e7ac38c03e811c8f5d79a837ff5aa0de5))

## [1.0.14](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.13...@pie-lib/pie-toolbox@1.0.14) (2023-11-21)

### Bug Fixes

- **editable-html:** update plugins on image dimensions prop update PD-3261 ([da5240f](https://github.com/pie-framework/pie-lib/commit/da5240f0f14b5ecc9302889bfff6e77a8b4b1b0c))

## [1.0.13](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.12...@pie-lib/pie-toolbox@1.0.13) (2023-11-21)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.0.12](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.11...@pie-lib/pie-toolbox@1.0.12) (2023-11-14)

### Bug Fixes

- try to fix builds ([3b2adbf](https://github.com/pie-framework/pie-lib/commit/3b2adbf10306552138ce950c0e8a340e75eb9638))
- try to fix builds ([bf9f8e5](https://github.com/pie-framework/pie-lib/commit/bf9f8e56189e58ac886b661ff9d2536b3b6cc224))
- try to fix builds ([31eeda5](https://github.com/pie-framework/pie-lib/commit/31eeda5c8e47d1a0019bf8f4f9b15a35b0f0e94e))

## [1.0.11](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.10...@pie-lib/pie-toolbox@1.0.11) (2023-11-14)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.0.10](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.9...@pie-lib/pie-toolbox@1.0.10) (2023-11-13)

### Bug Fixes

- **icons:** add image-konva.jsx pd-597 ([254bf24](https://github.com/pie-framework/pie-lib/commit/254bf247367de54c45d8b7b092b07d6b7cdc502d))
- **icons:** add new icon(image) for react-konva pd-597 ([7e603de](https://github.com/pie-framework/pie-lib/commit/7e603de96defb439db408345edf29b385eee904a))
- **icons:** downgrade konva version to avoid versions mismatching pd-597 ([62f8fd1](https://github.com/pie-framework/pie-lib/commit/62f8fd1918414772295dbd3866441c9b8276864f))

## [1.0.9](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.8...@pie-lib/pie-toolbox@1.0.9) (2023-11-09)

### Bug Fixes

- **editable-html:** Add preview dialog for HTML edits and improve exit workflow PD-2765 ([ea85f95](https://github.com/pie-framework/pie-lib/commit/ea85f952a004e4e750da30e1bde9ca4a979d2856))

## [1.0.8](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.7...@pie-lib/pie-toolbox@1.0.8) (2023-11-06)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.0.7](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.6...@pie-lib/pie-toolbox@1.0.7) (2023-11-06)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.0.6](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.5...@pie-lib/pie-toolbox@1.0.6) (2023-11-06)

**Note:** Version bump only for package @pie-lib/pie-toolbox

## [1.0.5](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.4...@pie-lib/pie-toolbox@1.0.5) (2023-11-03)

### Bug Fixes

- keep math-rendering instance key harcoded ([8b13d79](https://github.com/pie-framework/pie-lib/commit/8b13d79bfe5ec6a0e09d2f879570ff6fa0abeff5))

## [1.0.4](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.3...@pie-lib/pie-toolbox@1.0.4) (2023-11-01)

### Bug Fixes

- add some workaround on math rendering instances key, still wip ([b900426](https://github.com/pie-framework/pie-lib/commit/b90042657efd809ce0220b12f3c4f776ec5bce31))

## [1.0.3](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.2...@pie-lib/pie-toolbox@1.0.3) (2023-11-01)

### Bug Fixes

- name math rendering instance as exected ([e9255be](https://github.com/pie-framework/pie-lib/commit/e9255be80195d5e02d1894e1f01df6a4f019568f))

## [1.0.2](https://github.com/pie-framework/pie-lib/compare/@pie-lib/pie-toolbox@1.0.1...@pie-lib/pie-toolbox@1.0.2) (2023-10-30)

### Bug Fixes

- export necessary values ([e5e03fd](https://github.com/pie-framework/pie-lib/commit/e5e03fd3975623a7fdd5c0b9b4c88ae4b0b118d6))

## 1.0.1 (2023-10-25)

**Note:** Version bump only for package @pie-lib/pie-toolbox
