import { createRoom, fetchRoom, fetchStudents, updateRoom } from './resources/api.js'
import { mapToCreateRoom } from './resources/mappers.js'
import { Room, Student } from './resources/types.js'
import { onDrag, onDragOver, onDrop } from './utils/dragAndDrop.js'
import createElement, { ElementDataType } from './utils/element.js'
import { clearError, prepareFormData } from './utils/form.js'
import { getRoomIdFromURL } from './utils/getRoomIdFromURL.js'
import { getSelectedOptions } from './utils/getSelectedStudentIds.js'
import { redirect } from './utils/redirect.js'
import { isFormElement, isInputElement } from './utils/typecheck.js'
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user.js'
import { validate, validator } from './utils/validation.js'

// const socket = createSocket()

const schema = {
    name: validator()
        .string()
        .required('Name is a required field')
        .typeError('Please input a correct name'),
    description: validator()
        .string()
        .required('Description is a required field')
        .typeError('Please input a description'),
    startTime: validator()
        .string()
        .required('Please input start time')
        .typeError('Please input start time'),
    type: validator().boolean().required('Room type is a required field'),
    students: validator()
        .multiselect()
        .required('Room type is a required field'),
}

const clearErrorsOnChange = () => {
    document
        .getElementById('name')
        ?.addEventListener('change', () => clearError('name'))
    document
        .getElementById('description')
        ?.addEventListener('change', () => clearError('description'))
    document
        .getElementById('startTime')
        ?.addEventListener('change', () => clearError('startTime'))
    document
        .getElementById('queue')
        ?.addEventListener('change', () => clearError('type-wrapper'))
    document
        .getElementById('schedule')
        ?.addEventListener('change', () => clearError('type-wrapper'))
    document
        .getElementById('students')
        ?.addEventListener('change', () => clearError('students'))
    removeStudentsMultiselectError()
}

const removeStudentsMultiselectError = () => {
    const observer = new MutationObserver(() => clearError('students'))

    const studentsContainer = document.getElementsByName('students')[0]

    studentsContainer?.childNodes.forEach((child) => {
        observer.observe(child, {
            attributes: true,
            attributeFilter: ['class'],
        })
    })
}

const onStudentAddOrRemove = (event: Event) => {
    if (!event.target) return
    const button = event.target as Element

    if (button.innerHTML === 'Remove') {
        button.setAttribute('class', 'student-add-button')
        button.innerHTML = 'Add'
        if (button.parentElement) {
            button.parentElement.setAttribute(
                'class',
                'students-options-not-included'
            )
            button.parentElement.setAttribute('name', 'not-included')
        }
    } else {
        button.setAttribute('class', 'student-remove-button')
        button.innerHTML = 'Remove'
        if (button.parentElement) {
            button.parentElement.setAttribute(
                'class',
                'students-options-included'
            )
            button.parentElement.setAttribute('name', 'included')
        }
    }
}

const onSubmit = async (event: Event) => {
    event.preventDefault()
    const addEditForm = document.getElementById('add-edit-form')

    if (!addEditForm || !isFormElement(addEditForm)) {
        return
    }

    if (!validate(schema)) {
        event.preventDefault()
        return
    }

    const formData = new FormData(addEditForm)
    const roomId = getRoomIdFromURL()
    const roomData = mapToCreateRoom(formData, getSelectedOptions(), roomId)

    //TODO separate edit and create
    // if (!roomId) {
    //     redirect({ path: 'rooms' })
    //     return
    // }

    try {
        //TODO separate edit and create
        // const result = await updateRoom(roomId, roomData)
        let studentSchedule: Array<string> = []
        document.querySelectorAll('[name="included"]').forEach((studentNode) => {
            const studetnId = studentNode.getAttribute('value')
            if (studetnId) {
                studentSchedule.push(studetnId)
            }
        });

        let roomFormData = new FormData(addEditForm)
        roomFormData.append("students", studentSchedule.join(','))
        const formData = prepareFormData(roomFormData)
        const result = await createRoom(formData)
        // socket.emit({ event: 'updateRoom', data: roomData })
        // redirect({ path: 'rooms' })
    } catch (err) {
        // TODO: handle error
    }
}

