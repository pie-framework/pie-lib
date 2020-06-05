# @pie-lib/render-ui

Some shared ui components for player rendering that are so small that they don't warrant their own package..

## install

```
npm install
```

## demo

```
cd demo
../node_modules/.bin/webpack-dev-server --hot --inline
```

go to http://localhost:8080

# colors

This package contains a color module that defines the css custom properties that all pie elements should use. It loosely follows the material design naming scheme with a few additions.

| name                   | description                                       | fallback            |
| ---------------------- | ------------------------------------------------- | ------------------- |
| `--pie-text`           | the color of the text                             | defaults.TEXT       |
| `--pie-primary`        | the primary fill color                            | defaults.PRIMARY    |
| `--pie-primary-text`   | the color of primary text                         | `--pie-text`        |
| `--pie-secondary`      | the secondary fill color                          | defaults.SECONDARY  |
| `--pie-secondary-text` | the color of secondary text                       | `--pie-text`        |
| `--pie-correct`        | the fill color for correct ui widgets             | defaults.CORRECT    |
| `--pie-incorrect`      | the fill color for incorrect ui widgets           | defaults.INCORRECT  |
| `--pie-disabled`       | the disabled color                                | defaults.DISABLED   |
| `--pie-background`     | the background color (note that this is optional) | defaults.BACKGROUND |
