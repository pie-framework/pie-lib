```javascript
//pie api item collection
{
  id: '1',

  /**
   * config for rendering the player
   * (will also drive part of the authoring ui concerned w/ configuring player content)
   */
  player:  {
    elements: {
      'm-c': '@pie-element/multiple-choice@^1.0.0'
    },
    models: [
      {id: '1', element: 'm-c', choices: []}
    ],
    markup: '...'
  },
  stimuli: {

    // render stimulus to the left/item to the right
    layout: 'layouts/LEFT',

    // this means render both passage and video (layout for this?)
    references: [
      { id: 'p1', type: 'passage' },
      { id: 'v1', type: 'video' }
    ]
  }
}
```

```javascript
// stimuli collection

{
  id: 'p1',
  type: 'passage',
  content: '<img src="$cat"></img>',
  element: 'can be overridden',
  assets: [
    {name: 'cat', key: '/path/to/p1/cat.jpg'}
  ]
},

{
  id: 'v1', type: 'video', url: 'whale.mp4', key: '/path/to/v1/whale.mp4'
}
```

```javascript
// system-packages collection

/*
 * maintain a system wide pkg set for pie-api renderers.
 * allows us to control the versioning and no need to sweep the db every time there is a fix in place. allow it to be overridden for dev purposes.
 * on export use the system pkg.
 */

{type: 'passage', package: '@pie-api/passage@^1.0.0'},
{type: 'video', package: '@pie-api/video@^1.0.0'}
```
