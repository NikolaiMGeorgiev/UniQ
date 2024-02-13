import createElement from '../utils/element.js';
const getStudentStatus = (status) => {
    switch (status) {
        case 'active':
            return 'In room';
        case 'inactive':
            return 'Inactive';
        case 'finished':
            return 'Finished exam';
        case 'in-exam':
            return 'Taking exam';
        default:
            return '';
    }
};
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
                value: `${classPrefix}-status ${classPrefix}-status--${student.status}`,
            },
        ],
        properties: [{ name: 'innerHTML', value: getStudentStatus(student.status) }],
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
    const timeElement = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-faculty-number` },
            { name: 'id', value: `facultyNumber-${student.approximateTimeUntilExam}` },
        ],
        properties: [{ name: 'innerHTML', value: ` Time until turn: ${student.approximateTimeUntilExam}` }],
    };
    return [
        headerElement,
        fnElement,
        timeElement
    ];
};
export const createStudentContainer = (student, classPrefix, buttons) => {
    const infoContainerElements = createInfoContainerElements(student, classPrefix);
    const buttonsContainer = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-buttons-container` },
            { name: 'id', value: `buttons-container-${student.id}` },
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
