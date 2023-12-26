type ShowMessageType = (
    elementId: string,
    message: string
) => void

type ClearMessageType = (
    elementId: string,
) => void

export const showMessage: ShowMessageType = (elementId, message) => {
    const messageContainer = document.getElementById(elementId)

    if (messageContainer) {
        messageContainer.innerHTML = message
    }
}

export const clearMessage: ClearMessageType = (elementId: string) => showMessage(elementId, '')