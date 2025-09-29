# plugins

## Custom toolbar

To create a custom toolbar you need to add the following methods to the toolbar object:

```typescript
type ChangeFn = (key:string, update : object) : void;

type Toolbar = {
  /**
   * return true if this plugin supports this node type
   */
  supports : (node: Slate.Node) : Boolean;
  /**
   * return a React component to edit the data within the node,
   * call toolbarDone to finish editing, call toolbarChange to update
   * the main editor without closing editing.
   */
  customToolbar: (node: Slate.Node, toolbarDone : ChangeFn, toolbarChange: ChangeFn),
  /**
   * Takes the output of the `customToolbar#toolbarDone` call
   * and passes in a value so that you can create a Slate.Change.
   */
  applyChange: (key: string, data: object, value: Slate.Value) : Slate.Change | undefined
}
```
