import createElement from "../utils/element"

type DisplayAlertProps = {
    type: 'error' | 'warning' | 'success'
    message: string
}

export const displayAlert = ({ type, message }: DisplayAlertProps) => {
    const container = document.getElementById('main-container')
    const alert = createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${type}-alert` },
            { name: 'id', value: `${type}-alert` },
        ],
        properties: [{ name: 'innerHTML', value: message }],
    })

    container?.appendChild(alert)
}

export const displayErrorAlert = (args: Omit<DisplayAlertProps, 'type'>) =>
    displayAlert({ type: 'error', ...args })