export type ElementDataType = {
    tagName: keyof HTMLElementTagNameMap
    attributes?: {
        name: string
        value: string
    }[]
    properties?: {
        name: 'innerHTML'
        value: string
    }[]
    style?: {
        name: string
        value: string
    }[]
    eventListeners?: {
        event: string,
        listener: EventListenerOrEventListenerObject
    }[]
    options?: {
        value: string
    }[]
    defaultOption?: string
    children?: ElementDataType[]
}
type CreateElementType = (data: ElementDataType) => HTMLElement

const createElement: CreateElementType = (data) => {
    const element = document.createElement(data.tagName);

    data.attributes?.forEach(attribute => {
        element.setAttribute(attribute.name, attribute.value);
    });

    data.properties?.forEach(property => {
        element[property.name] = property.value;
    });

    // data.style?.forEach(style => {
    //     element.style[style.name] = style.value; 
    // });

    if(data.eventListeners?.length) {
        setEventListeners(element, data.eventListeners);
    }

    if (data.options) {
        setElementOptions(element, data.options, data.defaultOption);
    }

    if (data.children) {
        data.children.forEach((child) => {
            const childElement = createElement(child)
            element.appendChild(childElement)
        })
    }

    return element;
}

type SetElementOptionsType = (
    element: HTMLElement,
    options: {
        value: string
    }[],
    defaultOption?: string
 ) => void

const setElementOptions: SetElementOptionsType = (element, options, defaultOption) => options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.value;

        if(defaultOption === option.value) {
            optionElement.selected = true;
        }

        element.appendChild(optionElement);
    });

type SetEventListenersType = (
    element: HTMLElement,
    listeners: {
        event: string,
        listener: EventListenerOrEventListenerObject
    }[]
) => void

const setEventListeners: SetEventListenersType = (element, listeners) =>
    listeners.forEach(listener => element.addEventListener(listener.event, listener.listener));

export default createElement;