const onDiscard = () => {
    history.back()
}

const createStudentsSelectOptions = (
    students: Student[],
    preIncludedStudents?: string[]
) => {
    const isPreIncluded = (student: Student) =>
        preIncludedStudents?.includes(student.id)

    const createStudentNameElement = (student: Student): ElementDataType => ({
        tagName: 'span',
        properties: [
            {
                name: 'innerHTML',
                value: `${student.name} (${student.username})`,
            },
        ],
    })

    const createStudentRemoveButton = (student: Student): ElementDataType => ({
        tagName: 'button',
        attributes: [
            { name: 'id', value: `student-remove-button-${student.id}` },
            { name: 'class', value: 'student-remove-button' },
        ],
        properties: [
            { name: 'innerHTML', value: 'Remove' },
            { name: 'type', value: 'button' },
        ],
        eventListeners: [{ event: 'click', listener: onStudentAddOrRemove }],
    })

    const createStudentAddButton = (student: Student): ElementDataType => ({
        tagName: 'button',
        attributes: [
            { name: 'id', value: `student-add-button-${student.id}` },
            { name: 'class', value: 'student-add-button' },
        ],
        properties: [
            { name: 'innerHTML', value: 'Add' },
            { name: 'type', value: 'button' },
        ],
        eventListeners: [{ event: 'click', listener: onStudentAddOrRemove }],
    })

    return students.map((student) =>
        createElement({
            tagName: 'div',
            attributes: [
                { name: 'id', value: `student-${student.id}` },
                { name: 'draggable', value: 'true' },
                {
                    name: 'class',
                    value: `students-options students-options-${
                        isPreIncluded(student) ? 'included' : 'not-included'
                    }`,
                },
                { name: 'value', value: student.id },
                {
                    name: 'name',
                    value: isPreIncluded(student) ? 'included' : 'not-included',
                },
            ],
            eventListeners: [
                { event: 'drop', listener: onDrop },
                { event: 'dragover', listener: onDragOver },
                { event: 'drag', listener: onDrag },
            ],
            children: [
                createStudentNameElement(student),
                isPreIncluded(student)
                    ? createStudentRemoveButton(student)
                    : createStudentAddButton(student),
            ],
        })
    )
}

const fillInInitialFormValues = (roomData: Room) => {
    document.getElementById('name')?.setAttribute('value', roomData.name)
    document
        .getElementById('description')
        ?.setAttribute('value', roomData.description)

    const startTime = document.getElementById('startTime')
    if (startTime && isInputElement(startTime)) {
        startTime.value = roomData.startTime
    }

    document.getElementById(roomData.type)?.setAttribute('checked', 'true')
}

const loadData = async () => {
    const roomId = getRoomIdFromURL()

    try {
        const studentsData = await fetchStudents()
        if (!studentsData.success) {
            // TODO: handle error
            return
        }

        if (!studentsData.data) {
            return redirect({ path: 'rooms' })
        }

        const container = document.getElementById('select')
        const options = createStudentsSelectOptions(studentsData.data, [
            '12',
            '14',
        ])

        options.map((option) => container?.appendChild(option))
    } catch (err) {
        // TODO: handle error
    }

    if (!roomId) {
        return
    }

    try {
        const roomData = await fetchRoom(roomId)

        if (!roomData.success) {
            // TODO: handle error
            return
        }

        if (!roomData.data || !roomData.data) {
            return redirect({ path: 'rooms' })
        }

        if (
            isUserStudent() &&
            (
                roomData.data.status === 'closed' ||
                roomData.data.status === 'not-started'
            )
        ) {
            return redirect({ path: 'rooms' })
        }

        fillInInitialFormValues(roomData.data)
    } catch (err) {
        // TODO: handle error
    }
}

;(async () => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login'})
    }

    if (isUserStudent()) {
        return redirect({ path: 'rooms' })
    }

    document
        .getElementById('add-edit-form')
        ?.addEventListener('submit', onSubmit)
    document
        .getElementById('button-discard')
        ?.addEventListener('click', onDiscard)
    await loadData()
    clearErrorsOnChange()
})()
