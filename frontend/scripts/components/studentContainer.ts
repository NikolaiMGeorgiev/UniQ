import { RoomStudent } from '../resources/types'
import createElement, { ElementDataType } from '../utils/element'

const getStudentStatus = (status: string) => {
    switch (status) {
        case 'active':
            return 'In room'
        case 'inactive':
            return 'Inactive'
        case 'finished':
            return 'Finished exam'
        case 'in-exam':
            return 'Taking exam'
        default:
            return ''
    }
}

const createInfoContainerElements = (
    student: RoomStudent,
    classPrefix: string,
) => {
    const nameElementConfig: ElementDataType = {
        tagName: 'span',
        attributes: [{ name: 'class', value: `${classPrefix}-title` }],
        properties: [{ name: 'innerHTML', value: student.name }],
    }

    const statusElementConfig: ElementDataType = {
        tagName: 'span',
        attributes: [
            {
                name: 'class',
                value: `${classPrefix}-status--${student.status}`,
            },
        ],
        properties: [{ name: 'innerHTML', value: getStudentStatus(student.status) }],
    }

    const headerElement: ElementDataType = {
        tagName: 'div',
        attributes: [{ name: 'class', value: `${classPrefix}-item-header` }],
        children: [nameElementConfig, statusElementConfig],
    }

    const fnElement: ElementDataType = {
        tagName: 'span',
        attributes: [
            { name: 'class', value: `${classPrefix}-faculty-number` },
            { name: 'id', value: `facultyNumber-${student.id}` },
        ],
        properties: [{ name: 'innerHTML', value: `Faculty number: ${student.fn}` }],
    }


    return [
        headerElement,
        fnElement
    ]
}

export const createStudentContainer = (
    student: RoomStudent,
    classPrefix: string,
    buttons?: ElementDataType[]
) => {
    const infoContainerElements = createInfoContainerElements(
        student,
        classPrefix,
    )

    const buttonsContainer: ElementDataType = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-buttons-container` },
            { name: 'id', value: `buttons-container-${student.id}` },
        ],
        children: buttons,
    }

    const infoContainer: ElementDataType = {
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-info-container` },
            { name: 'id', value: `info-container-${student.id}` },
        ],
        children: infoContainerElements,
    }

    return createElement({
        tagName: 'div',
        attributes: [
            { name: 'class', value: `${classPrefix}-item` },
            { name: 'id', value: `item-${student.id}` },
        ],
        children: [infoContainer, buttonsContainer],
    })
}
