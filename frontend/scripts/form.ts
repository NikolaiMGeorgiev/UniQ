import createElement from './element.js';

type AddErrorType = (input: HTMLElement | null, errorMessage: string) => void

type ClearErrorType = (inputId: string) => void

export const addError: AddErrorType = (input, errorMessage) => {
    if (!input) {
        return
    }

    if (document.getElementById(`error-message-${input.id}`)) {
        return
    }

    const error = createElement({
        tagName: 'small',
        attributes: [
            {name: 'id', value: `error-message-${input.id}`},
            {name: 'class', value: 'error-message'}
        ],
        properties: [
            {name: 'innerHTML', value: errorMessage}
        ]
    })

    if (input.children.length) {
        input.appendChild(error)
    } else {
        input.parentNode?.appendChild(error)
    }
}

export const clearError: ClearErrorType = (inputId) => {
    const errorElement = document.getElementById(`error-message-${inputId}`)

    if (!errorElement) return

    errorElement.remove()
}