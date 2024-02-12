export const createSocket = () => {
    const socket = io('http://localhost:8080/');
    return {
        emit: ({ event, data }) => socket.emit(event, data),
        on: (...args) => socket.on(...args)
    };
};
