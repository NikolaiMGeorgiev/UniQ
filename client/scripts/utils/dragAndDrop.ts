let draggedElem: Element | null

export const onDrop = (event: Event) => {
    event.preventDefault()
    const target = (event.target as HTMLElement).closest('[draggable]')

    if (!draggedElem || !target) {
        return
    }

    const temp = new Text('')
    target?.before(temp)
    draggedElem.replaceWith(target)
    temp.replaceWith(draggedElem)
}

export const onDrag = (event: Event) => {
    draggedElem = (event.target as HTMLElement).closest('[draggable]')
}

export const onDragOver = (event: Event) => event.preventDefault()
