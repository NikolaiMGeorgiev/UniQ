const createElement = (data) => {
    const element = document.createElement(data.tagName);
    data.attributes?.forEach((attribute) => {
        element.setAttribute(attribute.name, attribute.value);
    });
    data.properties?.forEach((property) => {
        if (property.name === 'type') {
            ;
            element[property.name] = property.value;
        }
        else {
            element[property.name] = property.value;
        }
    });
    // data.style?.forEach(style => {
    //     element.style[style.name] = style.value;
    // });
    if (data.eventListeners?.length) {
        setEventListeners(element, data.eventListeners);
    }
    if (data.options) {
        setElementOptions(element, data.options, data.defaultOption);
    }
    if (data.children) {
        data.children.forEach((child) => {
            const childElement = createElement(child);
            element.appendChild(childElement);
        });
    }
    return element;
};
const setElementOptions = (element, options, defaultOption) => options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.value;
    if (defaultOption === option.value) {
        optionElement.selected = true;
    }
    element.appendChild(optionElement);
});
const setEventListeners = (element, listeners) => listeners.forEach((listener) => element.addEventListener(listener.event, listener.listener));
export default createElement;
