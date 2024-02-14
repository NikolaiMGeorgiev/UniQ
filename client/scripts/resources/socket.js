export const createSocket = (roomId) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    // @ts-ignore
    const socket = io('http://localhost:8080/', { query: { roomId }, auth: { token, role } });
    socket.on('student joined queue', (userId) => {
        console.log('student joined queue', userId);
    });
    socket.on('student left queue', (userId) => {
        console.log('student left queue - T', userId);
    });
    return {
        emit: ({ event, data }) => socket.emit(event, data),
        on: (...args) => socket.on(...args)
    };
};
