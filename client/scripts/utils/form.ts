import createElement from './element.js'

type AddErrorType = (name: string, errorMessage: string) => void

type ClearErrorType = (inputId: string) => void

type PrepareFormData = (data: FormData) => string

export const addError: AddErrorType = (name, errorMessage) => {
    if (document.getElementById(`error-message-${name}`)?.childNodes.length) {
        return
    }

    const error = createElement({
        tagName: 'small',
        attributes: [
            { name: 'id', value: `error-message-${name}` },
            { name: 'class', value: 'error-message' },
        ],
        properties: [{ name: 'innerHTML', value: errorMessage }],
    })

    document.getElementById(`error-message-${name}`)?.appendChild(error)
}

export const clearError: ClearErrorType = (inputId) => {
    const errorElement = document.getElementById(`error-message-${inputId}`)

    if (!errorElement) return

    errorElement.innerHTML = ''
}

export const prepareFormData: PrepareFormData = (data: FormData) => {
    const fromDataJSON: { [key: string]: any } = {}
    data.forEach((value, key) => {
        fromDataJSON[key] = value;
    });
    return JSON.stringify(fromDataJSON)
}
