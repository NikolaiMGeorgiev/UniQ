let draggedElem;
export const onDrop = (event) => {
    event.preventDefault();
    const target = event.target.closest('[draggable]');
    if (!draggedElem || !target) {
        return;
    }
    const temp = new Text('');
    target?.before(temp);
    draggedElem.replaceWith(target);
    temp.replaceWith(draggedElem);
};
export const onDrag = (event) => {
    draggedElem = event.target.closest('[draggable]');
};
export const onDragOver = (event) => event.preventDefault();
