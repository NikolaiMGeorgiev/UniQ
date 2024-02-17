import { displayErrorAlert } from './components/alert.js';
import { createExpandableRoomContainerElements } from './components/expandableRoomContainer.js';
import { createStudentContainer } from './components/studentContainer.js';
import { callNextStudent, fetchQueue, fetchRoom, fetchStudents, updateRoom } from './resources/api.js';
import { createSocket } from './resources/socket.js';
import createElement from './utils/element.js';
import { getRoomIdFromURL } from './utils/getRoomIdFromURL.js';
import { redirect } from './utils/redirect.js';
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user.js';
import { removeLoader } from './utils/utils.js';
let link = 'https://zoom.us/';
const getButtons = (roomData) => {
    const breakButton = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-break' },
            { name: 'id', value: 'button-break' },
        ],
        properties: [{ name: 'innerHTML', value: 'Break' }],
        eventListeners: [
            {
                event: 'click',
                listener: async () => {
                    const roomId = getRoomIdFromURL();
                    const response = await updateRoom(roomId, { ...roomData, status: 'break' });
                    if (!response.success) {
                        displayErrorAlert({ message: response.message });
                    }
                },
            },
        ],
    };
    const endButton = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'room-button-end' },
            { name: 'id', value: 'button-end' },
        ],
        properties: [{ name: 'innerHTML', value: 'End' }],
        eventListeners: [
            {
                event: 'click',
                listener: async () => {
                    const roomId = getRoomIdFromURL();
                    const response = await updateRoom(roomId, { ...roomData, status: 'closed' });
                    if (!response.success) {
                        displayErrorAlert({ message: response.message });
                    }
                },
            },
        ],
    };
    return [breakButton, endButton];
};
const loadRoomData = async () => {
    const roomId = getRoomIdFromURL();
    if (!roomId) {
        return redirect({ path: 'rooms' });
    }
    try {
        const roomAndSheduleData = await fetchRoom(roomId);
        removeLoader('room-loader');
        if (!roomAndSheduleData.success) {
            displayErrorAlert({ message: 'Error fetching data. Please try again.' });
            return;
        }
        if (!roomAndSheduleData.data) {
            return redirect({ path: 'rooms' });
        }
        const roomData = roomAndSheduleData.data.roomData;
        if (isUserStudent() &&
            (roomData.status === 'closed' ||
                roomData.status === 'not-started')) {
            return redirect({ path: 'rooms' });
        }
        const roomInfoItem = document.getElementById('room-item');
        const [infoContainer, buttonsContainer] = createExpandableRoomContainerElements(roomData, 'room', true, isUserTeacher() ? getButtons(roomData) : []);
        const infoContainerElement = createElement(infoContainer);
        const buttonsContainerElement = createElement(buttonsContainer);
        roomInfoItem?.appendChild(infoContainerElement);
        roomInfoItem?.appendChild(buttonsContainerElement);
    }
    catch (err) {
        removeLoader('room-loader');
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
};
const loadAllStudents = async () => {
    const roomId = getRoomIdFromURL();
    try {
        const students = await fetchStudents();
        const roomSchedule = await fetchQueue(roomId);
        removeLoader('students-loader');
        if (!students.success) {
            displayErrorAlert({ message: 'Error fetching data. Please try again.' });
            return;
        }
        if (roomSchedule.success && students.success) {
            const studentsForRoom = roomSchedule.data?.schedule.map((elem) => ({
                ...elem,
                ...students.data.find((student) => student.id === elem.studentId)
            }));
            if (studentsForRoom) {
                studentsForRoom.map((student) => displayStudent(student));
            }
        }
        const socket = createSocket(roomId);
    }
    catch (err) {
        removeLoader('students-loader');
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
};
const getResourceButton = (resourceUrl) => {
    const button = {
        tagName: 'a',
        attributes: [
            { name: 'class', value: 'button-success' },
            { name: 'id', value: 'button-end' },
            { name: 'href', value: resourceUrl },
            { name: 'target', value: '_blank' },
        ],
        properties: [
            { name: 'innerHTML', value: 'Access resource' },
        ],
    };
    return createElement(button);
};
const displayStudent = (data, buttons) => {
    const roomsContainer = document.getElementById('room-container');
    const element = createStudentContainer(data, 'students', buttons);
    roomsContainer?.appendChild(element);
};
const loadSingleStudent = async () => {
    const roomId = getRoomIdFromURL();
    try {
        const students = await fetchStudents();
        const roomSchedule = await fetchQueue(roomId);
        removeLoader('students-loader');
        if (roomSchedule.success && students.success) {
            const id = localStorage.getItem("id");
            const schedule = roomSchedule.data?.schedule.find((elem) => elem.studentId === id);
            const studentAndSchedule = {
                ...schedule,
                ...students.data.find((student) => student.id === schedule?.studentId)
            };
            if (studentAndSchedule) {
                displayStudent(studentAndSchedule);
            }
        }
        const token = localStorage.getItem("accessToken");
        // Create socket after fetch request validation
        const socket = createSocket(roomId);
        socket.on('room status update', (roomStatus) => {
            const roomStatusElement = document.getElementById('room-status');
            if (roomStatusElement) {
                roomStatusElement.removeAttribute('class');
                roomStatusElement.setAttribute('class', `room-status--${roomStatus}`);
                roomStatusElement.innerText = roomStatus;
            }
        });
        socket.on('receive resource', (resource, userToken) => {
            if (token == userToken) {
                link = resource;
                const buttonsContainer = document.getElementById('buttons-container');
                const resourceButton = getResourceButton(resource);
                buttonsContainer?.appendChild(resourceButton);
            }
        });
    }
    catch (err) {
        removeLoader('students-loader');
        console.error(err);
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
};
const loadFooter = () => {
    const footer = document.getElementById('footer');
    if (!footer?.children.length) {
        const addRoomButton = createElement({
            tagName: 'button',
            attributes: [
                { name: 'id', value: 'button-call-next-student' },
                { name: 'class', value: 'button-primary' },
            ],
            properties: [
                { name: 'innerHTML', value: 'Call next student' },
            ],
            eventListeners: [
                {
                    event: 'click',
                    listener: async () => {
                        const roomId = getRoomIdFromURL();
                        const response = await callNextStudent(roomId, { link });
                        if ('error' in response) {
                            displayErrorAlert(response.error);
                        }
                    },
                }
            ]
        });
        footer?.appendChild(addRoomButton);
    }
};
(async () => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login' });
    }
    const roomId = getRoomIdFromURL();
    if (!roomId) {
        return redirect({ path: 'rooms' });
    }
    if (isUserTeacher()) {
        await loadAllStudents();
        loadFooter();
    }
    else {
        await loadSingleStudent();
    }
    await loadRoomData();
})();
