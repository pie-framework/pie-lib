export const onRemoveResponse = (nodeProps, value) => {
    const val = nodeProps.editor.value;
    const change = val.change();
    const dragInTheBlank = val.document.findDescendant((n) => n.data && n.data.get('index') === value.index);
    change.setNodeByKey(dragInTheBlank.key, { data: { index: dragInTheBlank.data.get('index'), }, });
    nodeProps.editor.props.onChange(change, () => { nodeProps.editor.props.onEditingDone(); });
};

export const onValueChange = (nodeProps, n, value) => {
    const val = nodeProps.editor.value;
    const change = val.change();
    change.setNodeByKey(n.key, { data: { ...value, index: n.data.get('index'), }, });
    nodeProps.editor.props.onChange(change, () => { nodeProps.editor.props.onEditingDone(); });
};