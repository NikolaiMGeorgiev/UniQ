import { displayErrorAlert } from './components/alert.js';
import { createExpandableRoomContainer } from './components/expandableRoomContainer.js';
import { deleteRoom, getRooms } from './resources/api.js';
import createElement from './utils/element.js';
import { redirect } from './utils/redirect.js';
import { isUserLoggedIn, isUserStudent, isUserTeacher } from './utils/user.js';
const handleDeleteRoom = async (roomId) => {
    try {
        const response = await deleteRoom(roomId);
        if ('error' in response) {
            displayErrorAlert({ message: 'Error deleting data. Please try again.' });
            return;
        }
        document.querySelector(`#item-${roomId}`)?.remove();
    }
    catch (err) {
        displayErrorAlert({ message: 'Error deleting data. Please try again.' });
    }
};
const getButtons = (roomId) => {
    const joinButton = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'button-success' },
            { name: 'id', value: `button-join-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Join' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => redirect({ path: 'room', id: roomId }),
            },
        ],
    };
    const editButton = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'rooms-button-edit' },
            { name: 'id', value: `button-edit-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Edit' }],
        eventListeners: [
            {
                event: 'click',
                listener: () => redirect({ path: 'add-edit', id: roomId }),
            },
        ],
    };
    const deleteButton = {
        tagName: 'button',
        attributes: [
            { name: 'class', value: 'rooms-button-delete' },
            { name: 'id', value: `button-delete-${roomId}` },
        ],
        properties: [{ name: 'innerHTML', value: 'Delete' }],
        eventListeners: [
            {
                event: 'click',
                listener: async () => {
                    await handleDeleteRoom(roomId);
                },
            },
        ],
    };
    return isUserStudent() ? [joinButton] : [joinButton, editButton, deleteButton];
};
const displayElements = (data) => {
    const roomsContainer = document.getElementById('rooms-container');
    const footer = document.getElementById('footer');
    if (roomsContainer?.children.length) {
        roomsContainer.replaceChildren();
    }
    data.forEach((roomData) => {
        const element = createExpandableRoomContainer(roomData, 'rooms', false, getButtons(roomData.id));
        roomsContainer?.appendChild(element);
    });
    if (isUserTeacher() && !footer?.children.length) {
        const addRoomButton = createElement({
            tagName: 'button',
            attributes: [
                { name: 'id', value: 'button-add-room' },
                { name: 'class', value: 'button-primary' },
            ],
            properties: [
                { name: 'innerHTML', value: 'Add room' },
            ],
            eventListeners: [
                { event: 'click', listener: () => redirect({ path: 'add-edit' }) }
            ]
        });
        footer?.appendChild(addRoomButton);
    }
};
const updateDisplayedElements = (data) => {
    const roomsContainer = document.getElementById('rooms-container');
    data.map((roomData) => {
        const elementToUpdate = document.getElementById(`item-${roomData.id}`);
        const updatedElement = createExpandableRoomContainer(roomData, 'rooms', false, getButtons(roomData.id));
        if (elementToUpdate) {
            roomsContainer?.insertBefore(updatedElement, elementToUpdate);
            roomsContainer?.removeChild(elementToUpdate);
        }
        else {
            roomsContainer?.appendChild(updatedElement);
        }
    });
};
const loadData = async () => {
    try {
        const roomsData = await getRooms();
        if (roomsData.success) {
            displayElements(roomsData.data);
        }
    }
    catch (err) {
        displayErrorAlert({ message: 'Error loading data. Please try again.' });
    }
};
(() => {
    if (!isUserLoggedIn()) {
        return redirect({ path: 'login' });
    }
    loadData();
})();
