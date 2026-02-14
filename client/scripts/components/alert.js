import createElement from "../utils/element.js";
export const displayAlert = ({ type, message }) => {
    const container = document.getElementById('main-container');
    const alert = createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${type}-alert` },
            { name: 'id', value: `${type}-alert` },
        ],
        properties: [{ name: 'innerHTML', value: message }],
    });
    container?.appendChild(alert);
};
export const displayErrorAlert = (args) => displayAlert({ type: 'error', ...args });
