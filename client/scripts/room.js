import { createExpandableRoomContainer } from './components/expandableRoomContainer.js';
import { fetchRoom, fetchStudents, updateRoom } from './resources/api.js';
import { getRoomIdFromURL } from './utils/getRoomIdFromURL.js';
import { redirect } from './utils/redirect.js';
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user.js';
const getButtons = () => {
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
                listener: () => console.log('@@@ Break clicked'),
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
            { event: 'click', listener: () => console.log('@@@ End clicked') },
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
        const roomData = await fetchRoom(roomId);
        // const studentsData = await fetchRoom(roomId)
        if (!roomData.success) {
            // TODO: handle error
            // if 401 -> redirect to login
            return;
        }
        if (!roomData.data) {
            return redirect({ path: 'rooms' });
        }
        if (isUserStudent() &&
            (roomData.data.status === 'closed' ||
                roomData.data.status === 'not-started')) {
            return redirect({ path: 'rooms' });
        }
        const container = document.getElementById('main-container');
        const roomContainer = document.getElementById('room-container');
        const element = createExpandableRoomContainer(roomData.data, 'room', true, isUserTeacher() ? getButtons() : []);
        container?.insertBefore(element, roomContainer);
    }
    catch (err) {
        // TODO: handle error
    }
};
const loadAllStudents = async () => {
    try {
        const students = await fetchStudents();
        if (!students.success) {
            // todo: handle error
            return;
        }
    }
    catch (err) {
        // todo: handle error
    }
};
const loadSingleStudent = async () => { };
(async () => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login' });
    }
    if (isUserTeacher()) {
        await loadAllStudents();
        const roomId = getRoomIdFromURL();
        if (!roomId) {
            return redirect({ path: 'rooms' });
        }
        await updateRoom(roomId, JSON.stringify({ status: "started" }));
    }
    else {
        await loadSingleStudent();
    }
    await loadRoomData();
})();
