import { displayErrorAlert } from './components/alert.js';
import { createRoom, fetchRoom, fetchStudents, updateRoom } from './resources/api.js';
import { mapFormDataToCreateRoom, mapFormDataToUpdateRoom } from './resources/mappers/roomMappers.js';
import { onDrag, onDragOver, onDrop } from './utils/dragAndDrop.js';
import createElement from './utils/element.js';
import { clearError } from './utils/form.js';
import { getRoomIdFromURL } from './utils/getRoomIdFromURL.js';
import { getSelectedOptions } from './utils/getSelectedStudentIds.js';
import { redirect } from './utils/redirect.js';
import { isFormElement, isInputElement } from './utils/typecheck.js';
import { isUserLoggedIn, isUserStudent } from './utils/user.js';
import { removeLoader } from './utils/utils.js';
import { validate, validator } from './utils/validation.js';
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
    duration: validator()
        .number()
        .min(1)
        .required('Please input duration')
        .typeError('Please input duration'),
    type: validator().boolean().required('Room type is a required field'),
    students: validator()
        .multiselect()
        .required('Room type is a required field'),
};
const clearErrorsOnChange = () => {
    document
        .getElementById('name')
        ?.addEventListener('change', () => clearError('name'));
    document
        .getElementById('description')
        ?.addEventListener('change', () => clearError('description'));
    document
        .getElementById('startTime')
        ?.addEventListener('change', () => clearError('startTime'));
    document
        .getElementById('duration')
        ?.addEventListener('change', () => clearError('duration'));
    document
        .getElementById('queue')
        ?.addEventListener('change', () => clearError('type-wrapper'));
    document
        .getElementById('schedule')
        ?.addEventListener('change', () => clearError('type-wrapper'));
    document
        .getElementById('students')
        ?.addEventListener('change', () => clearError('students'));
    removeStudentsMultiselectError();
};
const removeStudentsMultiselectError = () => {
    const observer = new MutationObserver(() => clearError('students'));
    const studentsContainer = document.getElementsByName('students')[0];
    studentsContainer?.childNodes.forEach((child) => {
        observer.observe(child, {
            attributes: true,
            attributeFilter: ['class'],
        });
    });
};
const onStudentAddOrRemove = (event) => {
    if (!event.target)
        return;
    const button = event.target;
    if (button.innerHTML === 'Remove') {
        button.setAttribute('class', 'student-add-button');
        button.innerHTML = 'Add';
        if (button.parentElement) {
            button.parentElement.setAttribute('class', 'students-options-not-included');
            button.parentElement.setAttribute('name', 'not-included');
        }
    }
    else {
        button.setAttribute('class', 'student-remove-button');
        button.innerHTML = 'Remove';
        if (button.parentElement) {
            button.parentElement.setAttribute('class', 'students-options-included');
            button.parentElement.setAttribute('name', 'included');
        }
    }
};
export const onSubmit = async (event) => {
    event.preventDefault();
    const addEditForm = document.getElementById('add-edit-form');
    if (!addEditForm || !isFormElement(addEditForm)) {
        return;
    }
    if (!validate(schema)) {
        event.preventDefault();
        return;
    }
    const formData = new FormData(addEditForm);
    const roomId = getRoomIdFromURL();
    try {
        if (!roomId) {
            const roomData = mapFormDataToCreateRoom(formData, getSelectedOptions(), roomId);
            const response = await createRoom(roomData);
            if (!response.success) {
                displayErrorAlert({ message: response.message });
                return;
            }
        }
        if (roomId) {
            const roomData = mapFormDataToUpdateRoom(formData, getSelectedOptions(), roomId);
            const response = await updateRoom(roomId, roomData);
            if (!response.success) {
                displayErrorAlert({ message: response.message });
                return;
            }
        }
        redirect({ path: 'rooms' });
    }
    catch (err) {
        displayErrorAlert({ message: 'Error updating data. Please try again.' });
    }
};
export const onDiscard = () => {
    history.back();
};
const createStudentsSelectOptions = (students, preIncludedStudents) => {
    const isPreIncluded = (student) => preIncludedStudents?.includes(student.id);
    const createStudentNameElement = (student) => ({
        tagName: 'span',
        properties: [
            {
                name: 'innerHTML',
                value: `${student.name} ${student.facultyNumber ? `(${student.facultyNumber})` : ''}`,
            },
        ],
    });
    const createStudentRemoveButton = (student) => ({
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
    });
    const createStudentAddButton = (student) => ({
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
    });
    return students.map((student) => createElement({
        tagName: 'div',
        attributes: [
            { name: 'id', value: `student-${student.id}` },
            { name: 'draggable', value: 'true' },
            {
                name: 'class',
                value: `students-options students-options-${isPreIncluded(student) ? 'included' : 'not-included'}`,
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
    }));
};
const fillInInitialFormValues = (roomSchedule) => {
    const roomData = roomSchedule.roomData;
    document.getElementById('name')?.setAttribute('value', roomData.name);
    document
        .getElementById('description')
        ?.setAttribute('value', roomData.description);
    document
        .getElementById('duration')
        ?.setAttribute('value', String(roomData.turnDuration ?? ''));
    const startTime = document.getElementById('startTime');
    if (startTime && isInputElement(startTime)) {
        startTime.value = roomData.startTime;
    }
    document.getElementById(roomData.type)?.setAttribute('checked', 'true');
};
const enableFieldsOnLoad = () => {
    document
        .getElementById('name')
        ?.removeAttribute('disabled');
    document
        .getElementById('description')
        ?.removeAttribute('disabled');
    document
        .getElementById('startTime')
        ?.removeAttribute('disabled');
    document
        .getElementById('duration')
        ?.removeAttribute('disabled');
    document
        .getElementById('schedule')
        ?.removeAttribute('disabled');
    document
        .getElementById('queue')
        ?.removeAttribute('disabled');
};
const addStudents = (studentData, preincludedStudentIds) => {
    const container = document.getElementById('select');
    const options = createStudentsSelectOptions(studentData, preincludedStudentIds);
    options.map((option) => container?.appendChild(option));
};
const loadData = async () => {
    const roomId = getRoomIdFromURL();
    let studentData = [];
    try {
        const studentsData = await fetchStudents();
        if (!studentsData.success) {
            displayErrorAlert({ message: 'Error fetching data. Please try again.' });
            return;
        }
        if (!studentsData.data) {
            return redirect({ path: 'rooms' });
        }
        studentData = studentsData.data;
    }
    catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
    if (!roomId) {
        addStudents(studentData, []);
        return;
    }
    try {
        const response = await fetchRoom(roomId);
        if (!response.success) {
            displayErrorAlert({ message: 'Error fetching data. Please try again.' });
            return;
        }
        if (!response.data || !response.data) {
            return redirect({ path: 'rooms' });
        }
        if (isUserStudent() &&
            (response.data.roomData.status === 'closed' ||
                response.data.roomData.status === 'not-started')) {
            return redirect({ path: 'rooms' });
        }
        addStudents(studentData, response.data.schedule.map((elem) => elem.studentId));
        fillInInitialFormValues(response.data);
    }
    catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
};
(async () => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login' });
    }
    if (isUserStudent()) {
        return redirect({ path: 'rooms' });
    }
    document
        .getElementById('add-edit-form')
        ?.addEventListener('submit', onSubmit);
    document
        .getElementById('button-discard')
        ?.addEventListener('click', onDiscard);
    await loadData();
    enableFieldsOnLoad();
    removeLoader('add-edit-loader');
    clearErrorsOnChange();
})();
