import createElement from '../utils/element.js';
const createInfoContainerElements = (student, classPrefix) => {
    const nameElementConfig = {
        tagName: 'span',
        attributes: [{ name: 'class', value: `${classPrefix}-title` }],
        properties: [{ name: 'innerHTML', value: student.name }],
    };
    const statusElementConfig = {
        tagName: 'span',
        attributes: [
            {
                name: 'class',
                value: `${classPrefix}-status ${classPrefix}-status--${student.finished ? 'finished' : 'not-finished'}`,
            },
        ],
        properties: [{ name: 'innerHTML', value: student.finished ? 'Finished' : 'Not finished' }],
    };
    const headerElement = {
        tagName: 'div',
        attributes: [{ name: 'class', value: `${classPrefix}-item-header` }],
        children: [nameElementConfig, statusElementConfig],
    };
    const fnElement = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-faculty-number` },
            { name: 'id', value: `facultyNumber-${student.id}` },
        ],
        properties: [{ name: 'innerHTML', value: `Faculty number: ${student.facultyNumber}` }],
    };
    const positionElement = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-faculty-number` },
            { name: 'id', value: `facultyNumber-${student.position}` },
        ],
        properties: [{ name: 'innerHTML', value: ` Position: ${student.position}` }],
    };
    return [
        headerElement,
        fnElement,
        positionElement
    ];
};
export const createStudentContainer = (student, classPrefix, buttons) => {
    const infoContainerElements = createInfoContainerElements(student, classPrefix);
    const buttonsContainer = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-buttons-container` },
            { name: 'id', value: `buttons-container` },
        ],
        children: buttons,
    };
    const infoContainer = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-info-container` },
            { name: 'id', value: `info-container-${student.id}` },
        ],
        children: infoContainerElements,
    };
    return createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-item` },
            { name: 'id', value: `item-${student.id}` },
        ],
        children: [infoContainer, buttonsContainer],
    });
};
