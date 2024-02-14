import { displayErrorAlert } from './components/alert.js';
import { createExpandableRoomContainer } from './components/expandableRoomContainer.js';
import { createStudentContainer } from './components/studentContainer.js';
import { callNextStudent, fetchRoom, fetchStudents, updateRoom } from './resources/api.js';
import { createSocket } from './resources/socket.js';
import createElement from './utils/element.js';
import { getRoomIdFromURL } from './utils/getRoomIdFromURL.js';
import { redirect } from './utils/redirect.js';
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user.js';
let link = 'www.google.bg';
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
                    if ('error' in response) {
                        displayErrorAlert(response.error);
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
                    if ('error' in response) {
                        displayErrorAlert(response.error);
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
        const container = document.getElementById('main-container');
        const roomContainer = document.getElementById('room-container');
        const element = createExpandableRoomContainer(roomData, 'room', true, isUserTeacher() ? getButtons(roomData) : []);
        container?.insertBefore(element, roomContainer);
    }
    catch (err) {
        displayErrorAlert({ message: 'Error fetching data. Please try again.' });
    }
};
const loadAllStudents = async () => {
    const roomId = getRoomIdFromURL();
    try {
        const students = await fetchStudents();
        const roomSchedule = await fetchRoom(roomId);
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
    }
    catch (err) {
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
    const socket = createSocket(roomId);
    try {
        const students = await fetchStudents();
        const roomSchedule = await fetchRoom(roomId);
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
        socket.on('room status update', (roomStatus) => {
            const roomStatusElement = document.getElementById('room-status');
            roomStatusElement?.removeAttribute('class');
            roomStatusElement?.setAttribute('class', `room-status room-status--${roomStatus}`);
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
