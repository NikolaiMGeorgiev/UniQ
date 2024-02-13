export const createSocket = () => {
    const socket = io('http://localhost:8080/');
    socket.on("user joined room", (data) => {
        console.log(data.userId);
    });
    socket.on("user left room", (data) => {
        console.log(data.userId);
    });
    socket.on("room status update", (data) => {
        console.log(data.status);
    });
    return {
        emit: ({ event, data }) => socket.emit(event, data),
        on: (...args) => socket.on(...args)
    };
};
