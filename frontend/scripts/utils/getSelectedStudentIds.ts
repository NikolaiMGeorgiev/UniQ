export const getSelectedOptions = () => {
    const container = document.getElementById('select')
    let optionIds: string[] = []

    if (!container) return []

    container.childNodes.forEach((child) => {
        const childElement = (child as Element)
        if (!childElement.attributes) return

        const includedValue = childElement.attributes.getNamedItem('name')?.value
        if (includedValue === 'not-included') return

        const id = childElement.attributes.getNamedItem('value')?.value

        if (id) {
            optionIds = [...optionIds, id]
        }
    })
    
    return optionIds ?? []
}
