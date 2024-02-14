import { isUserStudent } from '../utils/user.js';
export const createSocket = (roomId) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const socket = io('http://localhost:8080/', { query: { roomId }, auth: { token, role } });
    socket.on('student joined queue', (userId) => {
        console.log('student joined queue', userId);
    });
    socket.on('student left queue', (userId) => {
        console.log('student left queue - T', userId);
    });
    if (isUserStudent()) {
        const token = localStorage.getItem("accessToken");
        socket.on('room status update', (roomStatus) => {
            console.log('room status update');
            console.log(roomStatus);
        });
        socket.on('receive resource', (resource, userToken) => {
            if (token == userToken) {
                console.log('receive resource');
                console.log(resource);
            }
        });
    }
    return {
        emit: ({ event, data }) => socket.emit(event, data),
        on: (...args) => socket.on(...args)
    };
};
