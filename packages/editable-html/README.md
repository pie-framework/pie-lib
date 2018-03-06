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
<EditableHTML 
    onChange={this.htmlChanged.bind(this)} 
    markup={markup} />
```

### TODOS: 

<!-- * [ ] math trash icon not removing -->
<!-- * [ ] math when calculator opens main toolbar is removed -->
<!-- * [ ] math when done (cos main toolbar is gone) cant click 'done' -->
<!-- * [ ] image when editor focused - show trash icon (also an outline?) -->

* [ ] adjust the keypad layout for math
* [ ] add image toolbar
* [ ] add basics back in
* [ ] math + image - delete node
* [ ] move fileInput to toolbar button
