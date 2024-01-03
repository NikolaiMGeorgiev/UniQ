export const isInputElement = (el: HTMLElement): el is HTMLInputElement =>
    'value' in el

export const isFormElement = (el: HTMLElement): el is HTMLFormElement =>
    'elements' in el
