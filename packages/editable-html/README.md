# editable-html

`editable-html` is an inline HTML editor, based on [`slate`](https://github.com/ianstormtaylor/slate), for use within PIE configuration panels.

> It's pretty rough at the moment (UI + logic), but can't spend too much time on it right now.

## Demo

```bash
npm install
cd demo
../node_modules/.bin/webpack-dev-server --hot --inline
# go to http://localhost:8080
```

## Usage

Install:

```bash
npm install --save @pie-lib/editable-html
```

Import:

```js
import EditableHTML from '@pie-lib/editable-html';
```

Declare:

```jsx
<EditableHTML onChange={this.htmlChanged.bind(this)} markup={markup} />
```

### In production

If you are running in production and have an external `React` and `ReactDOM`, you will also need to include `ReactDOMServer`.

```html
  <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
  <!-- this must be added -->
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom-server.browser.production.min.js"></script>
```
