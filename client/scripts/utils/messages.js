export const showMessage = (elementId, message) => {
    const messageContainer = document.getElementById(elementId);
    if (messageContainer) {
        messageContainer.innerHTML = message;
    }
};
export const clearMessage = (elementId) => showMessage(elementId, '');
