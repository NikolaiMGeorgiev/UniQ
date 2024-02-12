import createElement from './element.js';
export const addError = (name, errorMessage) => {
    if (document.getElementById(`error-message-${name}`)?.childNodes.length) {
        return;
    }
    const error = createElement({
        tagName: 'small',
        attributes: [
            { name: 'id', value: `error-message-${name}` },
            { name: 'class', value: 'error-message' },
        ],
        properties: [{ name: 'innerHTML', value: errorMessage }],
    });
    document.getElementById(`error-message-${name}`)?.appendChild(error);
};
export const clearError = (inputId) => {
    const errorElement = document.getElementById(`error-message-${inputId}`);
    if (!errorElement)
        return;
    errorElement.innerHTML = '';
};
export const prepareFormData = (data) => {
    const fromDataJSON = {};
    data.forEach((value, key) => {
        fromDataJSON[key] = value;
    });
    return JSON.stringify(fromDataJSON);
};
